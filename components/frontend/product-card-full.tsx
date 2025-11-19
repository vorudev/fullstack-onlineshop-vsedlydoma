 'use client'
 import { Heart, ShoppingCart , ChartNoAxesColumn, Star} from "lucide-react";
import { getAverageRatingByProductId } from "@/lib/actions/reviews";
import { getProductImages } from "@/lib/actions/image-actions";
import { AddToCart } from "@/app/products/add-to-cart-prop";
import Link from "next/link";
import { AddToFavorite } from "@/app/products/add-to-favorite-prop";
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
        <div className="bg-white rounded-2xl lg:max-w-[450px]  transition-all duration-300 overflow-hidden  group lg:p-[12px] min-w-[300px]" key={product.id}> 
        <div className="hidden lg:block flex flex-col  px-2 py-2">
          <Link className="relative overflow-hidden" href={`/product/${product.slug}`}>
            <ImagesSliderCardFull images={product.images} title={product.title} />
          </Link>
          <Link href={`/product/${product.slug}`}>
          <h3 className="text-black min-h-[70px] text-[15px] line-clamp-3">
            {product.title}
          </h3>
          
          </Link>
          <div className="flex flex-row gap-2 pt-2 text-sm items-center">
            
          <div className="flex items-center py-1 rounded-lg">
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
         <div className="flex items-center flex-row pr-1 gap-3">
          
          
           <AddToFavorite product={product}/>
            <AddToCart product={product}/>
          </div>
          </div>
        </div>
           <div className="lg:hidden"><Link className="relative overflow-hidden" href={`/product/${product.slug}`}>
            <ImagesSliderCardFull images={product.images} title={product.title} />
              
              
            </  Link>
            
            <div className="p-5 flex flex-col lg:flex-row gap-2 lg:gap-1 lg:p-0">
              <Link href={`/product/${product.slug}`}>
              <h3 className="text-gray-900  lg:text-[16px] text-[14px] line-clamp-2">
                {product.title}
              </h3>
              </Link>
              <Link className="flex items-center " href={`/product/${product.slug}`}>
               {rounded ? rounded && 
              <div className={`flex mr-2 lg:text-[16px] text-[14px] items-center gap-1 ${getRatingColor(rounded)}`}>
                  <Star className="w-4 h-4" /> {rounded ? rounded : null} 
                </div> : null}  
 <span className=" text-gray-500 text-[14px] lg:text-[16px]">
  {getReviewText(product.reviewCount)}
</span>  


              </Link>
              
             
              <div className="flex flex-row gap-3 items-center ">
                 <div className="text-[16px]
                 font-semibold text-gray-900 w-1/2">
                  <h3>{product.price} руб</h3></div>
             <div className="w-1/2 flex flex-row  items-center justify-end gap-2"> 
              <AddToFavorite product={product}/>
              <AddToCart product={product}/>

              </div>

             
              </div>
            </div>
            </div>
          </div>
    )
 } 
