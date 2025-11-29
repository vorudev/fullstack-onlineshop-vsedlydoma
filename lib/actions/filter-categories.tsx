'use server';
import { db } from "@/db/drizzle";
import { filters, Filter } from "@/db/schema";
import { filterCategories, FilterCategory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function getFilterCategories() {
    try {
        const allFilterCategories = await db.select().from(filterCategories);
        return allFilterCategories;
    } catch (error) {
        console.error("Error fetching filter categories:", error);
        throw new Error("Failed to fetch filter categories");
    }
}
export async function getFilterCategoriesByProductCategory(productCategoryId: string) {
    try {
        const categories = await db
            .select().from(filterCategories)
            .where(eq(filterCategories.productCategory, productCategoryId))
            .orderBy(filterCategories.displayOrder);
        return categories;
    } catch (error) {
        console.error("Error fetching filter categories by product category:", error);
        throw new Error("Failed to fetch filter categories by product category");
    }
}
export async function getFilterCategoriesWithFiltersByProductCategory(productCategoryId: string) { 
    try { 
        const results = await db
            .select({
                id: filterCategories.id,
                name: filterCategories.name,
                slug: filterCategories.slug,
                displayOrder: filterCategories.displayOrder,
                filter: {
                    id: filters.id,
                    name: filters.name,
                    slug: filters.slug,
                    displayOrder: filters.displayOrder,
                }
            })
            .from(filterCategories)
            .leftJoin(filters, eq(filters.categoryId, filterCategories.id))
            .where(eq(filterCategories.productCategory, productCategoryId))
            .orderBy(filterCategories.displayOrder, filters.displayOrder);
        
        // Группируем результаты
        const categoriesMap = new Map();
        
        for (const row of results) {
            if (!categoriesMap.has(row.id)) {
                categoriesMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    slug: row.slug,
                    displayOrder: row.displayOrder,
                    filters: []
                });
            }
            
            // Добавляем фильтр, если он существует
            if (row.filter) {
                categoriesMap.get(row.id).filters.push(row.filter);
            }
        }
        
        return Array.from(categoriesMap.values());
    } catch (error) {
        console.error("Error fetching filter categories with filters by product category:", error);
        throw new Error("Failed to fetch filter categories with filters by product category");
    }
}
export async function createFilterCategory(category: Omit<FilterCategory, "id" | "createdAt" | "updatedAt">) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        await db.insert(filterCategories).values(category).returning();
    } catch (error) {
        console.error("Error creating filter category:", error);
        throw new Error("Failed to create filter category");
    }
}
export async function deleteFilterCategory(id: string) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            await db.delete(filters).where(eq(filters.categoryId, id));
        await db.delete(filterCategories).where(eq(filterCategories.id, id));
    } catch (error) {
        console.error("Error deleting filter category:", error);
        throw new Error("Failed to delete filter category");
    }
}

