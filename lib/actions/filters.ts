'use server';
import { db } from "@/db/drizzle";
import { filters, Filter } from "@/db/schema";
import { filterCategories, FilterCategory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { inArray } from "drizzle-orm";

export async function createFilter(category: Omit<Filter, "id" | "createdAt" | "updatedAt">) {
    try {
        await db.insert(filters).values(category).returning();
    } catch (error) {
        console.error("Error creating filter:", error);
        throw new Error("Failed to create filter");
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
