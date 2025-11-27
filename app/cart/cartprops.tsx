import React from "react";
import { useCart } from "../context/cartcontext"; // Adjust the import path as necessary
import { useState, useEffect, useCallback } from "react";
import type { CartItem, ValidatedCartItem } from "../context/cartcontext";
import { useFavorite } from "../context/favoritecontext";
import Image from "next/image";
import {useRouter} from "next/navigation";
import { Heart, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { getFeaturedImage } from "@/lib/actions/image-actions";
import { ProductImage } from "@/db/schema";
import ImagesSliderCardFull from "./images-slider-card-full";
type CartItemProps = {
  item: ValidatedCartItem
};

export const CartItemComponent = ({ item }: CartItemProps) => {
  const router = useRouter();
  const { updateQuantity, removeFromCart, validateCart } = useCart();
  const { addToFavorite, removeFromFavorite } = useFavorite();
  const [image, setImage] = useState<ProductImage | null>(null);

  const [inputValue, setInputValue] = useState(item.quantity.toString());


  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
 
    if (/^\d*$/.test(val)) {
      setInputValue(val);
    }
  }, []);
 


  const handleBlur = useCallback(() => {
    const trimmed = inputValue.trim();

  

    if (trimmed === '' || trimmed === '0') {
      removeFromCart(item.product.id);
      return;
    }


    const parsed = Number(trimmed);
    if (Number.isInteger(parsed) && parsed > 0) {
      updateQuantity(item.product.id, parsed);
    } else {
      setInputValue(item.quantity.toString());
    }
  }, [
    inputValue,
    item.product.id,
    item.quantity,
    updateQuantity,
    removeFromCart
  ]);


  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        (e.target as HTMLInputElement).blur();
      }
    },
    []
  );

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
const featuredImage = item?.product?.images?.find(img => img.isFeatured) || item?.product?.images?.[0];



  return (
   
   
     
     
        
       
           <li key={item.product.id} className="flex gap-4 w-full  p-3 bg-white rounded-lg border ">

  <div className="flex flex-col items-between  lg:gap-0 lg:items-start w-full">
    <div className="flex gap-4 w-full items-start " >
    {/* Image Section */}
    <div className="flex-shrink-0 hidden items-center justify-center lg:flex flex-col  overflow-hidden w-full lg:w-[180px]">
       <Link className="relative overflow-hidden lg:max-w-[180px] lg:max-h-[150px]  " href={`/product/${item?.product?.slug}`}>
            <ImagesSliderCardFull images={item?.product?.images} title={item?.product?.title} />
          </Link>
      <p className="text-gray-400 text-[12px] text-center">{item?.product?.sku}</p>
    </div>

    {/* Content Section */}
    <div className="flex-1 flex-col gap-10 py-3 px-2 hidden lg:flex">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
        <h2 className="text-base lg:font-medium text-[16px] cl text-gray-900 flex-1">{item.product.title}</h2>
      <div className={`${item.product.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${item.product.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>{item.product.inStock}</p>
    </div>
        </div>
        <button 
          className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0" 
          onClick={() => removeFromCart(item.product.id)}
          aria-label="Удалить товар"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className=" justify-between items-center hidden lg:flex">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-16 border text-black border-gray-300 rounded-md px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition duration-300 focus:border-transparent"
          />
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
       <button onClick={() => addToFavorite(item.product)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0">
            <Heart className="w-5 h-5" />
          </button>
 <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0">
  <Trash2 className="w-5 h-5" />
 </button>

    </div> 
    </div>
    <div className="flex gap-4 justify-between pt-4 items-center lg:hidden">
      
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-16 border text-black border-gray-300 rounded-md px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition duration-300 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">шт</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">{item.product.price.toFixed(2)} руб</p>
      </div>   
  </div>
</li>
        
  );
};

export default CartItemComponent; 