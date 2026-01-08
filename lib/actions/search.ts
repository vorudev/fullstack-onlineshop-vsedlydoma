'use server';
import { db } from "@/db/drizzle";
import { Product, products, productAttributes, orderItems, orders, categories, productImages, reviews, Manufacturer, manufacturers, manufacturerImages, filters } from "@/db/schema";
import { desc, eq, sql, gte, inArray, lte, notInArray, asc, getTableColumns, placeholder, ilike, or, and  } from "drizzle-orm";
import { getFilters } from "./filter-categories";

interface FilterParams {
    [filterSlug: string]: string[]; // { "processor": ["f9864ee0-5645-4903-98fc-fafbf93f9252"] }
  }
  export async function getSearchResults(
    query: string,
    selectedFilters?: FilterParams,
    priceFrom?: number,
    priceTo?: number,
    page: number = 1,
    limit: number = 20,

  ) {
    const INITIAL_RESULT_LIMIT = 100;
  
    // Base search condition
    const baseSearchCondition = or(
      sql`similarity(${products.title}, ${query}) > 0.1`,
      sql`similarity(${products.description}, ${query}) > 0.1`,
      ilike(products.sku, `%${query}%`)
    );

    // ===== ШАГ 1: Быстрый запрос для получения категорий из базового поиска =====
    const categorySearch = await db
      .selectDistinct({ categoryId: products.categoryId })
      .from(products)
      .where(and(
        baseSearchCondition,
        eq(products.isActive, true)
      ))
      .limit(500);

    const allCategoryIds = categorySearch
      .map(item => item.categoryId)
      .filter((id): id is string => id !== null);
    
    // Получаем все доступные фильтры и производителей на основе категорий
    let availableFilters = [];
    let availableManufacturers: Array<{
      id: string;
      name: string;
      slug: string;
    }> = [];
    
    if (allCategoryIds.length > 0) {
      // Параллельно получаем фильтры и производителей
      [availableFilters, availableManufacturers] = await Promise.all([
        getFilters(allCategoryIds),
        db
          .selectDistinct({
            id: manufacturers.id,
            name: manufacturers.name,
            slug: manufacturers.slug,
          })
          .from(products)
          .innerJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
          .where(and(
            inArray(products.categoryId, allCategoryIds),
            eq(products.isActive, true),
            baseSearchCondition // Добавляем условие поиска
          ))
      ]);
    }

    // ===== ШАГ 2: Получаем отфильтрованные товары =====
    
    // NO filters - simple search
    if (!selectedFilters || Object.keys(selectedFilters).length === 0) {
      const items = await db.query.products.findMany({
        where: and(
          baseSearchCondition,
          eq(products.isActive, true), // <- добавить!
          priceFrom ? gte(products.priceRegional, priceFrom) : undefined,
          priceTo ? lte(products.priceRegional, priceTo) : undefined
        ),
        limit: limit
      });
      
      const itemIds = items.map(r => r.id);

      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(
          baseSearchCondition,
          eq(products.isActive, true),)); 

      const [images, ratings, attributes] = await Promise.all([
        db.query.productImages.findMany({
          where: inArray(productImages.productId, itemIds),
          orderBy: (productImages, { desc }) => [
            desc(productImages.isFeatured), 
            desc(productImages.order)
          ]
        }),
        
        db.select({
          productId: reviews.product_id,
          averageRating: sql<number>`AVG(${reviews.rating})`,
          reviewCount: sql<number>`COUNT(${reviews.id})`,
        })
        .from(reviews)
        .where(inArray(reviews.product_id, itemIds))
        .groupBy(reviews.product_id),

        db.query.productAttributes.findMany({
          where: inArray(productAttributes.productId, itemIds),
          
                  })
      ]);
       
      
    
      // Создаем Map для рейтингов
      const ratingsMap = new Map(
        ratings.map(r => [r.productId, { 
          averageRating: r.averageRating, 
          reviewCount: r.reviewCount 
        }])
      );
      const imagesMap = new Map();
images.forEach(img => {
  if (!imagesMap.has(img.productId)) {
    imagesMap.set(img.productId, img); // Берем первое (featured или с наибольшим order)
  }
});
      
      
      // Объединяем все данные
      const productsWithDetails = items.map(item => ({
        ...item,
        averageRating: ratingsMap.get(item.id)?.averageRating || 0,
        reviewCount: ratingsMap.get(item.id)?.reviewCount || 0,
      
      }));
      
      const categoryIds = [...new Set(items.map(item => item.categoryId))];
      
      if (categoryIds.length === 1 && items.length < INITIAL_RESULT_LIMIT) {
        const categoryId = categoryIds[0];
        
        if (categoryId) {
          const category = await db.query.categories.findFirst({
            where: eq(categories.id, categoryId),
            columns: {
              slug: true,
            }
          });
          
          if (category) {
            return { redirect: `/products?category=${category.slug}` };
          }
        }
      }
      
      return { 
        items: productsWithDetails,
        images: images, 
        attributes: attributes,
        filters: availableFilters, 
        categories: categoryIds,
        availableManufacturers,
        pagination: {
          page,
          totalPages: Math.ceil(totalCount[0].count / limit),
          total: totalCount[0].count,
        },
      };
    }
  
    // WITH filters - separate manufacturer from attributes
    const { manufacturer: manufacturerIds, ...attributeFilters } = selectedFilters;
  
    // Convert filter IDs to filter names
    const allFilterIds = Object.values(attributeFilters).flat();
    let filtersBySlug: Record<string, string[]> = {};
  
    if (allFilterIds.length > 0) {
      const selectedFilterData = await db
        .select({
          id: filters.id,
          slug: filters.slug,
          name: filters.name    
        })
        .from(filters)
        .where(inArray(filters.id, allFilterIds));
  
      // Group by slug
      for (const [slug, filterIds] of Object.entries(attributeFilters)) {
        const filterNames = selectedFilterData
          .filter(f => filterIds.includes(f.id))
          .map(f => f.name);
        
        if (filterNames.length > 0) {
          filtersBySlug[slug] = filterNames;
        }
      }
    }
  
    const hasAttributeFilters = Object.keys(filtersBySlug).length > 0;
    const hasManufacturerFilter = manufacturerIds && manufacturerIds.length > 0;
  
    // Build WHERE conditions
    const whereConditions = [
      baseSearchCondition,
      eq(products.isActive, true) // <- добавить!
    ];
    
    if (priceFrom) whereConditions.push(gte(products.priceRegional, priceFrom));
    if (priceTo) whereConditions.push(lte(products.priceRegional, priceTo));
    if (hasManufacturerFilter) {
      whereConditions.push(inArray(products.manufacturerId, manufacturerIds));
    }
  
    let items;
  
    // Case 1: WITH attribute filters - use subquery
    if (hasAttributeFilters) {
      const subquery = db
        .select({ 
          productId: productAttributes.productId,
          filterCount: sql<number>`COUNT(DISTINCT ${productAttributes.slug})`.as('filter_count')
        })
        .from(productAttributes)
        .where(
          sql`(${productAttributes.slug}, ${productAttributes.value}) IN (${sql.join(
            Object.entries(filtersBySlug).flatMap(([slug, names]) =>
              names.map(name => sql`(${slug}, ${name})`)
            ),
            sql`, `
          )})`
        )
        .groupBy(productAttributes.productId)
        .having(sql`COUNT(DISTINCT ${productAttributes.slug}) = ${Object.keys(filtersBySlug).length}`)
        .as('filtered_products');
  
      items = await db
        .select({
          id: products.id,
          slug: products.slug,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          categoryId: products.categoryId,
          inStock: products.inStock,
          price: products.price,
          priceRegional: products.priceRegional,
          isActive: products.isActive,
          title: products.title,
          description: products.description,
          keywords: products.keywords,
          manufacturerId: products.manufacturerId,
          sku: products.sku,
        })
        .from(products)
        .innerJoin(subquery, eq(products.id, subquery.productId))
        .where(and(...whereConditions))
        .limit(limit);

        const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...whereConditions));

        const itemIds = items.map(r => r.id);
        const [images, ratings, attributes] = await Promise.all([
          db.query.productImages.findMany({
            where: inArray(productImages.productId, itemIds),
            orderBy: (productImages, { desc }) => [
              desc(productImages.isFeatured), 
              desc(productImages.order)
            ]
          }),
         
         db.select({
           productId: reviews.product_id,
           averageRating: sql<number>`AVG(${reviews.rating})`,
           reviewCount: sql<number>`COUNT(${reviews.id})`,
         })
         .from(reviews)
         .where(inArray(reviews.product_id, itemIds))
         .groupBy(reviews.product_id),
 
         db.query.productAttributes.findMany({
           where: inArray(productAttributes.productId, itemIds),
           
                   })
       ]);
        const ratingsMap = new Map(
          ratings.map(r => [r.productId, { 
            averageRating: r.averageRating, 
            reviewCount: r.reviewCount 
          }])
        );
        const attributesMap = new Map( 
          attributes.map(r =>[r.productId, {
            attributes
          }])
        )
        
        // Объединяем все данные
        const productsWithDetails = items.map(item => ({
          ...item,
          averageRating: ratingsMap.get(item.id)?.averageRating || 0,
          reviewCount: ratingsMap.get(item.id)?.reviewCount || 0,
        
        }));
        const categoryIds = [...new Set(items.map(item => item.categoryId))];
      
        return { 
        items: productsWithDetails,
        images:images, 
        attributes: attributes,
        pagination: {
          page,
          totalPages: Math.ceil(totalCount[0].count / limit),
          total: totalCount[0].count,
        },
          filters: availableFilters,
          categories: categoryIds, 
          availableManufacturers
        };
    } 
    // Case 2: NO attribute filters - just manufacturer/price/search
    else {
      items = await db
        .select()
        .from(products)
        .where(and(...whereConditions))
        .limit(limit);

        const itemIds = items.map(r => r.id);

        const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...whereConditions)); 

        const [images, ratings, attributes] = await Promise.all([
          db.query.productImages.findMany({
            where: inArray(productImages.productId, itemIds),
            orderBy: (productImages, { desc }) => [
              desc(productImages.isFeatured), 
              desc(productImages.order)
            ]
          }),
         
         db.select({
           productId: reviews.product_id,
           averageRating: sql<number>`AVG(${reviews.rating})`,
           reviewCount: sql<number>`COUNT(${reviews.id})`,
         })
         .from(reviews)
         .where(inArray(reviews.product_id, itemIds))
         .groupBy(reviews.product_id),
 
         db.query.productAttributes.findMany({
           where: inArray(productAttributes.productId, itemIds), 

                   })
       ]);
      const ratingsMap = new Map(
        ratings.map(r => [r.productId, { 
          averageRating: r.averageRating, 
          reviewCount: r.reviewCount 
        }])
      );
      
      
      // Объединяем все данные
      const productsWithDetails = items.map(item => ({
        ...item,
        averageRating: ratingsMap.get(item.id)?.averageRating || 0,
        reviewCount: ratingsMap.get(item.id)?.reviewCount || 0,
      
      }));
      const categoryIds = [...new Set(items.map(item => item.categoryId))];
    
      return { 
      items: productsWithDetails,
      images: images, 
      attributes: attributes,
      pagination: {
        page,
        totalPages: Math.ceil(totalCount[0].count / limit),
        total: totalCount[0].count,
      },
        filters: availableFilters,
        categories: categoryIds, 
        availableManufacturers
      };
    }
  
   
  }