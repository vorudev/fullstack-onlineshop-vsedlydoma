'use server';

import { db } from "@/db/drizzle";
import { Product, products } from "@/db/schema";
import { eq } from "drizzle-orm";
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
   
    // Строим условия фильтрации
    const conditions = [];
   
    if (search) {
      // Поиск по названию и описанию
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.slug, `%${search}%`)
        )
      );
    }
   
    if (category) {
      conditions.push(eq(products.categoryId, category));
    }
   
    if (manufacturer) {
      conditions.push(eq(products.manufacturerId, manufacturer));
    }
   
    // Базовый запрос
    let query = db
      .select(
        {
          id: products.id,
          title: products.title,
          description: products.description,
          price: products.price,
          slug: products.slug,
        }
      )
      .from(products)
      .$dynamic();
    
    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .$dynamic();
   
    // Применяем фильтры если есть
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }
   
    // Получаем продукты с пагинацией
    const allProducts = await query
      .limit(pageSize)
      .offset(offset)
      .orderBy(products.createdAt);
   
    // Получаем общее количество с учетом фильтров
    const [{ count }] = await countQuery;
   
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
export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  try {
   await db.insert(products).values(product).returning();
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
    
}
export async function updateProduct( product: Omit<Product, "createdAt" | "updatedAt">) {
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
 