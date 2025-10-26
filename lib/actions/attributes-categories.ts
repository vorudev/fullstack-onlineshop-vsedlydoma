'use server';
import { db } from "@/db/drizzle";
import { attributeCategories, AttributeCategory } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export async function getAttributeCategories() {
    try {
        
        const allAttributeCategories = await db.select().from(attributeCategories);
        return allAttributeCategories;
    } catch (error) {
        console.error("Error fetching attribute categories:", error);
        throw new Error("Failed to fetch attribute categories");
    }
}
export async function createAttributeCategory(category: Omit<AttributeCategory, "id" | "createdAt" | "updatedAt">) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        await db.insert(attributeCategories).values(category).returning();
    } catch (error) {
        console.error("Error creating attribute category:", error);
        throw new Error("Failed to create attribute category");
    }
}
export async function updateAttributeCategory(category: Omit<AttributeCategory, "createdAt" | "updatedAt">) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        await db.update(attributeCategories).set(category).where(eq(attributeCategories.id, category.id))
    } catch (error) {
        console.error("Error updating attribute category:", error);
        throw new Error("Failed to update attribute category");
    }
}
export async function deleteAttributeCategory(id: string) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        await db.delete(attributeCategories).where(eq(attributeCategories.id, id));
    } catch (error) {
        console.error("Error deleting attribute category:", error);
        throw new Error("Failed to delete attribute category");
    }
}