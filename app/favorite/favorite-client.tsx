'use client';
import { useCart } from "../context/cartcontext"
import OrderForm from "@/components/forms/order-form";
import FavoriteItemComponent from "./cartprops" 
import { useFavorite } from "../context/favoritecontext";
import {getFeaturedImage} from "@/lib/actions/image-actions";
import ProductCard from "@/components/frontend/product-card-full";
import Link from "next/link";
export default function FavoritePage() {
    const { favorite, clearFavorite  } = useFavorite();


     
 
    
    return (  <div className=" min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] ">
      <div className="pt-6 px-[12px]"> <div className="flex flex-col gap-1 lg:hidden"> 
                <h1 className="text-[22px] font-semibold text-gray-900">Избранное</h1>
                <div className="flex flex-row justify-between items-center bg-white py-3 px-2 rounded-md ">
                <p className="text-[14px] font-semibold text-gray-900">{favorite.length} товара</p>
                <div className="">
                    <button onClick={() => clearFavorite()} className="text-blue-500 cursor-pointer text-[14px] transition-colors flex-shrink-0">Очистить избранное</button>
                </div>
                </div>
               </div></div>
      
        <div className="flex flex-col py-5 px-[12px]">
            {favorite.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="bdog md:text-[12px] text-[11px] uppercase">Избранное пусто</p>
                </div>
            ) : (
              <div className="flex lg:flex-row flex-col w-full gap-5">
                
               <div className="flex flex-col bg-white justify-between rounded-xl lg:p-5 w-full lg:w-full">
                  <div className="flex flex-col gap-3">  {favorite.map((item) => (
                        <FavoriteItemComponent key={item.product.id} item={item} />
                    ))}</div>
                </div>
               
                </div>           
            )}

            
    
            </div>
        </div>)
}