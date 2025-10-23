'use server';

import { db } from "@/db/drizzle";
import { Product, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { unstable_cache } from 'next/cache';
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
   await db.insert(products).values(product).returning();
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
    
}
export async function updateProduct( product: Omit<Product, "createdAt" | "updatedAt" | "sku">) {
 try { 
    await db.update(products).set(product).where(eq(products.id, product.id))
 }
    catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product");
    }

 }
export async function deleteProduct(id: string) {
  try {
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
 