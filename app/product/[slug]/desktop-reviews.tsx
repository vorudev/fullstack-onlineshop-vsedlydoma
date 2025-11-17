
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReviewForm } from "@/components/forms/review-form";
import { Star } from "lucide-react";
interface ProductUnited {
   
  productDetails: {
    id: string;
    title: string;
    description: string;
    price: number;
    sku: string | null;
    slug: string;
    inStock: string | null;
    categoryId: string | null;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[];
    reviews: {
        id: string;
        product_id: string;
        user_id: string | null;
        rating: number;
        comment: string | null;
        status: string;
        author_name: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    averageRating: number;
    reviewCount: number;
 attributes: {
            id: string | null;
            categoryId: string | null;
            name: string | null;
            value: string | null;
            order: number | null;
            slug: string | null;
        }[];
 manufacturer: {
    images: never[] | {
        id: string;
        manufacturerId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[];
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null
} 


}

const RatingChart = ({ reviews }: { reviews: any }) => {
  // Подсчитываем количество отзывов для каждой оценки
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  reviews?.forEach((review: any) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating as keyof typeof ratingCounts]++;
    }
  });

  const totalReviews = reviews?.length || 0;
  const averageRating = reviews?.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews || 0;

  return (
    <div className="flex flex-col gap-4 bg-gray-50 rounded-lg p-6">
      {/* Общий рейтинг */}
      <div className="flex items-center gap-3">
        <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-6 h-6 text-red-500"
              fill={star <= Math.round(averageRating) ? "#ef4444" : "none"}
            />
          ))}
        </div>
        <span className="text-gray-500">{totalReviews} отзывов</span>
      </div>

      {/* График распределения */}
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating as keyof typeof ratingCounts];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-gray-600 w-3">{rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-gray-900 font-semibold w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Кнопка оставить отзыв */}
      <button className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
        Оставить отзыв
      </button>
    </div>
  );
};
export default function DesktopReviews({productDetails}: ProductUnited) {
    const starRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    // Полные звёзды
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star 
                key={`full-${i}`} 
                className="w-[24px] h-[24px] text-yellow-300" 
                fill="#FFD700"
            />
        );
    }

    // Половинка звезды (если нужно)
    if (hasHalfStar && fullStars < 5) {
        stars.push(
            <div key="half" className="relative w-[24px] h-[24px]">
                <Star className="w-[24px] h-[24px] text-yellow-300 absolute" fill="none" />
                <div className="overflow-hidden w-[12px] absolute">
                    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700" />
                </div>
            </div>
        );
    }

    // Пустые звёзды
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <Star 
                key={`empty-${i}`} 
                className="w-[24px] h-[24px] text-gray-300" 
                fill="none"
            />
        );
    }

    return stars;
}
    
    return (
       <div className="flex flex-row gap-1 items-start mt-[20px] hidden lg:block ">
        <div className="flex flex-col">
          <div className="flex flex-row gap-3 items-end pb-3"><h3 className="text-[24px] text-gray-900 font-semibold leading-tight">Отзывы </h3>
            <p className="text-[16px] text-gray-600 font-semibold">{productDetails?.reviewCount}</p>
            </div>
            <div className="flex flex-col gap-3 items-start  pb-2 w-full ">
<div className="flex flex-row gap-2 items-center"><div className="flex flex-row gap-1 items-center">
    {starRating(productDetails?.averageRating)}
    

<p className="text-[24px] text-gray-900 font-semibold">{productDetails?.averageRating.toFixed(2)}</p>

  </div>
 
  </div>
<Dialog>
    <DialogTrigger className="bg-blue-600 font-semibold text-white px-4 py-3 rounded-xl text-black">Добавить отзыв</DialogTrigger>
    <DialogContent className="bg-white  text-black">
      <DialogHeader>
        <DialogTitle className="text-[24px] text-gray-900 font-semibold">Добавить отзыв</DialogTitle>
      </DialogHeader>
      <ReviewForm product_id={productDetails?.id} />
    </DialogContent>
  </Dialog>
            </div>
          {
            productDetails?.reviews?.map((review) => (
              <div className="flex flex-col gap-2 p-2 " key={review.id}>
            <h3 className="text-[16px] text-gray-900 font-semibold">{review.author_name}</h3>
<div className="flex flex-row gap-1 items-center">
{starRating(review.rating)}
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     {review.comment}
</p>
<p className="text-[14px] text-gray-600">{review.createdAt?.toDateString()}</p>
          </div>

          ))
          }
         
        </div>
        <div >
          
        </div>
        
        </div>
    )
}