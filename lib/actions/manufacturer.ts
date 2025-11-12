'use server';
import { db } from "@/db/drizzle";
import { manufacturers, Manufacturer } from "@/db/schema";
import { eq, ilike, or, and, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
interface ManufacturerParams {
page?: number;
pageSize?: number;
search?: string;

}

export async function createManufacturer(manufacturer: Omit<Manufacturer, "id" | "createdAt" | "updatedAt">) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        return await db.insert(manufacturers).values(manufacturer);
    } catch (error) {
        console.error("Error creating manufacturer:", error);
        throw new Error("Failed to create manufacturer");
    }
}
export async function updateManufacturer(manufacturer: Omit<Manufacturer, "createdAt" | "updatedAt">) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        return await db.update(manufacturers).set(manufacturer).where(eq(manufacturers.id, manufacturer.id));
    } catch (error) {
        console.error("Error updating manufacturer:", error);
        throw new Error("Failed to update manufacturer");
    }
}
export async function deleteManufacturer(id: string) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        return await db.delete(manufacturers).where(eq(manufacturers.id, id));
    } catch (error) {
        console.error("Error deleting manufacturer:", error);
        throw new Error("Failed to delete manufacturer");
    }
}
export const getAllManufacturers = async ({
    page = 1,
    pageSize = 20,
    search = ''
}: ManufacturerParams = {}) => {
    try {
        const offset = (page - 1) * pageSize;
        const conditions = [];
        
        if (search) {
            conditions.push(
                or(
                    ilike(manufacturers.name, `%${search}%`),
                    ilike(manufacturers.description, `%${search}%`),
                    ilike(manufacturers.slug, `%${search}%`)
                )
            );
        }
        
        let query = db
            .select({
                id: manufacturers.id,
                name: manufacturers.name,
                slug: manufacturers.slug,
                description: manufacturers.description,
                createdAt: manufacturers.createdAt,
                updatedAt: manufacturers.updatedAt
            })
            .from(manufacturers)
            .$dynamic();

        let countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(manufacturers)
            .$dynamic();

        if (conditions.length > 0) {
            query = query.where(and(...conditions));
            countQuery = countQuery.where(and(...conditions));
        }
        
        const getAllManufacturersResult = await query
            .limit(pageSize)
            .offset(offset)
            .orderBy(sql`name ASC`);
        const [{ count }] = await countQuery;

        return {
            manufacturers: getAllManufacturersResult,
            pagination: {
                page,
                pageSize,
                total: count,
                totalPages: Math.ceil(count / pageSize),
            }
        };
    } catch (error) {
        console.error("Error fetching manufacturers:", error);
        throw new Error("Failed to fetch manufacturers");
    }
};
export async function getManufacturerBySlug(slug: string) {
    try {
       const [manufacturer] = await db.select().from(manufacturers).where(eq(manufacturers.slug, slug));
       return manufacturer;
    } catch (error) {
        console.error("Error fetching manufacturer by slug:", error);
        throw new Error("Failed to fetch manufacturer by slug");
    }
}
