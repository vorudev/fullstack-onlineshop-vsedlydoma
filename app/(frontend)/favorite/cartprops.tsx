import React from "react";
import { useFavorite } from "../../context/favoritecontext";
import { useState, useEffect, useCallback } from "react";
import type { FavoriteItem, ValidatedFavoriteItem } from "../../context/favoritecontext";
import Image from "next/image";
import { useCart } from "../../context/cartcontext";
import { Star, Trash2, Heart } from "lucide-react";
import Link from "next/link";
import { getFeaturedImage } from "@/lib/actions/image-actions";
import {AddToCart}from "../products/add-to-cart-prop";
import { ProductImage } from "@/db/schema";
import ImagesSliderCardFull from "../cart/images-slider-card-full";
import { AddToFavorite } from "../products/add-to-favorite-prop";
type CartItemProps = {
  item: ValidatedFavoriteItem;
};

export const FavoriteItemComponent = ({ item }: CartItemProps) => {





 
    
  

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
   
   
     
     
        
       
    <li className="bg-white rounded-2xl lg:max-w-[450px]  transition-all duration-300 overflow-hidden  group lg:p-[12px] min-w-[300px]" key={item.product.id}> 
    <div className="hidden lg:block flex flex-col  px-2 py-2">
    <div className="flex flex-row items-start  gap-2">
      <div className="relative  mx-auto w-[180px] h-[150px] overflow-hidden  ">
       {featuredImage?.imageUrl ? <Image src={featuredImage?.imageUrl} alt={item.product.title} fill className="object-contain"/> : <p>Нет картинка товара</p>}
      </div>
      </div>
      <Link href={`/product/${item.product.slug}`}>
      <h3 className="text-black min-h-[70px] text-[15px] line-clamp-3">
        {item.product.title}
      </h3>
      
      </Link>
      <div className="flex flex-row gap-2 pt-2 text-sm items-center">
        
      <div className="flex items-center py-1 rounded-lg">
      {rounded ? rounded && 
      <div className={`flex mr-2  items-center gap-1 font-semibold ${getRatingColor(rounded)}`}>
          <Star className="w-4 h-4" /> {rounded ? rounded : null} 
        </div> : null} 
<span className=" text-gray-500">
 {getReviewText(item.product.reviewCount)}
</span>  

</div>
      </div>
      <div className="flex flex-row gap-2 pt-3 text-sm items-center justify-between">
     <h3 className="text-gray-900 font-semibold text-[16px]">{item.product.price} руб</h3>
     <div className="flex items-center flex-row pr-1 gap-3">
      
      
     <AddToFavorite product={item.product}/>
        <AddToCart product={item.product}/>
      </div>
      </div>
    </div>
       <div className="lg:hidden"><Link className="relative overflow-hidden" href={`/product/${item.product.slug}`}>
        <ImagesSliderCardFull images={item.product.images} title={item.product.title} />
          
          
        </  Link>
        
        <div className="p-5 flex flex-col lg:flex-row gap-2 lg:gap-1 lg:p-0">
          <Link href={`/product/${item.product.slug}`}>
          <h3 className="text-gray-900  lg:text-[16px] text-[14px] line-clamp-2">
            {item.product.title}
          </h3>
          </Link>
          <Link className="flex items-center " href={`/product/${item.product.slug}`}>
           {rounded ? rounded && 
          <div className={`flex mr-2 lg:text-[16px] text-[14px] items-center gap-1 ${getRatingColor(rounded)}`}>
              <Star className="w-4 h-4" /> {rounded ? rounded : null} 
            </div> : null}  
<span className=" text-gray-500 text-[14px] lg:text-[16px]">
{getReviewText(item.product.reviewCount)}
</span>  


          </Link>
          
         
          <div className="flex flex-row gap-3 items-center ">
             <div className="text-[16px]
             font-semibold text-gray-900 w-1/2">
              <h3>{item.product.price} руб</h3></div>
         <div className="w-1/2 flex flex-row  items-center justify-end gap-2"> 
          <AddToFavorite product={item.product}/>
          <AddToCart product={item.product}/>

          </div>

         
          </div>
        </div>
        </div>
      </li>
        
  );
};

export default FavoriteItemComponent; 