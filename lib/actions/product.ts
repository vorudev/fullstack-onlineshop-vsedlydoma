'use server';
import { z } from 'zod';

import { db } from "@/db/drizzle";
import { Product, products, productAttributes, orderItems, orders, categories, productImages, reviews, Manufacturer, manufacturers, manufacturerImages } from "@/db/schema";
import { desc, eq, gte, inArray, lte, notInArray, asc, getTableColumns  } from "drizzle-orm";
import { unstable_cache } from 'next/cache';
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sql, ilike, or, and } from 'drizzle-orm';
import { SlowBuffer } from "buffer";
import { sl } from "zod/v4/locales";

export async function getProducts() {
  try {
    const allProducts = await db.select().from(products);
    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
    
}

interface ProductPageParams { 
  limit?: number;
}
export async function getProductsWithDetailsAdmin(id: string, limit: number) {
  try {
    // 1. Получаем основную информацию о продукте
    const [product] = await db
      .select()
      .from(products)
      .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
      .where(eq(products.id, id));

    if (!product) {
      return null;
    }

    // 2. Параллельно выполняем все остальные запросы
    const [productImagesData, reviewsData, attributesData, manufacturerImagesData, breadcrumbsData] = 
      await Promise.all([
        // Изображения продукта
        db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, product.products.id)),
        
        // Отзывы
        db
          .select()
          .from(reviews)
          .where(and(eq(reviews.product_id, product.products.id), eq(reviews.status, 'approved')))
          .limit(limit),

        
        // Атрибуты
        db
          .select()
          .from(productAttributes)
          .where(eq(productAttributes.productId, product.products.id))
          .orderBy(asc(productAttributes.order)),

         
        
        // Изображения производителя
        product.manufacturers?.id
          ? db
              .select()
              .from(manufacturerImages)
              .where(eq(manufacturerImages.manufacturerId, product.manufacturers.id))
          : Promise.resolve([]),
          // breadcrumbs
        product.products.categoryId ? db.select().from(categories).where(eq(categories.id, product.products.categoryId)) : Promise.resolve([]),
    
      ]);

    // Вычисляем средний рейтинг
    const averageRating = reviewsData.length > 0
      ? reviewsData.reduce((acc, r) => acc + r.rating!, 0) / reviewsData.length
      : 0;

    // Формируем результат
    return {
      id: product.products.id,
      title: product.products.title,
      description: product.products.description,
      price: product.products.price,
      sku: product.products.sku,
      slug: product.products.slug,
      inStock: product.products.inStock,
      categoryId: product.products.categoryId,
      manufacturerId: product.products.manufacturerId,
      createdAt: product.products.createdAt,
      updatedAt: product.products.updatedAt,
      images: productImagesData,
      reviews: reviewsData,
      attributes: attributesData,
      manufacturer: product.manufacturers ? {
        ...product.manufacturers,
        images: manufacturerImagesData,
      } : null,
      averageRating,
      reviewCount: reviewsData.length,
      breadcrumbs: breadcrumbsData[0] ? breadcrumbsData[0] : null,
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error("Failed to fetch product details");
  }
}
export async function getProductsWithDetailsLeftJoin(slug: string, limit: number) {
  try {
    // 1. Получаем основную информацию о продукте
    const [product] = await db
      .select()
      .from(products)
      .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
      .where(eq(products.slug, slug));

    if (!product) {
      return null;
    }

    // 2. Параллельно выполняем все остальные запросы
    const [productImagesData, reviewsData, attributesData, manufacturerImagesData] = 
      await Promise.all([
        // Изображения продукта
        db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, product.products.id)),
        
        // Отзывы
        db
          .select()
          .from(reviews)
          .where(and(eq(reviews.product_id, product.products.id), eq(reviews.status, 'approved')))
          .limit(limit),

        
        // Атрибуты
        db
          .select()
          .from(productAttributes)
          .where(eq(productAttributes.productId, product.products.id))
          .orderBy(asc(productAttributes.order)),

         
        
        // Изображения производителя
        product.manufacturers?.id
          ? db
              .select()
              .from(manufacturerImages)
              .where(eq(manufacturerImages.manufacturerId, product.manufacturers.id))
          : Promise.resolve([]),
          // breadcrumbs
    
      ]);

    // Вычисляем средний рейтинг
    const averageRating = reviewsData.length > 0
      ? reviewsData.reduce((acc, r) => acc + r.rating!, 0) / reviewsData.length
      : 0;

    // Формируем результат
    return {
      id: product.products.id,
      title: product.products.title,
      description: product.products.description,
      price: product.products.price,
      sku: product.products.sku,
      slug: product.products.slug,
      inStock: product.products.inStock,
      categoryId: product.products.categoryId,
      manufacturerId: product.products.manufacturerId,
      createdAt: product.products.createdAt,
      updatedAt: product.products.updatedAt,
      images: productImagesData,
      reviews: reviewsData,
      attributes: attributesData,
      manufacturer: product.manufacturers ? {
        ...product.manufacturers,
        images: manufacturerImagesData,
      } : null,
      averageRating,
      reviewCount: reviewsData.length,
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error("Failed to fetch product details");
  }
}
export async function getProductWithDetails(id: string) {
  try {
    const [product,  images, productReviews] = await Promise.all([
      db.select(
        {
          id: products.id,
          title: products.title,
          description: products.description,
          price: products.price,
          sku: products.sku,
          slug: products.slug,
          categoryId: products.categoryId,
          manufacturerId: products.manufacturerId,
        }
      ).from(products).where(eq(products.id, id)),
      db.select(
        {
          id: productImages.id,
          productId: productImages.productId,
          isFeatured: productImages.isFeatured,
          imageUrl: productImages.imageUrl,
        }
      ).from(productImages).where(eq(productImages.productId, id)).orderBy(desc(productImages.isFeatured)),
      db.select(
        {
          id: reviews.id,
          productId: reviews.product_id,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
        }
      ).from(reviews).where(eq(reviews.product_id, id)),
    ]);
const productDetails = {
  ...product[0],
  images,
  productReviews,
};
    return productDetails;

  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error("Failed to fetch product details");
  }
}
interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  manufacturer?: string; 
}
export const getRandomProductsFast = async ({
  limit = 10,
  category,
  manufacturer,
}: {
  limit?: number;
  category?: string;
  manufacturer?: string;
} = {}) => {
  try {
    let query = db.select().from(products);
    
    const conditions = [];
    
    if (category) {
      conditions.push(eq(products.categoryId, category));
    }
    
    if (manufacturer) {
      conditions.push(eq(products.manufacturerId, manufacturer));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const result = await query
      .orderBy(sql`RANDOM()`)
      .limit(limit);
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
      images: images
    };
  } catch (error) {
    console.error("Error fetching random products:", error);
    throw new Error("Failed to fetch random products");
  }
};
const serverSearchSchema = z
  .string()
  .max(200, 'Поисковый запрос слишком длинный')
  .transform((val) => val.trim())
  // Удаляем все потенциально опасные символы
  .transform((val) => 
    val
      .replace(/[<>{}[\]\\]/g, '') // Удаляем скобки и слеши
      .replace(/['"`;]/g, '') // Удаляем кавычки и точку с запятой
      .replace(/--/g, '') // Удаляем SQL комментарии
      .replace(/\/\*/g, '') // Удаляем многострочные комментарии
      .replace(/\*\//g, '')
  )
  // Блокируем SQL команды
  .refine(
    (val) => !/(union|select|insert|update|delete|drop|truncate|exec|execute|declare|cast|convert|script|alert|eval|expression)/gi.test(val),
    'Недопустимые символы в запросе'
  )
  // Блокируем специальные SQL символы
  .refine(
    (val) => !/(\||&&|;|--|\/\*|\*\/|xp_|sp_)/gi.test(val),
    'Недопустимые символы в запросе'
  )
  // Проверка на пустую строку после очистки
  .refine((val) => val.length > 0, 'Пустой поисковый запрос')
  .catch(''); // Возвращаем пустую строку при ошибке

const pageSchema = z.coerce
  .number()
  .int()
  .positive()
  .min(1)
  .max(10000)
  .catch(1);

const pageSizeSchema = z.coerce
  .number()
  .int()
  .positive()
  .min(1)
  .max(100)
  .catch(20);

const uuidSchema = z
  .string()
  .uuid()
  

const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Недопустимые символы в категории/производителе')
  .max(100)

function sanitizeString(str: string | null | undefined): string {
  if (!str) return '';
  
  return str
    .trim()
    .slice(0, 200) // Ограничиваем длину
    .replace(/[<>{}[\]\\'"`;]/g, '') // Удаляем опасные символы
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/--/g, '')
    .replace(/\/\*|\*\//g, '');
}

/**
 * Экранирование спецсимволов для LIKE запросов
 */
function escapeLikePattern(str: string): string {
  return str
    .replace(/\\/g, '\\\\') // Экранируем обратный слеш
    .replace(/%/g, '\\%')   // Экранируем %
    .replace(/_/g, '\\_');  // Экранируем _
}

export async function searchProducts(query: string, limit = 20) {
  const productsResult = await db
    .select({
      id: products.id,
      title: products.title,
      price: products.price,
      slug: products.slug,
      sku: products.sku,
      // Оценка похожести (0..1)
      similarity: sql<number>`similarity(${products.title}, ${query})`,
    })
    .from(products)
    .where(
      // Оператор % - "похоже на"
      sql`${products.title} % ${query}`
      // ИЛИ явно указать порог:
      // sql`similarity(${products.title}, ${query}) > 0.3`
    )
    .orderBy(
      // Сортировка по релевантности
      sql`similarity(${products.title}, ${query}) DESC`
    )
    .limit(limit);
    return productsResult;
}


export const getAllProducts = async ({
  page = 1,
  pageSize = 20,
  search = '',
  category,
  manufacturer
}: GetProductsParams = {}) => {
  try {
    // Валидация всех параметров
    const validatedPage = pageSchema.parse(page);
    const validatedPageSize = pageSizeSchema.parse(pageSize);
    
    // Двойная санитизация поискового запроса
    const sanitizedSearch = sanitizeString(search);
    const validatedSearch = serverSearchSchema.parse(sanitizedSearch);
    
    // Валидация category и manufacturer (должны быть slugs)
    const validatedCategory = category ? slugSchema.parse(category) : null;
    const validatedManufacturer = manufacturer ? slugSchema.parse(manufacturer) : null;

    const offset = (validatedPage - 1) * validatedPageSize;
    const conditions = [];

    // Обработка поискового запроса
    if (validatedSearch) {
      // Экранируем спецсимволы для LIKE
      const escapedSearch = escapeLikePattern(validatedSearch);
      const searchPattern = `%${escapedSearch}%`;

      const searchConditions = [
        sql`similarity(${products.title}, ${validatedSearch}) > 0.1`,
        sql`similarity(${products.description}, ${validatedSearch}) > 0.1`,
        ilike(products.sku, `%${validatedSearch}%`),
         


      ];


      // Поиск по числовым полям (цена)
      const numericSearch = Number(validatedSearch);
      if (!isNaN(numericSearch) && numericSearch > 0 && numericSearch < 1000000) {
        searchConditions.push(
          eq(products.price, numericSearch)
        );
      }

      conditions.push(or(...searchConditions));
    }

    // Добавляем фильтры по категории и производителю
    if (validatedCategory) {
      conditions.push(eq(products.categoryId, validatedCategory));
    }

    if (validatedManufacturer) {
      conditions.push(eq(products.manufacturerId, validatedManufacturer));
    }
    // Базовые запросы
    let query = db
      .select({
        ...getTableColumns(products),
    relevance: validatedSearch 
      ? sql<number>`GREATEST(
          similarity(${products.title}, ${validatedSearch}) * 3,
          similarity(${products.description}, ${validatedSearch}) * 1
        )`
      : sql<number>`0`
  })
      
      .from(products)
      .$dynamic();
   
    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .$dynamic();
   
    // Применяем фильтры
    if (conditions.length > 0) {
      const whereClause = and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
   
    // Выполняем запросы параллельно для скорости
    const [allProducts, [{ count }]] = await Promise.all([
      query
        .limit(pageSize)
        .offset(offset)
        .orderBy(
          // Если есть поиск - сортируем по релевантности, иначе по дате
          validatedSearch
            ? sql`GREATEST(
                similarity(${products.title}, ${validatedSearch}) * 3,
                similarity(${products.description}, ${validatedSearch}) * 1
              ) DESC`
            : desc(products.createdAt)
        ), // DESC для новых товаров первыми
      countQuery
    ]);
    const productIds = allProducts.map(r => r.id);
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
    const productsWithDetails = allProducts.map(product => ({
      ...product,
      images: images.filter(image => image.productId === product.id),
      averageRating: ratingsMap.get(product.id)?.averageRating || 0,
      reviewCount: ratingsMap.get(product.id)?.reviewCount || 0,
    }));
     
   
    return {
      products: productsWithDetails,
      pagination: {
        page,
        pageSize,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt" | "sku">) {
  try {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
   await db.insert(products).values(product).returning();
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
    
}
export async function updateProduct( product: Omit<Product, "createdAt" | "updatedAt" | "sku">) {
 try { 
  const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    await db.update(products).set(product).where(eq(products.id, product.id))
 }
    catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product");
    }

 }
export async function deleteProduct(id: string) {
  try {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    await db.delete(products).where(eq(products.id, id));
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}
export async function getProductsBySlug(slug: string):  Promise<Product | undefined>  {
try { 
    const product = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return product[0]; // Return the first product found
  } catch (error) { 
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
}
 
export async function getTopCategoriesByMonth(year: number, month: number, limit: number = 10) {
  // Определяем границы месяца
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const topCategories = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name, // предполагаю, что у вас есть поле name
      totalQuantity: sql<number>`sum(${orderItems.quantity})::int`,
      totalOrders: sql<number>`count(distinct ${orders.id})::int`,
      totalRevenue: sql<number>`sum(${orderItems.price} * ${orderItems.quantity})::float`,
      uniqueProducts: sql<number>`count(distinct ${products.id})::int`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate),
        notInArray(orders.status, ['cancelled', 'pending'])
      )
    )
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(limit);

  return topCategories;
}

// Вариант с сравнением с предыдущим месяцем
export async function getTopCategoriesWithComparison(year: number, month: number, limit: number = 10) {
  // Определяем границы текущего месяца
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // Определяем границы предыдущего месяца
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const previousStartDate = new Date(previousYear, previousMonth - 1, 1);
  const previousEndDate = new Date(previousYear, previousMonth, 0, 23, 59, 59);

  const categoriesStats = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      
      // Текущий месяц
      currentTotalQuantity: sql<number>`sum(case when ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} then ${orderItems.quantity} else 0 end)::int`,
      currentTotalOrders: sql<number>`count(distinct case when ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} then ${orders.id} else null end)::int`,
      currentTotalRevenue: sql<number>`sum(case when ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} then ${orderItems.price} * ${orderItems.quantity} else 0 end)::float`,
      
      // Предыдущий месяц
      previousTotalQuantity: sql<number>`sum(case when ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} then ${orderItems.quantity} else 0 end)::int`,
      previousTotalOrders: sql<number>`count(distinct case when ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} then ${orders.id} else null end)::int`,
      previousTotalRevenue: sql<number>`sum(case when ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} then ${orderItems.price} * ${orderItems.quantity} else 0 end)::float`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        gte(orders.createdAt, previousStartDate),
        lte(orders.createdAt, endDate),
        notInArray(orders.status, ['cancelled', 'pending'])
      )
    )
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql`sum(case when ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} then ${orderItems.quantity} else 0 end)`))
    .limit(limit);

  // Функция для безопасного расчета процента изменения
  const calculateGrowth = (current: number, previous: number): number | null => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(2));
  };

  return categoriesStats.map(cat => ({
    categoryId: cat.categoryId,
    categoryName: cat.categoryName,
    current: {
      totalQuantity: cat.currentTotalQuantity,
      totalOrders: cat.currentTotalOrders,
      totalRevenue: cat.currentTotalRevenue || 0,
    },
    previous: {
      totalQuantity: cat.previousTotalQuantity,
      totalOrders: cat.previousTotalOrders,
      totalRevenue: cat.previousTotalRevenue || 0,
    },
    growth: {
      quantity: calculateGrowth(cat.currentTotalQuantity, cat.previousTotalQuantity),
      orders: calculateGrowth(cat.currentTotalOrders, cat.previousTotalOrders),
      revenue: calculateGrowth(cat.currentTotalRevenue || 0, cat.previousTotalRevenue || 0),
    }
  }));
}

// Топ товаров в категории за месяц
export async function getTopProductsInCategory(
  categoryId: string, 
  year: number, 
  month: number, 
  limit: number = 10
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const topProducts = await db
    .select({
      productId: products.id,
      productTitle: products.title,
      productSku: products.sku,
      totalQuantity: sql<number>`sum(${orderItems.quantity})::int`,
      totalRevenue: sql<number>`sum(${orderItems.price} * ${orderItems.quantity})::float`,
      totalOrders: sql<number>`count(distinct ${orders.id})::int`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(
        eq(products.categoryId, categoryId),
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate),
        notInArray(orders.status, ['cancelled', 'pending'])
      )
    )
    .groupBy(products.id, products.title, products.sku)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(limit);

  return topProducts;
}

export async function buildCategoryChain(categoryId: string) {
  const result = await db.execute<{ id: string; name: string; slug: string }>(sql`
    WITH RECURSIVE category_path AS (
      SELECT id, name, slug, parent_id, 1 as level
      FROM ${categories}
      WHERE id = ${categoryId}
      
      UNION ALL
      
      SELECT c.id, c.name, c.slug, c.parent_id, cp.level + 1
      FROM ${categories} c
      INNER JOIN category_path cp ON c.id = cp.parent_id
    )
    SELECT id, name, slug
    FROM category_path
    ORDER BY level DESC
  `);
  
  return result.rows;
}
// Получить путь категории для построения URL с search params
export async function buildCategoryPath(breadcrumbs: Array<{ slug: string }>) {
  return breadcrumbs.map((b) => b.slug).join(",");
}


export async function buildCategoryUrl(
  currentSlug: string,
  breadcrumbs: Array<{ slug: string }>
) {
  const path = await buildCategoryPath(breadcrumbs);
  return `/categories/${currentSlug}`;
}