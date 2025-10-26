'use server'
import { db } from "@/db/drizzle";
import { productImages, ProductImage } from "@/db/schema";
import { put, del } from '@vercel/blob';
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function createImage(image: Omit<ProductImage, "id" | "createdAt" | "updatedAt">) {
    try {
        await db.insert(productImages).values(image).returning();
    } catch (error) {
        console.error("Error creating image:", error);
        throw new Error("Failed to create image");
    }
}


export async function getProductImages(productId: string) {
    try {
        const images = await db.select().from(productImages).where(eq(productImages.productId, productId));
        return images;
    } catch (error) {
        console.error("Error fetching product images:", error);
        throw new Error("Failed to fetch product images");
    }
}
export async function deleteImage(imageId: string) {
    try {
        await db.delete(productImages).where(eq(productImages.id, imageId));
    } catch (error) {
        console.error("Error deleting image:", error);
        throw new Error("Failed to delete image");
    }
}

export async function uploadProductImage(file: File) {
  // ✅ Проверяем права и выбрасываем ошибку
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized'); // или создайте кастомную ошибку
  }

  const blob = await put(`products/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
 
  return {
    url: blob.url,
    storageKey: blob.pathname,
  };
}
export async function deleteProductImage(storageKey: string) {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
  await del(storageKey);
}