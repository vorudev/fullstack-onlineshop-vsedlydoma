'use server'
import { db } from "@/db/drizzle";
import { productImages, ProductImage } from "@/db/schema";
import { eq } from "drizzle-orm";

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