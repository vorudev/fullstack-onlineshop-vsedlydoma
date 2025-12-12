'use client';
import { useCart } from "../context/cartcontext"
import OrderForm from "@/components/forms/order-form";
import { useEffect } from "react";
import FavoriteItemComponent from "./cartprops" 
import { useFavorite } from "../context/favoritecontext";
import {getFeaturedImage} from "@/lib/actions/image-actions";
import ProductCard from "@/components/frontend/product-card-full";
import Link from "next/link";
import SkeletonCartProps from "../cart/skeleton-cart-props";
import { CartItemComponent } from "../cart/cartprops";
import ProductCardSkeleton from "@/components/frontend/skeletons/product-card-home-skeleton";
export default function FavoritePage() {
    const { favorite, clearFavorite, validateFavorite, updatedFavorite, isValidating, validationErrors  } = useFavorite();


    useEffect(() => {
        validateFavorite();
    }, [favorite]);
 
    
    return (  <div className="min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] pb-30">
        <div className="flex flex-col py-5 px-[12px]">
           {!isValidating && favorite.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="bdog md:text-[12px] text-[11px] uppercase text-gray-600">Избранное пусто</p>
            </div>
          ) : (
            <>
              <div className="flex lg:flex-row flex-col w-full gap-5">
                <div className="flex flex-col gap-1 lg:hidden">
                  <h1 className="text-[22px] font-semibold text-gray-900">Избранное</h1>
                  <div className="flex flex-row justify-between items-center bg-white py-3 px-2 rounded-md">
                   {isValidating ? (
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-[14px] font-semibold text-gray-900">{favorite.length} товара</p>
                    )}  
                   
                    <div>
                      <button onClick={() => clearFavorite()} className="text-blue-500 cursor-pointer text-[14px] transition-colors flex-shrink-0">
                        Очистить избранное
                      </button>
                    </div>
                  </div>
                </div>
      
                <div className="flex flex-col justify-between rounded-xl lg:p-0 w-full lg:w-full">
                  <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isValidating ? (
                      <>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                      </>
                    ) : (
                      updatedFavorite?.map((item) => (
                        <FavoriteItemComponent key={item.product.id} item={item} />
                      ))
                    )}
                  </div>
      
                 
      
                  <div className="flex justify-center px-2 py-4 lg:hidden">
             
                  </div>
                </div>
    
              </div>
            </>
          )}
        </div>
      </div>)
      }