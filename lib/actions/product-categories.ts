'use server';

import { db } from "@/db/drizzle";
import { categories, Category, filters, manufacturers, productImages, reviews, categoryImages, filterCategories } from "@/db/schema";
import { eq, ilike, or, gte, lte  } from "drizzle-orm";
import { ProductImage } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { products } from "@/db/schema";
import { isNull } from "drizzle-orm";
import { productAttributes } from "@/db/schema";
import { and, inArray, sql } from "drizzle-orm";
import { create } from "domain";


type CategoryBreadcrumb = {
  id: string;
  name: string;
  slug: string;
};
type ProductWithChain = {
  product: typeof products.$inferSelect;
  categoryChain: CategoryBreadcrumb[];
};
interface FilterParams {
  [filterSlug: string]: string[]; // { "processor": ["f9864ee0-5645-4903-98fc-fafbf93f9252"] }
}
interface CategoryParams { 
  page?: number;
  pageSize?: number;
  search?: string;
}


export async function getFilteredProducts(
  categoryId: string,
  selectedFilters?: FilterParams,
  page: number = 1,
  limit: number = 20,
  priceFrom?: number,
  priceTo?: number
) {
  try {
    // 1. Получаем всех уникальных производителей в категории (до фильтрации)
    const availableManufacturers = await db
      .selectDistinct({
        id: manufacturers.id,
        name: manufacturers.name,
        slug: manufacturers.slug,
      })
      .from(products)
      .innerJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
      .where(eq(products.categoryId, categoryId));

    // Функция для добавления условий цены
    const addPriceConditions = (conditions: any[]) => {
      if (priceFrom !== undefined && priceFrom > 0) {
        conditions.push(gte(products.price, priceFrom));
      }
      if (priceTo !== undefined && priceTo > 0) {
        conditions.push(lte(products.price, priceTo));
      }
      return conditions;
    };

    // 2. Если фильтры не выбраны - возвращаем все продукты (с учетом цены)
    if (!selectedFilters || Object.keys(selectedFilters).length === 0) {
      const whereConditions = addPriceConditions([eq(products.categoryId, categoryId)]);
        

      const result = await db
        .select()
        .from(products)
        .where(and(...whereConditions))
        .limit(limit)
        .offset((page - 1) * limit);
      
      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...whereConditions));
      const productIds = result.map(r => r.id);
    const [images, ratings] = await Promise.all([
  db.select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds)),
  
  // ДОБАВЛЯЕМ GROUP BY product_id
  db.select({
    productId: reviews.product_id,
    averageRating: sql<number>`AVG(${reviews.rating})`,
    reviewCount: sql<number>`COUNT(${reviews.id})`,
  })
  .from(reviews)
  .where(inArray(reviews.product_id, productIds))
  .groupBy(reviews.product_id) // ← ВОТ ЭТО КЛЮЧЕВОЕ!
]);


const ratingsMap = new Map(
  ratings.map(r => [r.productId, { 
    averageRating: r.averageRating, 
    reviewCount: r.reviewCount 
  }])
);
const productsWithDetails = result.map(product => ({
  ...product,
  averageRating: ratingsMap.get(product.id)?.averageRating || 0,
  reviewCount: ratingsMap.get(product.id)?.reviewCount || 0,
}));

      return {
       productsWithDetails,
        images: images,
        pagination: {
          page,
          totalPages: Math.ceil(totalCount[0].count / limit),
          total: totalCount[0].count,
        },
        availableManufacturers,
      };
    }

    // 3. Разделяем фильтры на производителей и атрибуты
    const { manufacturer: manufacturerIds, ...attributeFilters } = selectedFilters;

    // 4. Получаем данные выбранных фильтров атрибутов
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

      // Группируем по slug
      for (const [slug, filterIds] of Object.entries(attributeFilters)) {
        const filterNames = selectedFilterData
          .filter(f => filterIds.includes(f.id))
          .map(f => f.name);
        
        if (filterNames.length > 0) {
          filtersBySlug[slug] = filterNames;
        }
      }
    }


    // 5. Строим условия для WHERE
    const hasAttributeFilters = Object.keys(filtersBySlug).length > 0;
    const hasManufacturerFilter = manufacturerIds && manufacturerIds.length > 0;

    // Случай 1: Есть фильтры по атрибутам
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

      // Строим условия WHERE (с ценой)
      const whereConditions = addPriceConditions([eq(products.categoryId, categoryId)]);
      if (hasManufacturerFilter) {
        whereConditions.push(inArray(products.manufacturerId, manufacturerIds));
      }

      const result = await db
        .select()
        .from(products)
        .innerJoin(subquery, eq(products.id, subquery.productId))
        .where(and(...whereConditions))
        .limit(limit)
        .offset((page - 1) * limit);

   const [{count}] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .innerJoin(subquery, eq(products.id, subquery.productId)) // ← ДОБАВИЛИ JOIN
    .where(and(...whereConditions));
  
      const productIds = result.map(r => r.products.id);
       const [images, ratings] = await Promise.all([
  db.select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds)),
  
  // ДОБАВЛЯЕМ GROUP BY product_id
  db.select({
    productId: reviews.product_id,
    averageRating: sql<number>`AVG(${reviews.rating})`,
    reviewCount: sql<number>`COUNT(${reviews.id})`,
  })
  .from(reviews)
  .where(inArray(reviews.product_id, productIds))
  .groupBy(reviews.product_id) // ← ВОТ ЭТО КЛЮЧЕВОЕ!
]);


