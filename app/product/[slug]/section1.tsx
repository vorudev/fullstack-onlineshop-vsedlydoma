'use client'
import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Check, ChevronLeft, ChevronRight, Link } from 'lucide-react';
import { ReviewForm } from '@/components/forms/review-form';
import DesktopSection from './desktop-section';
import DesktopAtributes from './desktop-attributes';
import { useCart } from '@/app/context/cartcontext';
import MobileAtributes from './mobile-atributes';
import DesktopReviews from './desktop-reviews';
import MobileReviews from './reviews-mobile';
import {ReviewsTable} from '@/components/reviews-table';
import ImagesSliderProductPage from './images-slider-product-page';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {useFavorite} from '@/app/context/favoritecontext';
import Image from 'next/image';
import { int } from 'zod';
interface Internals {
    slug: string;
    currentLimit: number;
}
interface United { 
    internals: Internals;
    productDetails: ProductUnited['productDetails'];
}

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
export default function ProductPage({productDetails, internals}: United) {
    const [isExpanded, setIsExpanded] = useState(false);
    const {addToCart, cart} = useCart();
    const {addToFavorite, favorite} = useFavorite();
   const isInCart = cart.some((item) => item.product.id === productDetails.id);
      const isInFavorite = favorite.some((item) => item.product.id === productDetails.id);
   
 return ( 
    <div className=" px-[16px] overflow-hidden flex w-full flex-col gap-3">
  <div className="flex overflow-x-auto gap-2 items-center px-4 md:px-0 snap-x snap-mandatory text-gray-600 text-[14px]" style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
        
        
        </div>
         <div className="flex flex-col lg:hidden gap-1">
            <h3 className="text-[20px] text-gray-900 font-semibold  leading-tight lg:text-[32px]">{productDetails?.title}</h3>
            <p className="text-[12px] text-gray-600 ">Код товара   { productDetails?.sku}</p>
            </div>
            <div className="flex flex-row gap-1 items-center lg:hidden">
            <Star className="w-[16px] h-[16px] text-yellow-300" fill="#FFD700"/>
            <p className="text-[14px] text-gray-900 font-semibold">{productDetails?.averageRating} </p>
            <p className="text-[14px] text-gray-600 ">{productDetails?.reviewCount} отзыва</p>
            </div>
            <div className="flex flex-col lg:bg-white lg:p-[30px] lg:rounded-xl gap-10">
        <div className="flex flex-col lg:flex-row lg:justify-start lg:items-start gap-[12px] lg:gap-[80px] ">
            <ImagesSliderProductPage images={productDetails?.images} />
 <DesktopSection productDetails={productDetails} /> 

        

 

        </div>
        <div className="flex flex-col gap-[12px] items-start pt-10  hidden lg:block">
            <h3 className="text-[24px] text-gray-900 font-semibold pb-4">О товаре</h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

					{productDetails?.description}
            </p>
        </div>
        <div className="hidden lg:block">
            <h3 className="text-[24px] pb-4 text-gray-900 font-semibold ">
                О производителе
            </h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">
{
(productDetails?.manufacturer !== null) ? productDetails?.manufacturer.description : 'Производитель не указан'
}
						
            </p>
        </div>
       <div className="flex flex-col gap-[12px] hidden lg:block">
        <h3 className="text-[24px] pb-4 text-gray-900 font-semibold">
          Характеристики:
        </h3>
        
        {/* характеристики */}

         <DesktopAtributes productDetails={productDetails} />
      </div>
         <DesktopReviews productDetails={productDetails} internals={internals}/>
        </div>

    <div className="flex items-center lg:hidden justify-between pt-5">
  {productDetails?.inStock === 'В наличии' ?  <div className="flex flex-col "> 
   
        <div className={`${productDetails?.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${productDetails?.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>{productDetails?.inStock}</p>
    </div>
      <h1 className="text-[24px] text-gray-900 font-semibold">
{productDetails?.price} руб
        </h1>
        </div> :  <div className={`${productDetails?.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-2 rounded-md self-start`}>
    <p className={`text-[16px] text-gray-600  font-semibold ${productDetails?.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>Уточните наличие</p>
    </div>}
        <div className="flex items-center flex-row gap-3">
            <button 
            onClick={() => addToFavorite(productDetails)}
            className={isInFavorite ? 'text-red-500' : 'text-gray-900'}>
          <Heart className={`w-5 h-5 ${isInFavorite ? 'text-red-500 fill-red-500' : 'text-gray-900'}`}/>
            </button>
            <button 
            onClick={() => addToCart({
    averageRating: productDetails?.averageRating,
    reviewCount: productDetails?.reviewCount,
    id: productDetails?.id,
    categoryId: productDetails?.categoryId,
    inStock: productDetails?.inStock,
    price: productDetails?.price,
    slug: productDetails?.slug,
    title: productDetails?.title,
    description: productDetails?.description,
    manufacturerId: productDetails?.manufacturerId,
    createdAt: productDetails?.createdAt,
    updatedAt: productDetails?.updatedAt,
    sku: productDetails?.sku,
    images: productDetails?.images,
    })}
            className={`px-[16px] py-2 border rounded-[8px] font-semibold ${isInCart ? 'border-blue-600 text-blue-600 cursor-not-allowed' : 'text-white  bg-blue-600'}`}
            >
           {isInCart ? 'В корзине' : 'В корзину'}
        </button></div>
        </div>
        <MobileAtributes productDetails={productDetails} />
     {/*    <div className="flex flex-col gap-[12px] items block lg:hidden">
      <h3 className="text-[14px] text-gray-900 font-semibold">
        Характеристики:
      </h3>
      
      <div className="grid grid-cols-[minmax(80px,_max-content)_1fr] gap-x-10 gap-y-3 text-[14px]">
        {displayedAttributes?.map((attribute, index) => (
          <React.Fragment key={attribute.id || `attr-${index}`}>
            <p className="text-gray-600 max-w-[170px]">
              {attribute.name}
            </p>
            <p className="text-gray-900">
              {attribute.value}
            </p>
          </React.Fragment>
        ))}
      </div>

      {hasMore && (
        <div className="flex items-center pt-[12px] justify-start">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[14px] text-blue-600 font-semibold"
          >
            {isExpanded ? 'Скрыть' : 'Показать все Характеристики'}
          </button>
        </div>
      )}
    </div>
    */}
        <div className="flex flex-col gap-[12px] lg:hidden items-start pt-5">
            <h3 className="text-[24px] text-gray-900 font-semibold">О товаре</h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

					
                    {productDetails?.description}
            </p>
            
        </div>
        <div className=" lg:hidden">
            <h3 className="text-[24px] pb-4 text-gray-900 font-semibold ">
                О производителе
            </h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

							{
(productDetails?.manufacturer !== null) ? productDetails?.manufacturer.description : 'Производитель не указан'
}
            </p>
        </div>
    
 <MobileReviews productDetails={productDetails} internals={internals}/>
    </div>
 )
}