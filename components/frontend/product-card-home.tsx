'use client'
 import { Heart, ShoppingCart , ChartNoAxesColumn, Star} from "lucide-react";
import { getAverageRatingByProductId } from "@/lib/actions/reviews";
import { getProductImages } from "@/lib/actions/image-actions";
import { AddToCart } from "@/app/products/add-to-cart-prop";
import {useCart} from "@/app/context/cartcontext";
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
  const {addToCart, cart, removeFromCart} = useCart();
    const rounded = Math.round(product.averageRating);
  const isInCart = cart.some(item => item.product.id === product.id);
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
  const sortedImages = product.images.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.order === null && b.order !== null) return 1;
    if (a.order !== null && b.order === null) return -1;
    if (a.order !== null && b.order !== null) return a.order - b.order;
    return 0;
  });


    const toggleCart = (product: ProductUnited['product']) => {

        if (isInCart) {
          removeFromCart(product.id);
        } else {
          addToCart(product);
        }
      };
    return ( 
        <div className="bg-white border-gray-100 border-2 rounded-2xl lg:max-w-[450px]  transition-all duration-300 overflow-hidden  group lg:p-[12px] lg:min-w-[300px]" key={product.id}> 
        <div className="hidden lg:block flex flex-col  px-2 py-2">
          <Link className="relative overflow-hidden flex justify-center" href={`/product/${product.slug}`}>
          <img src={sortedImages[0]?.imageUrl} alt={product.title} className="w-[156px]  h-[156px] object-contain transition-transform duration-300 " />
          </Link>
          <Link href={`/product/${product.slug}`} className=" ">
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
 <div className={`${product.inStock === 'В наличии' ? 'bg-green-600/20' : product.inStock === 'Уточнить на наличие' ? 'bg-yellow-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${product.inStock === 'В наличии' ? 'text-green-600' : product.inStock === 'Уточнить на наличие' ? 'text-yellow-600' : 'text-red-600'}`}>{product.inStock}</p>
    </div>
          </div>
          <div className="flex flex-row gap-2 pt-3 text-sm items-center justify-between">
          {product.inStock === 'В наличии' ? (
  <h3 className="text-gray-900 font-semibold text-[16px]">{product.price} руб</h3>
) : product.inStock === 'Уточнить на наличие' ? (
  <h3 className="text-gray-900 font-semibold text-[16px]">Наличие уточняйте</h3>
) : (
  <h3 className="text-gray-900 font-semibold text-[16px]">Нет в наличии</h3>
)}
         <div className="flex items-center flex-row pr-1 gap-3">
          
          
           <AddToFavorite product={product}/>
            <AddToCart product={product}/>
          </div>
          </div>
        </div>
           <div className="lg:hidden">
            <Link className="relative overflow-hidden flex items-center justify-center" href={`/product/${product.slug}`}>
            <img src={sortedImages[0]?.imageUrl} alt={product.title} className="w-[156px] h-[156px] object-contain transition-transform duration-300" />
            </Link>
            
            <div className=" p-1 flex flex-col lg:flex-row gap-2 lg:gap-1 lg:p-0">
              <Link href={`/product/${product.slug}`}>
              {product.inStock === 'В наличии' ? (    <h3 className="text-[16px] font-semibold text-gray-900">{product.price} руб</h3>)
              : ( 
                <h3 className="text-[16px] font-semibold text-gray-900">Наличие уточняйте</h3>
              ) }
              <h3 className="text-gray-900 h-[42px]  lg:text-[16px] text-[14px] line-clamp-2">
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
              
              <div className={`${product.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${product.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>{product.inStock}</p>
    </div>
             
              <div className="flex flex-col pt-1 gap-3 items-start ">
                 
             <button onClick={() => toggleCart(product)} className={`flex w-full items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${isInCart ? 'bg-white border-blue-600 text-blue-600 ' : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'}`}>
             {isInCart ? 'В корзине' : 'В корзину'}
            </button>

             
              </div>
            </div>
            </div>
          </div>
    )
 } 
