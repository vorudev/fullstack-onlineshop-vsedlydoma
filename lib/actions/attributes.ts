'use server';

import { db } from "@/db/drizzle";
import { productAttributes, ProductAttribute } from "@/db/schema";
import { eq } from "drizzle-orm";
import { attributeCategories } from "@/db/schema";
export async function getProductAttributes() {
    try {
        const allProductAttributes = await db.select().from(productAttributes);
        return allProductAttributes;
    } catch (error) {
        console.error("Error fetching product attributes:", error);
        throw new Error("Failed to fetch product attributes");
    }
}
export async function getProductAttributesByProductId(productId: string) {
    try {
        const attributes = await db.select().from(productAttributes).where(eq(productAttributes.productId, productId)); 
        return attributes;
    } catch (error) {
        console.error("Error fetching product attributes by product ID:", error);
        throw new Error("Failed to fetch product attributes by product ID");
    }
}
export async function getProductAttributesWithCategories(productId: string) {
    try {
        const attributes = await db
            .select({
                id: productAttributes.id,
                productId: productAttributes.productId,
                categoryId: productAttributes.categoryId,
                name: productAttributes.name,
                value: productAttributes.value,
                order: productAttributes.order,
                // Вложенный объект с данными категории
                category: {
                    id: attributeCategories.id,
                    name: attributeCategories.name,
                    slug: attributeCategories.slug,
                    displayOrder: attributeCategories.displayOrder,
                }
            })
            .from(productAttributes)
            .leftJoin(
                attributeCategories,
                eq(productAttributes.categoryId, attributeCategories.id)
            )
            .where(eq(productAttributes.productId, productId))
            .orderBy(
                attributeCategories.displayOrder,
                productAttributes.order
            );
        
        return attributes;
    } catch (error) {
        console.error("Error fetching product attributes with categories:", error);
        throw new Error("Failed to fetch product attributes with categories");
    }
}
export async function createProductAttribute(attribute: Omit<ProductAttribute, "id" | "createdAt" | "updatedAt">) {
    try {
        await db.insert(productAttributes).values(attribute).returning();
    } catch (error) {
        console.error("Error creating product attribute:", error);
        throw new Error("Failed to create product attribute");
    }
}

export async function updateProductAttribute(attribute: Omit<ProductAttribute, "createdAt" | "updatedAt">) {
    try {
        await db.update(productAttributes).set(attribute).where(eq(productAttributes.id, attribute.id))
    } catch (error) {
        console.error("Error updating product attribute:", error);
        throw new Error("Failed to update product attribute");
    }
}
export async function deleteProductAttribute(id: string) {
    try {
        await db.delete(productAttributes).where(eq(productAttributes.id, id));
    } catch (error) {
        console.error("Error deleting product attribute:", error);
        throw new Error("Failed to delete product attribute");
    }
}