const ratingsMap = new Map(
  ratings.map(r => [r.productId, { 
    averageRating: r.averageRating, 
    reviewCount: r.reviewCount 
  }])
);
const productsWithDetails = result.map(row => {
  const product = 'products' in row ? row.products : row;

  return {
    ...product,
    averageRating: ratingsMap.get(product.id)?.averageRating || 0,
    reviewCount: ratingsMap.get(product.id)?.reviewCount || 0,
  };
});

      return {
        productsWithDetails,
        images: images,
        pagination: {
          page,
          totalPages: Math.ceil(count / limit),
        total: count,
        },
        availableManufacturers,
      };
    }

    // Случай 2: Только фильтр по производителям (без атрибутов, но с ценой)
    const whereConditions = addPriceConditions([eq(products.categoryId, categoryId)]);
    if (hasManufacturerFilter) {
      whereConditions.push(inArray(products.manufacturerId, manufacturerIds));
    }

    const result = await db
      .select()
      .from(products)
      .where(and(...whereConditions))
      .limit(limit)
      .offset((page - 1) * limit);

    const [{count}] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...whereConditions));


      const productIds = result.map(r => r.id);
    const [images, ratings] = await Promise.all([
  db.select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds)),
  
  // ДОБАВЛЯЕМ GROUP BY product_id
  db.select({
    productId: reviews.product_id,
    averageRating: sql<number>`AVG(${reviews.rating})`,
    reviewCount: sql<number>`COUNT(${reviews.id})`,
  })
  .from(reviews)
  .where(inArray(reviews.product_id, productIds))
  .groupBy(reviews.product_id) // ← ВОТ ЭТО КЛЮЧЕВОЕ!
]);


const ratingsMap = new Map(
  ratings.map(r => [r.productId, { 
    averageRating: r.averageRating, 
    reviewCount: r.reviewCount 
  }])
);
const productsWithDetails = result.map(product => ({
  ...product,
  averageRating: ratingsMap.get(product.id)?.averageRating || 0,
  reviewCount: ratingsMap.get(product.id)?.reviewCount || 0,
}));


      return {
        productsWithDetails,
        images: images,
        pagination: {
          page,
          totalPages: Math.ceil(count / limit),
          total: count,

        },
        availableManufacturers,
      };

  } catch (error) {
    console.error("Error filtering products:", error);
    throw new Error("Failed to filter products");
  }
  
}

export async function getRootCategories() {
  return await db
    .select()
    .from(categories)
    .where(isNull(categories.parentId));
}
export async function getSubcategories(parentId: string) {
  return await db
    .select()
    .from(categories)
    .where(eq(categories.parentId, parentId));
}
export async function getCategoryBySlug(slug: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return category;
}
export async function getCategoryById(id: string) { 
  const [category] = await db
  .select()
  .from(categories)
  .where(eq(categories.id, id))
  .limit(1);
return category;
}
export async function getCategoryChain(
  categoryId: string
): Promise<CategoryBreadcrumb[]> {
  // Получаем цепочку категорий
  const categoryChain: CategoryBreadcrumb[] = [];
  let currentCategoryId: string | null = categoryId;

  // Собираем все категории за один запрос (оптимизация)
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      parentId: categories.parentId,
    })
    .from(categories);

  // Создаем Map для быстрого поиска
  const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

  // Строим цепочку
  while (currentCategoryId) {
    const category = categoryMap.get(currentCategoryId);
    if (!category) break;

    categoryChain.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });

    currentCategoryId = category.parentId;
  }

  return categoryChain;
}
export async function getProductWithCategoryChain(
  productSlug: string
): Promise<ProductWithChain | null> {
  // Параллельное получение продукта и всех категорий
  const [productResult, allCategories] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.slug, productSlug))
      .limit(1),
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        parentId: categories.parentId,
      })
      .from(categories)
  ]);

  const productData = productResult[0];
  
  if (!productData?.categoryId) {
    return null;
  }

  // Создаем Map для O(1) поиска
  const categoryMap = new Map(
    allCategories.map((cat) => [cat.id, cat])
  );

  // Строим цепочку от конечной категории к корневой
  const categoryChain: CategoryBreadcrumb[] = [];
  let currentCategoryId: string | null = productData.categoryId;
  
  // Защита от бесконечного цикла (циклические ссылки)
  const visited = new Set<string>();
  
  while (currentCategoryId && !visited.has(currentCategoryId)) {
    const category = categoryMap.get(currentCategoryId);
    if (!category) break;
    
    visited.add(currentCategoryId);
    categoryChain.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
    
    currentCategoryId = category.parentId;
  }

  return {
    product: productData,
    categoryChain,
  };
}

