'use server';

import { db } from "@/db/drizzle";
import { Product, products, productAttributes, AttributeCategory, attributeCategories, orderItems, orders, categories, productImages, reviews, Manufacturer, manufacturers, manufacturerImages } from "@/db/schema";
import { desc, eq, gte, inArray, lte, notInArray  } from "drizzle-orm";
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
          .where(eq(reviews.product_id, product.products.id))
          .limit(limit),

        
        // Атрибуты
        db
          .select()
          .from(productAttributes)
          .where(eq(productAttributes.productId, product.products.id)),
        
        // Изображения производителя
        product.manufacturers?.id
          ? db
              .select()
              .from(manufacturerImages)
              .where(eq(manufacturerImages.manufacturerId, product.manufacturers.id))
          : Promise.resolve([]),
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
export const getAllProducts = async ({
  page = 1,
  pageSize = 20,
  search = '',
  category,
  manufacturer
}: GetProductsParams = {}) => {
  try {
    const offset = (page - 1) * pageSize;
   
    const conditions = [];
   
    if (search) {
  const searchConditions = [
    ilike(products.title, `%${search}%`),
    ilike(products.description, `%${search}%`),
    ilike(products.slug, `%${search}%`),
    ilike(products.sku, `%${search}%`),
    sql`CAST(${products.id} AS TEXT) ILIKE ${`%${search}%`}`, 
     // Приводим UUID к тексту

  ];
  
  // Только если у тебя есть числовое поле, например orderNumber
  if (!isNaN(Number(search))) {
    searchConditions.push(
      eq(products.price, Number(search)) // Замени orderNumber на реальное числовое поле
    );
  }
  
  conditions.push(or(...searchConditions));
}
    
    if (category) {
      conditions.push(eq(products.categoryId, category));
    }
   
    if (manufacturer) {
      conditions.push(eq(products.manufacturerId, manufacturer));
    }
   
    // Базовые запросы
    let query = db
      .select()
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
        .orderBy(desc(products.createdAt)), // DESC для новых товаров первыми
      countQuery
    ]);
   
    return {
      products: allProducts,
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
// Функция для инвалидации кеша при изменении продуктов
export async function revalidateProducts() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('products');
}
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