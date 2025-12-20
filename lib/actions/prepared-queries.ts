// ОПТИМИЗИРОВАЛ В СВОБОДНОЕ ВРЕМЯ 
import { db } from "@/db/drizzle"
import { schema, productImages, products, productAttributes, reviews, manufacturerImages, manufacturers, categories} from "@/db/schema"
import { eq, sql } from 'drizzle-orm';

// получаем страницу продукта
export const productPageQueries = ({ 

// продукт
    getMain: db.select().from(products).where(eq(products.slug, sql.placeholder('slug'))).prepare('productMain'),

//картинки продукта
    getImages: db.select().from(productImages).where(eq(productImages.productId, sql.placeholder('id'))).prepare('images'),

// аттрибуты продукта 
    getAttributes: db.select().from(productAttributes).where(eq(productAttributes.productId, sql.placeholder('id'))).prepare('attributes'),

// отзывы продукта
    getReviews: db.select().from(reviews).where(eq(reviews.product_id, sql.placeholder('id'))).limit(sql.placeholder('limit')).prepare('reviews'), 

//средние показатели 
getReviewsStats: db
.select({
  averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
  totalCount: sql<number>`COUNT(*)`,
  ratingDistribution: sql<any>`
    json_build_object(
      '5', COUNT(*) FILTER (WHERE ${reviews.rating} = 5),
      '4', COUNT(*) FILTER (WHERE ${reviews.rating} = 4),
      '3', COUNT(*) FILTER (WHERE ${reviews.rating} = 3),
      '2', COUNT(*) FILTER (WHERE ${reviews.rating} = 2),
      '1', COUNT(*) FILTER (WHERE ${reviews.rating} = 1)
    )
  `
})
.from(reviews)
.where(eq(reviews.product_id, sql.placeholder('id')))
.prepare('reviewsStats'),

// производитель 
    getManufacturer: db.select().from(manufacturers).where(eq(manufacturers.id, sql.placeholder('id'))).limit(1)
    .prepare('manufacturer'),

// изображения производителя
    getManufacturerImages: db.select().from(manufacturerImages).where(eq(manufacturerImages.manufacturerId, sql.placeholder('id'))).prepare('manufacturerImages')

// категории продукта
 //   getCategory: db.select().from(categories).where(eq(categories.id, sql.placeholder('id'))),

    
  })