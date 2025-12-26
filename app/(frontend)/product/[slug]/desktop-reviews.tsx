'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReviewForm } from "@/components/forms/review-form";
import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
interface  Product{
  product: {
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    isActive: boolean | null;
    slug: string;
    title: string;
    description: string;
    keywords: string | null;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
} 
  productImages: {
    id: string;
    productId: string;
    imageUrl: string;
    storageType: string;
    storageKey: string | null;
    order: number | null;
    isFeatured: boolean | null;
    createdAt: Date | null;
}[]
reviews: {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  status: string;
  author_name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}[]
attributes: {
  id: string;
  productId: string;
  name: string;
  value: string;
  order: number | null;
  slug: string;
  createdAt: Date | null;
}[]
manufacturer: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
manufacturerImages: {
  id: string;
  manufacturerId: string;
  imageUrl: string;
  storageType: string;
  storageKey: string | null;
  order: number | null;
  isFeatured: boolean | null;
  createdAt: Date | null;
}[]
internals: { 
  slug: string;
  currentLimit: number;
}
stats: {
  averageRating: number;
  totalCount: number;
  ratingDistribution: any;
}
}

interface Params { 
  currentLimit: number;
  slug: string;
}

const RatingChart = ({ product, stats }: Product) => {
  const totalReviews = stats.totalCount || 0;
  const averageRating = stats.averageRating || 0;
  const distribution = stats.ratingDistribution || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

  return (
    <div className="flex flex-col gap-4 rounded-lg p-6">
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
        <span className="text-gray-500 text-sm whitespace-nowrap">
          {totalReviews} отзывов
        </span>
      </div>

      {/* График распределения */}
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating.toString() as keyof typeof distribution] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-gray-600 w-3">{rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-300 h-full rounded-full transition-all duration-300"
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

      <Dialog>
        <DialogTrigger asChild>
          <button className="mt-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Оставить отзыв
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white max-w-lg text-black">
          <DialogHeader>
            <DialogTitle>Оставить отзыв</DialogTitle>
          </DialogHeader>
          <ReviewForm product_id={product.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default function DesktopReviews({product, reviews, internals, attributes, productImages, stats, manufacturer, manufacturerImages}: Product) {
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
       <div className=" flex-row gap-1 items-start mt-[20px] hidden  lg:flex">
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-3 items-end pb-3"><h3 className="text-[24px] text-gray-900 font-semibold leading-tight">Отзывы </h3>
            </div>
            <div className="flex flex-col gap-3 items-start   w-full ">


            </div>
          <div className="flex flex-col w-full border-t  border-gray-200  overflow-y-auto">
          {reviews?.length === 0 ? (
            <p className="text-gray-500 text-center w-full py-8">Отзывов пока нет</p>
          ) : (
            reviews?.map((review) => (
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
 
{reviews?.length >= internals?.currentLimit && (
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
          <RatingChart  
          stats={stats}
          attributes={attributes}
          product={product} manufacturer={manufacturer} reviews={reviews} internals={internals}  manufacturerImages={manufacturerImages} productImages={productImages}/>
        </div>
        
        </div>
    )
}