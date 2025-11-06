 'use client'
 import { Heart, ShoppingCart , ChartNoAxesColumn, Star} from "lucide-react";
import { getAverageRatingByProductId } from "@/lib/actions/reviews";
import { getProductImages } from "@/lib/actions/image-actions";
import Link from "next/link";
import { ProductImage } from "@/db/schema";
import ImagesSliderCardFull from "./images-slider-card-full";
interface ProductsWithImages {
  product: {
    id: string;
    title: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    slug: string;
    description: string;
    categoryId: string | null;
    price: number;
    manufacturerId: string | null;
    sku: string | null;
}

     images: ProductImage[];
}
export default function ProductCard( {product, images}: ProductsWithImages) {
  
  //  const rounded = Math.round(averageRating * 10) / 10;
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
        <div className="bg-white rounded-2xl  hover:shadow-xl transition-all duration-300 overflow-hidden  group lg:px-[24px] lg:py-[24px] " key={product.id}> 
            <Link className="relative overflow-hidden" href={`/product/${product.slug}`}>
            <ImagesSliderCardFull images={images} title={product.title} />
              
              
            </  Link>
            
            <div className="p-5 flex flex-col lg:flex-row lg:gap-1 lg:p-0">
              <Link href={`/product/${product.slug}`}>
              <h3 className="text-gray-900  text-[16px] line-clamp-2">
                {product.title}
              </h3>
              </Link>
              <Link className="flex items-center mb-1" href={`/product/${product.slug}`}>
             {/* {rounded ? rounded && 
              <div className={`flex mr-2  items-center gap-1 ${getRatingColor(rounded)}`}>
                  <Star className="w-4 h-4" /> {rounded ? rounded : null} 
                </div> : null}  */}
{/* <span className=" text-gray-500">
  {getReviewText(reviewCount)}
</span> */}

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
    )
 } 
