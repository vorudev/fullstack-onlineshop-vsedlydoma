'use server';
import { db } from "@/db/drizzle";
import { filters, Filter } from "@/db/schema";
import { filterCategories, FilterCategory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";

export async function createFilter(category: Omit<Filter, "id" | "createdAt" | "updatedAt">) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        await db.insert(filters).values(category).returning();
    } catch (error) {
        console.error("Error creating filter:", error);
        throw new Error("Failed to create filter");
    }
}
export async function deleteFilter(id: string) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        await db.delete(filters).where(eq(filters.id, id));
    } catch (error) {
        console.error("Error deleting filter:", error);
        throw new Error("Failed to delete filter");
    }
}
export async function getFiltersByCategory(categoryId: string) {
    try {
        const filtersByCategory = await db
            .select().from(filters)
            .where(eq(filters.categoryId, categoryId))
            .orderBy(filters.displayOrder);
        return filtersByCategory;
    } catch (error) {
        console.error("Error fetching filters by category:", error);
        throw new Error("Failed to fetch filters by category");
    }
}
export async function getFiltersByCategories(categoryIds: string[]) {
    try {
        const filtersByCategories = await db
            .select()
            .from(filters)
            .where(inArray(filters.categoryId, categoryIds))
            .orderBy(filters.displayOrder);
        return filtersByCategories;
    } catch (error) {
        console.error("Error fetching filters by categories:", error);
        throw new Error("Failed to fetch filters by categories");
    }
} 
