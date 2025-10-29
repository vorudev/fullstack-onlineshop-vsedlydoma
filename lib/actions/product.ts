'use server';

import { db } from "@/db/drizzle";
import { Product, products, productAttributes, orderItems, orders, categories } from "@/db/schema";
import { desc, eq, gte, lte, notInArray } from "drizzle-orm";
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


interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  manufacturer?: string; 
}
export const getRandomProductsFast = async ({
  limit = 20,
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
    
    return result;
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