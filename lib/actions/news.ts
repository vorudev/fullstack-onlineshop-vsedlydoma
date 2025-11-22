'use server';
import { db } from "@/db/drizzle";
import { news,News, newsImages, NewsImage } from "@/db/schema";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createNews(newaId: Omit<News, "id" | "createdAt" | "updatedAt">) {
    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    );
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await db.insert(news).values(newaId);
    } catch (error) {
        console.error("Error creating news:", error);
        throw new Error("Failed to create news");
    }
}

export async function updateNews(newaId: Omit<News, "createdAt" | "updatedAt">) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        return await db.update(news).set(newaId).where(eq(news.id, newaId.id));
    } catch (error) {
        console.error("Error updating news:", error);
        throw new Error("Failed to update news");
    }
}
export async function deleteNews(id: string) {
    try {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        return await db.delete(news).where(eq(news.id, id));
    } catch (error) {
        console.error("Error deleting news:", error);
        throw new Error("Failed to delete news");
    }
}


interface GetNewsParams {
    page?: number;
    pageSize?: number;
    search?: string;
}
export const getAllNews = async (
    {
        page = 1,
        pageSize = 20,
        search = '',

    }: GetNewsParams = {}) => {
        try {
            const offset = (page - 1) * pageSize;
            const conditions = [];
            
            if (search) {
                conditions.push(
                    or(
                        ilike(news.title, `%${search}%`),
                        ilike(news.description, `%${search}%`),
                        ilike(news.slug, `%${search}%`),
                    )
                );
            }
            const query = db
            .select()
            .from(news)
            .where(and(...conditions))
            .orderBy(desc(news.createdAt))
            .$dynamic();
            const countQuery = db.select({ count: sql<number>`count(*)` }).from(news).where(and(...conditions)).$dynamic();
            const [allNews, [{ count }]] = await Promise.all([
                 query
                   .limit(pageSize)
                   .offset(offset)
                   .orderBy(desc(news.createdAt)), // DESC для новых новостей первыми
                 countQuery
               ]);
           
            const newsIds = allNews.map((r) => r.id);
            const images = await db.select().from(newsImages).where(inArray(newsImages.newsId, newsIds));

          const newsWithImages = allNews.map(news => ({
      ...news,
      images: images.filter(image => image.newsId === news.id),
    }));
            return {
                allNews: newsWithImages,
                pagination: {
                    page,
                    pageSize,
                    totalItems: count,
                    totalPages: Math.ceil(count / pageSize),
                },
            }
    } catch (error) {
        console.error("Error fetching news:", error);
        throw new Error("Failed to fetch news");
    }
}