import { useCart } from "@/app/context/cartcontext";
import {useFavorite} from "@/app/context/favoritecontext";
import Image from "next/image";
import { useState } from "react";
import {Heart} from "lucide-react";
import { Star } from "lucide-react";
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
            categoryId: string | null;
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
export default function DesktopSection({productDetails}: ProductUnited) {
    const {addToCart, cart} = useCart();
    const {addToFavorite, favorite, } = useFavorite();
    const [maxVisible] = useState(8);
   const isInCart = cart.some((item) => item.product.id === productDetails.id);
      const isInFavorite = favorite.some((item) => item.product.id === productDetails.id);
  
    const visibleAttributes = productDetails?.attributes.slice(0, maxVisible) || [];
  const hasMore = productDetails?.attributes.length > maxVisible;
    return (
        <div className="lg:flex lg:flex-col items-start hidden justify-start gap-[12px] w-full  ">
           
      <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col max-w-[60%]">
           <h3 className="text-[20px] text-gray-900 font-semibold leading-tight  ">{productDetails?.title}</h3>
           <p className="text-[12px] text-gray-600 ">Код товара {productDetails?.sku}</p>
           </div>
        
      <div className="relative w-[90px] h-[40px]">
          {productDetails?.manufacturer !== null && <Image src={productDetails?.manufacturer.images[0].imageUrl} alt="Product" fill className="object-contain" />}
          </div>
          
      </div>
      
      
      
      <div className="flex flex-row gap-1 items-center ">
                  <Star className="w-[16px] h-[16px] text-yellow-300" fill="#FFD700"/>
                  <p className="text-[16px] text-gray-900 font-semibold">{productDetails?.averageRating.toFixed(2)} </p>
                  <p className="text-[16px] text-gray-600 pl-[6px]">{productDetails?.reviewCount} отзыва</p>
       </div>
       <div className="flex flex-col gap-3 xl:hidden items-start">
        <div className="flex flex-col items-start  gap-2">
          <div className={productDetails?.inStock === 'В наличии' ? 'flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-[6px]' : 'flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-[6px]'}>
            <div className={productDetails?.inStock === 'В наличии' ? 'w-2 h-2 bg-green-500 rounded-full' : 'w-2 h-2 bg-red-500 rounded-full'}></div>
            <span className={productDetails?.inStock === 'В наличии' ? 'text-[13px] text-green-700 font-medium' : 'text-[13px] text-red-700 font-medium'}>{productDetails?.inStock}</span>
          </div>
          <h3 className="text-[28px] text-gray-900 font-bold leading-tight">{productDetails?.price} руб</h3>
        </div>
       <div className="flex flex-col gap-2 items-center w-full">
          
          <button className="bg-blue-600 w-full text-white cursor-pointer px-6 py-3 rounded-[8px] font-semibold flex-1 justify-center"
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
          >
            В корзину
          </button>
          <button className="bg-white border-2 border-gray-200 cursor-pointer flex items-center gap-2 text-gray-700 p-3 rounded-[8px]"
          onClick={() => addToFavorite(productDetails)}
          >
            <Heart className="w-[20px] h-[20px]" /> В избранное
          </button>
        </div>
      </div>
       <div className="flex flex-row w-full justify-between  ">
       <div className="flex flex-col gap-3 hidden xl:block ">
      <h3 className="text-sm text-gray-900 font-semibold mb-3">
        Характеристики:
      </h3>
      
      <div className="max-w-[150px]">
        <div className="">
           {visibleAttributes.map((attr, index) => (
            <div
              key={attr.id || attr.slug || index}
              className="grid grid-cols-[minmax(150px,1fr)_minmax(100px,1fr)] text-[14px]  gap-3 py-1"
            >
              <div className="text-gray-500 font-medium break-words">
                {attr.name || 'Не указано'}
              </div>
              <div className="text-black text-start text-right break-words">
                {attr.value || '—'}
              </div>
            </div>
          ))} 
          {hasMore && (
            <button className="text-blue-600 font-semibold text-[14px]">
              Показать все
            </button>
          )}
        </div>
      </div>
    </div>
      <div className="xl:flex hidden flex-col gap-3 items-end">
        <div className="flex flex-col items-end gap-2">
          <div className={productDetails?.inStock === 'В наличии' ? 'flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-[6px]' : 'flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-[6px]'}>
            <div className={productDetails?.inStock === 'В наличии' ? 'w-2 h-2 bg-green-500 rounded-full' : 'w-2 h-2 bg-red-500 rounded-full'}></div>
            <span className={productDetails?.inStock === 'В наличии' ? 'text-green-700' : 'text-red-700'}>{productDetails?.inStock}</span>
          </div>
          <h3 className="text-[28px] text-gray-900 font-bold leading-tight">{productDetails?.price} руб</h3>
        </div>
        <div className="flex flex-col gap-2 items-center w-full">
          
          <button 
          disabled={isInCart}
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
          className={` w-full px-6 py-3 cursor-pointer rounded-[8px] font-semibold flex-1 justify-center ${isInCart ? 'bg-white text-blue-600 border border-blue-600' : 'bg-blue-600 text-white border border-blue-600'}`}>
           { isInCart ? 'В корзине' : 'В корзину' }
          </button>
          <button
          onClick={() => addToFavorite(productDetails)}
          disabled={isInFavorite}
          className={`bg-white  border-2 w-full cursor-pointer hover:bg-gray-100 transition  border-gray-200 flex items-center justify-center gap-2 text-gray-700 p-3 rounded-[8px]`}>
            <Heart className={`w-[20px] h-[20px] ${isInFavorite ? 'fill-red-500 text-red-500' : '' }`} />  { isInFavorite ? 'В избранном' : 'В избранное' }
          </button>
        </div>
      </div>
       </div>
              </div>
    );
}