// Альтернатива: если категорий много, но нужны только связанные
export async function getProductWithCategoryChainOptimized(
  productSlug: string
): Promise<ProductWithChain | null> {
  // Сначала получаем продукт
  const [productData] = await db
    .select()
    .from(products)
    .where(eq(products.slug, productSlug))
    .limit(1);

  if (!productData?.categoryId) {
    return null;
  }

  // Рекурсивный CTE для получения только нужных категорий
  // Это эффективнее если у вас тысячи категорий
  const categoryChain = await db.execute(sql`
    WITH RECURSIVE category_path AS (
      -- Базовый случай: начальная категория
      SELECT 
        id, 
        name, 
        slug, 
        parent_id,
        1 as depth
      FROM categories
      WHERE id = ${productData.categoryId}
      
      UNION ALL
      
      -- Рекурсивный случай: родительские категории
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        cp.depth + 1
      FROM categories c
      INNER JOIN category_path cp ON c.id = cp.parent_id
      WHERE cp.depth < 10  -- защита от бесконечной рекурсии
    )
    SELECT id, name, slug
    FROM category_path
    ORDER BY depth DESC
  `);

  return {
    product: productData,
    categoryChain: categoryChain.rows as CategoryBreadcrumb[],
  };
}

// Вариант с кешированием для часто запрашиваемых продуктов
const categoryChainCache = new Map<string, CategoryBreadcrumb[]>();

export async function getProductWithCategoryChainCached(
  productSlug: string,
  cacheTTL = 5 * 60 * 1000 // 5 минут
): Promise<ProductWithChain | null> {
  const [productData] = await db
    .select()
    .from(products)
    .where(eq(products.slug, productSlug))
    .limit(1);

  if (!productData?.categoryId) {
    return null;
  }

  const cacheKey = `chain:${productData.categoryId}`;
  
  // Проверяем кеш
  let categoryChain = categoryChainCache.get(cacheKey);
  
  if (!categoryChain) {
    // Строим цепочку
    const allCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        parentId: categories.parentId,
      })
      .from(categories);

    const categoryMap = new Map(
      allCategories.map((cat) => [cat.id, cat])
    );

    categoryChain = [];
    let currentCategoryId: string | null = productData.categoryId;
    const visited = new Set<string>();

    while (currentCategoryId && !visited.has(currentCategoryId)) {
      const category = categoryMap.get(currentCategoryId);
      if (!category) break;
      
      visited.add(currentCategoryId);
      categoryChain.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
      
      currentCategoryId = category.parentId;
    }

    // Сохраняем в кеш
    categoryChainCache.set(cacheKey, categoryChain);
    
    // Автоочистка кеша
    setTimeout(() => categoryChainCache.delete(cacheKey), cacheTTL);
  }

  return {
    product: productData,
    categoryChain,
  };
}
export async function getCategories() {
    try {
        const allCategories = await db.select().from(categories);
        return allCategories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
}
export const getAllCategories = async ({
  page = 1,
  pageSize = 20,
  search = ''
}: CategoryParams = {}) => {
  try {
    const offset = (page - 1) * pageSize;
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(categories.name, `%${search}%`),
          ilike(categories.description, `%${search}%`),
          ilike(categories.slug, `%${search}%`)
        )
      );
    }

    let query = db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description, 
        parentId: categories.parentId, 
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt
      })
      .from(categories)
      .$dynamic();

    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .$dynamic();

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    const getAllCategories = await query
      .limit(pageSize)
      .offset(offset)
      .orderBy(sql`name ASC`);

    const [{ count }] = await countQuery;

    return {
      categories: getAllCategories,
      pagination: {
        page,
        pageSize,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / pageSize),
      }
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
export async function createCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">) {
    try {
      const session = await auth.api.getSession({
            headers: await headers()
          })
          if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }
        await db.insert(categories).values(category).returning();
    } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
    }
}

export async function updateCategory(category: Omit<Category, "createdAt" | "updatedAt">) {
    try {
      const session = await auth.api.getSession({
            headers: await headers()
          })
          if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }
        await db.update(categories).set(category).where(eq(categories.id, category.id))
    } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
    }
}

export async function deleteCategory(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        

         await db.update(products)
            .set({ categoryId: null })
            .where(eq(products.categoryId, id));
         await db.delete(categoryImages).where(eq(categoryImages.categoryId, id));

        // Затем удаляем категорию
        await db.delete(categories).where(eq(categories.id, id));
        
        return NextResponse.json({ success: true });
        
    } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category");
    }
}
