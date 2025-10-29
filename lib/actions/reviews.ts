'use server';

import { db } from "@/db/drizzle";
import { reviews, Review } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, and, ne, sql } from "drizzle-orm";
import { stat } from "fs";


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
    const productReviews = await db
      .select({
        averageRating: sql<number>`AVG(${reviews.rating})`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(reviews)
      .where(eq(reviews.product_id, productId));
    
    return {
      averageRating: productReviews[0].averageRating,
      reviewCount: productReviews[0].reviewCount,
    };
  } catch (error) {
    console.error("Error fetching average rating by product ID:", error);
    throw new Error("Failed to fetch average rating by product ID");
  }
}
export async function createReview(review: Omit<typeof reviews.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const newReview = await db.insert(reviews).values(review).returning();
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
export async function getApprovedReviewsByProductId(productId: string) {
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