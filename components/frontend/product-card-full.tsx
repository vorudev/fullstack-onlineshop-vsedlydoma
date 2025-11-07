 'use client'
 import { Heart, ShoppingCart , ChartNoAxesColumn, Star} from "lucide-react";
import { getAverageRatingByProductId } from "@/lib/actions/reviews";
import { getProductImages } from "@/lib/actions/image-actions";
import Link from "next/link";
import { ProductImage } from "@/db/schema";
import ImagesSliderCardFull from "./images-slider-card-full";
interface ProductUnited {
   
  product: {
    averageRating: number;
    reviewCount: number;
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    slug: string;
    title: string;
    description: string;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[]
}
}
export default function ProductCard( { product}: ProductUnited) {
  
    const rounded = Math.round(product.averageRating);
 const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-emerald-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 3.0) return 'text-orange-600';
  if (rating >= 2.0) return 'text-red-500';
  if (rating === 0) return 'text-gray-500';
  return 'text-red-700';
};
function getReviewText(count: number): string {
  if (count === 0) return 'нет отзывов';
  
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  let word = 'отзывов';
  
  if (lastTwoDigits < 11 || lastTwoDigits > 14) {
    if (lastDigit === 1) word = 'отзыв';
    else if (lastDigit >= 2 && lastDigit <= 4) word = 'отзыва';
  }
  
  return `${count} ${word}`;
}

    return ( 
        <div className="bg-white rounded-2xl  hover:shadow-xl transition-all duration-300 overflow-hidden  group lg:p-[12px] " key={product.id}> 
        <div className="hidden lg:block flex flex-col px-2 py-2">
          <Link className="relative overflow-hidden" href={`/product/${product.slug}`}>
            <ImagesSliderCardFull images={product.images} title={product.title} />
          </Link>
          <Link href={`/product/${product.slug}`}>
          <h3 className="text-black  text-[15px] line-clamp-3">
            {product.title}
          </h3>
          
          </Link>
          <div className="flex flex-row gap-2 pt-2 text-sm items-center">
            <button className="flex items-center gap-1 py-1 rounded-lg text-gray-500">
              <ChartNoAxesColumn className="w-4 h-4" /> Сравнить
            </button>
          <div className="flex items-center px-2 py-1 rounded-lg">
          {rounded ? rounded && 
          <div className={`flex mr-2  items-center gap-1 font-semibold ${getRatingColor(rounded)}`}>
              <Star className="w-4 h-4" /> {rounded ? rounded : null} 
            </div> : null} 
    <span className=" text-gray-500">
     {getReviewText(product.reviewCount)}
   </span>  
 
 </div>
          </div>
          <div className="flex flex-row gap-2 pt-3 text-sm items-center justify-between">
         <h3 className="text-gray-900 font-semibold text-[16px]">{product.price} руб</h3>
         <div className="flex items-center gap-2">
          
          <button className="  cursor-pointer px-2 bg-white hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Heart className="w-6 h-6" />
          </button>
          <button className="  cursor-pointer px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <ShoppingCart className="w-6 h-6" /> Купить
          </button>
          </div>
          </div>
        </div>
           <div className="lg:hidden"><Link className="relative overflow-hidden" href={`/product/${product.slug}`}>
            <ImagesSliderCardFull images={product.images} title={product.title} />
              
              
            </  Link>
            
            <div className="p-5 flex flex-col lg:flex-row lg:gap-1 lg:p-0">
              <Link href={`/product/${product.slug}`}>
              <h3 className="text-gray-900  text-[16px] line-clamp-2">
                {product.title}
              </h3>
              </Link>
              <Link className="flex items-center mb-1" href={`/product/${product.slug}`}>
               {rounded ? rounded && 
              <div className={`flex mr-2  items-center gap-1 ${getRatingColor(rounded)}`}>
                  <Star className="w-4 h-4" /> {rounded ? rounded : null} 
                </div> : null}  
 <span className=" text-gray-500">
  {getReviewText(product.reviewCount)}
</span>  


              </Link>
              
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-xl font-semibold text-gray-900">{product.price} руб</div>

                </div>
               
              </div>
              <div className="flex flex-row gap-1 ">
              <button className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <ShoppingCart className="w-6 h-6" />

              </button>
              <button className=" w-1/4 cursor-pointer bg-white hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Heart className="w-5 h-5" />

              </button>

              <button className=" w-1/4 cursor-pointer bg-white hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <ChartNoAxesColumn className="w-5 h-5" />
              </button>
              </div>
            </div>
            </div>
          </div>
    )
 } 
