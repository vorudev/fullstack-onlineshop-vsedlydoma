'use server';
import { db } from "@/db/drizzle";
import { manufacturers, Manufacturer, products, productImages, reviews, ManufacturerImage, manufacturerImages } from "@/db/schema";
import { eq, ilike, or, and, sql, count, asc, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
interface ManufacturerParams {
page?: number;
pageSize?: number;
search?: string;

}
interface GetProductsByManufacturerIdParams {
    manufacturerId?: string;
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
        await db.insert(manufacturers).values(manufacturer).returning();
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
         await db.update(manufacturers).set(manufacturer).where(eq(manufacturers.id, manufacturer.id)).returning()
         ;
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
      await db.delete(manufacturers).where(eq(manufacturers.id, id)).returning();
    } catch (error) {
        console.error("Error deleting manufacturer:", error);
        throw new Error("Failed to delete manufacturer");
    }
}

export const getRandomManufacturers = async ({ 
    limit = 20, 
}: { 
    limit?: number; 
} = {}) => {
    try {
        let query = db.select(
            {
                id: manufacturers.id,
                name: manufacturers.name,
                slug: manufacturers.slug,
            }
        )
            .from(manufacturers)
        
        const result = await query
        .orderBy(sql`RANDOM()`)
        .limit(limit);

        const manufacturersIds = result.map(r => r.id);
        
        const ManufacturerImages = await db.select(
            {
                id: manufacturerImages.id,
                manufacturerId: manufacturerImages.manufacturerId,
                imageUrl: manufacturerImages.imageUrl,
            }
        ).from(manufacturerImages).where(inArray(manufacturerImages.manufacturerId, manufacturersIds));
        return {
            manufacturers: result,
          ManufacturerImages
        };
    } catch (error) {
        console.error("Error fetching random manufacturers:", error);
        throw new Error("Failed to fetch random manufacturers");
}
}


export const getAllProductsByManufacturerId = async ({
    manufacturerId = '',
    page = 1,
    pageSize = 20,
    search = ''
}: GetProductsByManufacturerIdParams = {}) => {
    try {
        const offset = (page - 1) * pageSize;
        const conditions = [
            eq(products.isActive, true),
        ];
        
        if (manufacturerId) {
            conditions.push(eq(products.manufacturerId, manufacturerId));
        }
        
        if (search) {
            const searchCondition = or(
                ilike(products.title, `%${search}%`),
                ilike(products.description, `%${search}%`),
                ilike(products.slug, `%${search}%`),
                ilike(products.sku, `%${search}%`),
                sql`CAST(${products.id} AS TEXT) ILIKE ${`%${search}%`}`
            );
            
            if (searchCondition) {
                conditions.push(searchCondition);
            }
        }

        let query = db
            .select()
            .from(products)
            .$dynamic();

        let countQuery = db
            .select({ count: count(products.id) }) // ✅ Исправлено
            .from(products)
            .$dynamic();

        if (conditions.length > 0) {
            query = query.where(and(...conditions));
            countQuery = countQuery.where(and(...conditions));
        }

        const getAllProductsByManufacturerIdResult = await query
            .limit(pageSize)
            .offset(offset)
            .orderBy(asc(products.title)); // ✅ Исправлено

        const [{ count: totalCount }] = await countQuery;
const productIds = getAllProductsByManufacturerIdResult.map(r => r.id);
    const [images, ratings] = await Promise.all([
  db.select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds)),
  
  // ДОБАВЛЯЕМ GROUP BY product_id
  db.select({
    productId: reviews.product_id,
    averageRating: sql<number>`AVG(${reviews.rating})`,
    reviewCount: sql<number>`COUNT(${reviews.id})`,
  })
  .from(reviews)
  .where(inArray(reviews.product_id, productIds))
  .groupBy(reviews.product_id) // ← ВОТ ЭТО КЛЮЧЕВОЕ!
]);


const ratingsMap = new Map(
  ratings.map(r => [r.productId, { 
    averageRating: r.averageRating, 
    reviewCount: r.reviewCount 
  }])
);
const productsWithDetails = getAllProductsByManufacturerIdResult.map(product => ({
  ...product,
  averageRating: ratingsMap.get(product.id)?.averageRating || 0,
  reviewCount: ratingsMap.get(product.id)?.reviewCount || 0,
}));

        return {
            products: productsWithDetails,
            images: images,
            pagination: {
                page,
                pageSize,
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }
        };
    } catch (error) {
        console.error("Error fetching products by manufacturer ID:", error);
        throw new Error("Failed to fetch products by manufacturer ID");
    }
};
    

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
export async function getManufacturerById(id: string) {
    try {
        const [manufacturer] = await db.select().from(manufacturers).where(eq(manufacturers.id, id));
        return manufacturer;
    } catch (error) {
        console.error("Error fetching manufacturer by id:", error);
        throw new Error("Failed to fetch manufacturer by id");
    }
}