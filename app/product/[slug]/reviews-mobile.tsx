'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReviewForm } from "@/components/forms/review-form";
import { useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from 'next/navigation';
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
interface Params { 
  currentLimit: number;
  slug: string;
}
interface United { 
  internals: Params;
  productDetails: ProductUnited['productDetails'];
}
const RatingChart = ({productDetails}: ProductUnited) => {
  // Подсчитываем количество отзывов для каждой оценки
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  const reviews = productDetails.reviews?.forEach((review: any) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating as keyof typeof ratingCounts]++;
    }
  });

  const totalReviews =  productDetails.reviews?.length || 0;
  const averageRating =  productDetails.reviews?.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews || 0;
const getReviewWord = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'отзывов';
  }
  
  if (lastDigit === 1) {
    return 'отзыв';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'отзыва';
  }
  
  return 'отзывов';
};
  return (
    <div className="flex flex-col w-full md:max-w-[400px]  rounded-lg ">
      {/* Общий рейтинг */}
      <div className="flex items-center gap-3">
        <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-6 h-6 text-yellow-300"
              fill={star <= Math.round(averageRating) ? "#FFD700" : "none"}
            />
          ))}
        </div>
       <span className="text-gray-500 text-sm whitespace-nowrap">{totalReviews} {getReviewWord(totalReviews)}</span>
      </div>

      {/* График распределения */}
      


      <Dialog>
      <DialogTrigger asChild 
      >
        <button
         className="mt-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Оставить отзыв
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-lg text-black">
        <DialogHeader>
          <DialogTitle>Оставить отзыв</DialogTitle>
        </DialogHeader>
        <ReviewForm product_id={productDetails.id} />
      </DialogContent>
    </Dialog>
   
    </div>
  );
};
export default function MobileReviews({productDetails, internals}: United) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
    const handleLoadMore = () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());

    const newLimit = internals.currentLimit + 5;
  params.set('reviewsLimit', newLimit.toString());
  
  // ✅ Правильно - с ${}
  router.push(`/product/${internals.slug}?${params.toString()}`, { scroll: false });
   setLoading(false);
  };
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
       <div className=" flex-col gap-1 items-start mt-[20px] flex lg:hidden">
         <div className="flex flex-row  gap-3 items-end pb-3">
        <h3 className="text-[24px] text-gray-900 font-semibold leading-tight">Отзывы </h3>
            </div>
        <RatingChart productDetails={productDetails} />
        <div className="flex w-full flex-col">
         
          <div className="flex flex-col  border-t  w-full border-gray-200  overflow-y-auto">
            {productDetails?.reviews?.length === 0 ? (
            <p className="text-gray-500 text-center py-8 w-full">Отзывов пока нет</p>
          ) : (
            productDetails?.reviews?.map((review) => (
              <div className="flex flex-col gap-2 border-b border-gray-200 py-6 " key={review.id}>
            <h3 className="text-[16px]  text-gray-900 font-semibold">{review.author_name}</h3>
<div className="flex flex-row gap-1 items-center">
{starRating(review.rating)}
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     {review.comment}
</p>
<p className="text-[14px] text-gray-600">
  {review.createdAt?.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
</p>
          </div>

        ))
        )}
          
 
{productDetails?.reviews?.length >= internals?.currentLimit && (
  <button
    onClick={handleLoadMore}
    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    {loading ? 'Загрузка...' : 'Показать больше отзывов'}
  </button>
)}

    
          </div>
         
        </div>
        <div >
          
        </div>
        
        </div>
    )
}