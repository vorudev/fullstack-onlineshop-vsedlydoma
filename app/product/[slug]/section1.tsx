'use client'
import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Check, ChevronLeft, ChevronRight, Link, Minus, Plus } from 'lucide-react';
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
    product: Product;
}

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
export default function ProductPage({product, productImages, manufacturerImages, manufacturer,  reviews, attributes,  internals,stats}: Product) {
    const {addToCart, cart, removeFromCart, updateQuantity} = useCart();
    const {addToFavorite, favorite, removeFromFavorite} = useFavorite();
   const isInCart = cart.find((item) => item.id === product.id);
   const quantity = isInCart?.quantity || 0;
      const isInFavorite = favorite.some((item) => item.id === product.id);
      const toggleFavorite = (product: Product['product']) => {
        if (isInFavorite) {
          removeFromFavorite(product.id); 
        } else {
          addToFavorite(product.id);
        }
      };
      const toggleCart = (product: Product['product']) => {
        if (isInCart) {
          removeFromCart(product.id);
        } else {
          addToCart(product.id);
        }
      };
      const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInCart) {
            updateQuantity(product.id, quantity + 1);
        } else {
            addToCart(product.id);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else if (quantity === 1) {
            removeFromCart(product.id);
        }
    };

    const handleMainClick = () => {
        if (!isInCart) {
            addToCart(product.id);
        }
    };
 return ( 
    <div className=" px-[16px] overflow-hidden flex w-full flex-col gap-3">
  <div className="flex overflow-x-auto gap-2 items-center px-4 md:px-0 snap-x snap-mandatory text-gray-600 text-[14px]" style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
        
        
        </div>
         <div className="flex flex-col lg:hidden gap-1">
            <h2 className="text-[20px] text-gray-900 font-semibold  leading-tight lg:text-[32px]">{product.title}</h2>
            <p className="text-[12px] text-gray-600 ">Код товара   { product.sku}</p>
            </div>
            <div className="flex flex-row gap-1 items-center lg:hidden">
            <Star className="w-[16px] h-[16px] text-yellow-300" fill="#FFD700"/>
            <p className="text-[14px] text-gray-900 font-semibold">{stats.averageRating.toFixed(1)} </p>
            <p className="text-[14px] text-gray-600 ">{stats.totalCount} отзыва</p>
            </div>
            <div className="flex flex-col lg:bg-white lg:p-[30px] lg:rounded-xl gap-10">
        <div className="flex flex-col border-b-2 border-gray-100  lg:flex-row lg:justify-start lg:items-start gap-[12px] lg:gap-[80px] ">
            <ImagesSliderProductPage images={productImages} />
 <DesktopSection
stats={stats}
  reviews={reviews} productImages={productImages} internals={internals} product={product} manufacturer={manufacturer} manufacturerImages={manufacturerImages} attributes={attributes}/> 

        

 

        </div>
        <div className="flex flex-col gap-[12px] items-start pt-5  hidden lg:block">
            <h3 className="text-[24px] text-gray-900 font-semibold pb-4">О товаре</h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

					{product.description}
            </p>
        </div>
        <div className="hidden lg:block">
            <h3 className="text-[24px] pb-4 text-gray-900 font-semibold ">
                О производителе
            </h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">
{
(manufacturer !== null) ? manufacturer?.description : 'Производитель не указан'
}
						
            </p>
        </div>
       <div className="flex flex-col gap-[12px] hidden lg:block">
        <h3 className="text-[24px] pb-4 text-gray-900 font-semibold">
          Характеристики:
        </h3>
        
        {/* характеристики */}

         <DesktopAtributes reviews={reviews} productImages={productImages} internals={internals} product={product} manufacturer={manufacturer} manufacturerImages={manufacturerImages} attributes={attributes}  />
      </div>
         <DesktopReviews 
         reviews={reviews} 
         productImages={productImages} 
         internals={internals} 
         product={product} 
         stats={stats}
         manufacturer={manufacturer} 
         manufacturerImages={manufacturerImages} 
         attributes={attributes} />
        </div>

    <div className="flex items-center lg:hidden justify-between pt-5">
  {product.inStock === 'В наличии' ?  <div className="flex flex-col "> 
   
        <div className={`${product.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${product.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>{product?.inStock}</p>
    </div>
      <h2 className="text-[24px] text-gray-900 font-semibold">
{product?.price} руб
        </h2>
        </div> :  <div className={`${product?.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-2 rounded-md self-start`}>
    <p className={`text-[16px] text-gray-600  font-semibold ${product?.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>Уточните наличие</p>
    </div>}
        <div className="flex items-center flex-row gap-3">
            <button 
            onClick={() =>  toggleFavorite(product)}
            className={isInFavorite ? 'text-red-500' : 'text-gray-900'}>
          <Heart className={`w-5 h-5 ${isInFavorite ? 'text-red-500 fill-red-500' : 'text-gray-900'}`}/>
            </button>
            <div className="flex items-center w-full xl:min-w-[140px] min-w-[100px] max-w-[140px]">
            {isInCart ? (
                // Состояние: товар в корзине
                <div className="flex items-center w-full rounded-md border border-blue-600 overflow-hidden bg-white">
                    <button
                        onClick={handleDecrement}
                        className="flex-shrink-0 w-8 h-9 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Уменьшить количество"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center px-2 py-2 text-blue-600">
                        <span className="text-sm font-medium">{quantity}</span>
                    </div>
                    
                    <button
                        onClick={handleIncrement}
                        className="flex-shrink-0 w-8 h-9 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Увеличить количество"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                // Состояние: товар не в корзине
                <button
                    onClick={handleMainClick}
                    className="flex items-center justify-center gap-2 w-full xl:px-4 py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors"
                >
                    <ShoppingCart className="w-4 h-4 hidden xl:block" />
                    <span>В корзину</span>
                </button>
            )}
        </div>
            </div>
        </div>
        <MobileAtributes reviews={reviews} productImages={productImages} internals={internals} product={product} manufacturer={manufacturer} manufacturerImages={manufacturerImages} attributes={attributes} />
        <div className="flex flex-col gap-[12px] lg:hidden items-start pt-5">
            <h3 className="text-[24px] text-gray-900 font-semibold">О товаре</h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

					
                    {product?.description}
            </p>
            
        </div>
        <div className=" lg:hidden">
            <h3 className="text-[24px] pb-4 text-gray-900 font-semibold ">
                О производителе
            </h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

							{
(manufacturer !== null) ? manufacturer.description : 'Производитель не указан'
}
            </p>
        </div>
    
 <MobileReviews 
 reviews={reviews} 
 productImages={productImages} 
 internals={internals} 
 product={product} 
 manufacturer={manufacturer} 
 manufacturerImages={manufacturerImages} 
 attributes={attributes} 
 stats={stats}/>
    </div>
 )
}