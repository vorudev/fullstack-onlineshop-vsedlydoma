import React from "react";
import { useFavorite } from "../context/favoritecontext";
import { useState, useEffect, useCallback } from "react";
import type { FavoriteItem } from "../context/favoritecontext";
import Image from "next/image";
import { useCart } from "../context/cartcontext";
import { Star, Trash2, Heart } from "lucide-react";
import Link from "next/link";
import { getFeaturedImage } from "@/lib/actions/image-actions";
import {AddToCart}from "../products/add-to-cart-prop";
import { ProductImage } from "@/db/schema";
import ImagesSliderCardFull from "../cart/images-slider-card-full";
type CartItemProps = {
  item: FavoriteItem;
};

export const FavoriteItemComponent = ({ item }: CartItemProps) => {
  const { removeFromFavorite } = useFavorite();
  const { addToCart } = useCart();
  const [image, setImage] = useState<ProductImage | null>(null);






 
    
  

  const rounded = Math.round(item.product.averageRating);
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
const featuredImage = item.product.images.find(img => img.isFeatured) || item.product.images[0];



  return (
   
   
     
     
        
       
           <li key={item.product.id} className="flex gap-4 w-full  p-3 bg-white rounded-lg border ">

  <div className="flex flex-col items-between  lg:gap-0 lg:items-start w-full">
    <div className="flex gap-4 w-full items-start " >
    {/* Image Section */}
    <div className="flex-shrink-0 hidden items-center justify-center lg:flex flex-col  overflow-hidden w-full lg:w-[180px]">
       <Link className="relative overflow-hidden lg:max-w-[180px] lg:max-h-[150px]  " href={`/product/${item.product.slug}`}>
            <ImagesSliderCardFull images={item.product.images} title={item.product.title} />
          </Link>
      <p className="text-gray-400 text-[12px] text-center">{item.product.sku}</p>
    </div>

    {/* Content Section */}
    <div className="flex-1 flex-col gap-10 py-3 px-2 hidden lg:flex">
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-base lg:font-medium text-[16px] cl text-gray-900 flex-1">{item.product.title}</h2>
        <button 
          className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0" 
          onClick={() => removeFromFavorite(item.product.id)}
          aria-label="Удалить товар"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className=" justify-between items-center hidden lg:flex">
        <div className="flex items-center gap-2">
          
          <span className="text-sm text-gray-500">шт</span>

        <div className="flex items-center px-2 py-1 rounded-lg">
                  {rounded ? rounded && 
                  <div className={`flex mr-2  items-center gap-1 font-semibold ${getRatingColor(rounded)}`}>
                      <Star className="w-4 h-4" /> {rounded ? rounded : null} 
                    </div> : null} 
            <span className=" text-gray-500">
             {getReviewText(item.product.reviewCount)}
           </span>  
         
         </div>
        </div>
       
          <p className="text-lg font-semibold text-gray-900">{item.product.price.toFixed(2)} руб</p>
      </div> 
    </div>
    </div> 
     
    <div className="flex lg:hidden flex-row items-start  gap-2">
      <div className="relative w-[80px] h-[80px] overflow-hidden  ">
        <Image src={featuredImage?.imageUrl } alt={item.product.title} fill className="object-contain"/>
      </div>

   <div className="flex flex-col justify-between h-full  flex-1 lg:hidden"> 
  <Link href={`/product/${item.product.slug}`} className="text-base lg:font-medium line-clamp-2 text-[15px] text-gray-900 ">{item.product.title}</Link>
   <div className={`${item.product.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${item.product.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>{item.product.inStock}</p>
    </div>
   </div>

    <div className="flex flex-col gap-2 justify-start h-full ">
       <button onClick={() => addToCart(item.product)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0">
            <Heart className="w-5 h-5" />
          </button>
 <button onClick={() => removeFromFavorite(item.product.id)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0">
  <Trash2 className="w-5 h-5" />
 </button>

    </div> 
    </div>
    <div className="flex gap-4 justify-between pt-4 items-center lg:hidden">
      
       
        <p className="text-lg font-semibold text-gray-900">{item.product.price.toFixed(2)} руб</p>
         <div className="flex items-center gap-2">
     
          <button onClick={() => addToCart(item.product)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0">  Купить</button>
        </div>
      </div>   
  </div>
</li>
        
  );
};

export default FavoriteItemComponent; 