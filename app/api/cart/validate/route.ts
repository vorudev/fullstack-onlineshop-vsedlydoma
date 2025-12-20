import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { ValidatedCartItem, CartItem } from "@/app/context/cartcontext";
import { products, productImages, reviews } from "@/db/schema";
import { rateLimitbyIp } from "@/lib/actions/limiter";
import { ProductImage } from "@/db/schema";

export async function POST(request: Request) {
  const { items } = await request.json();
    await rateLimitbyIp(50, 60000)
  const updatedItems: ValidatedCartItem[] = await Promise.all(
    items.map(async (item: CartItem) => {
      // Параллельные запросы к продукту и его картинкам
      const [product, images, productReviews] = await Promise.all([
        db.query.products.findFirst({
          where: eq(products.id, item.id)
        }),
        db.query.productImages.findMany({
          where: eq(productImages.productId, item.id)
        }),
        db.query.reviews.findMany({
          where: eq(reviews.product_id, item.id)
        })
      ]);
      
      // Вычисляем количество отзывов
      const reviewCount = productReviews.length;
      
      // Вычисляем средний рейтинг
      const averageRating = reviewCount > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;
      
      return {
        product: {
          ...product,
          images: images,
          averageRating: averageRating,
          reviewCount: reviewCount
        },
        quantity: item.quantity
      };
    })
  );
  
  return Response.json({ updatedItems });
}