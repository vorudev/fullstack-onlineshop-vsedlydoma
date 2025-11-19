'use server';

import { db } from "@/db/drizzle";
import { reviews, Review, user, products } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {rateLimitbyKey} from "./limiter";
import { eq, and, ne, sql, or, ilike, desc } from "drizzle-orm";
import rateLimit from "next-rate-limit";


interface GetApprovedReviewsParams {
   search?: string;
   page?: number;
   pageSize?: number;
}
export async function getReviewsByProductId(productId: string) {
  try {
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.product_id, productId));
    return productReviews;
  } catch (error) {
    console.error("Error fetching reviews by product ID:", error);
    throw new Error("Failed to fetch reviews by product ID");
  }
}
export async function getAverageRatingByProductId(productId: string) {
  try {
    const conditions = [];


    const productReviews = await db
      .select({
        averageRating: sql<number>`AVG(${reviews.rating})`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(reviews)
      .where(and(eq(reviews.product_id, productId), eq(reviews.status, 'approved')));
    
    return {
      averageRating: productReviews[0].averageRating,
      reviewCount: productReviews[0].reviewCount,
    };
  } catch (error) {
    console.error("Error fetching average rating by product ID:", error);
    throw new Error("Failed to fetch average rating by product ID");
  }
}
async function validateReviewEntities(userId: string , productId: string) {
  const [users, product] = await Promise.all([
    db.select(
      {
        id: user.id,
      }
    ).from(user).where(eq(user.id, userId)).limit(1),
    db.select(
      {
        id: products.id,
      }
    ).from(products).where(eq(products.id, productId)).limit(1),
  ]);

  if (!users.length) throw new Error('User not found');
  if (!product.length) throw new Error('Product not found');
}
async function checkDuplicateReview(userId: string, productId: string) {
  const existing = await db
    .select(
      {
        id: reviews.id,
      }
    )
    .from(reviews)
    .where(
      and(
        eq(reviews.user_id, userId),
        eq(reviews.product_id, productId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error('You have already reviewed this product');
  }
}



function sanitizeString(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '') 
    .trim();
}
export async function createReview(review: Omit<typeof reviews.$inferInsert, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>) {
  try {
    const user = await auth.api.getSession({
      headers: await headers()
    })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  const sanitizedReview = {
      ...review,
      user_id: user.user.id,
      comment: sanitizeString(review.comment),
      author_name: sanitizeString(review.author_name),
    };
    await validateReviewEntities(sanitizedReview.user_id, sanitizedReview.product_id);
    await checkDuplicateReview(sanitizedReview.user_id, sanitizedReview.product_id);
    await rateLimitbyKey(user.user.id, 5, 15 * 60 * 1000);
  
    const newReview = await db.insert(reviews).values(sanitizedReview).returning();
    return newReview[0]; // Возвращаем созданный отзыв
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
  }
}

export async function getApprovedReviews() {
    try { 
        const filteredReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.status, 'approved'));
        return filteredReviews;
    } catch (error) {
        console.error("Error fetching filtered reviews:", error);
        throw new Error("Failed to fetch filtered reviews");
    }
}
export const getApprovedReviewsByProductId = async (productId: string) => {
    try { 
        const filteredReviews = await db
        .select()
        .from(reviews)
        .where(
            and(
                eq(reviews.status, 'approved'),
                eq(reviews.product_id, productId)
            )
        );
        return filteredReviews;
    } catch (error) {
        console.error("Error fetching filtered reviews by product ID:", error);
        throw new Error("Failed to fetch filtered reviews by product ID");
    }
}
export const getAllApprovedReviews = async ({
  search = '',
  page = 1,
  pageSize = 20,
}: GetApprovedReviewsParams = {}) => {
    try { 
        const offset = (page - 1) * pageSize;
        const conditions = [];
        if (search) {
            conditions.push(
                or(
                    ilike(reviews.id, `%${search}%`),
                    ilike(reviews.user_id, `%${search}%`),
                    ilike(reviews.product_id, `%${search}%`),
                    ilike(reviews.rating, `%${search}%`),
                    sql`CAST(${reviews.id} AS TEXT) ILIKE ${`%${search}%`}`,
                )
            );
        }
        const whereClause = and(...conditions);
        const [allReviews, [{ count }]] = await Promise.all([
            db
                .select()
                .from(reviews)
                .where(whereClause)
                .limit(pageSize)
                .offset(offset)
                .orderBy(desc(reviews.createdAt)),
            db
                .select({ count: sql<number>`count(*)` })
                .from(reviews)
                .where(whereClause)
        ]);
        return {
          allReviews,
            pagination: {
                page,
                pageSize,
                total: Number(count),
                totalPages: Math.ceil(Number(count) / pageSize),
            },
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}
    
export async function getPendingReviews() {
    try { 
        const filteredReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.status, 'pending'));
        return filteredReviews;
    } catch (error) {
        console.error("Error fetching filtered reviews:", error);
        throw new Error("Failed to fetch filtered reviews");
    }
}
export async function getPendingReviewsCount() {
    try { 
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(reviews)
            .where(eq(reviews.status, 'pending'));
        return result[0].count;
    } catch (error) {
        console.error("Error fetching pending reviews count:", error);
        return 0;
    }
}
export async function updateReview(id: string, data: Partial<Review>) {
  try {
    await db.update(reviews).set(data).where(eq(reviews.id, id));
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Failed to update review");
  }
}
export async function deleteReview(id: string) {
  try {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    await db.delete(reviews).where(eq(reviews.id, id));
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
}