'use client'
import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewForm } from '@/components/forms/review-form';
import { useCart } from '@/app/context/cartcontext';
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
interface ProductUnited {
   
  productDetails: {
    averageRating: number;
    reviewCount: number;
        description: string;
    id: string;
    title: string;
    price: number;
    sku: string | null;
    slug: string;
    categoryId: string | null;
    inStock: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    manufacturerId: string | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        isFeatured: boolean | null;
        order: number | null;
        createdAt: Date | null;
        
   
    }[];
    reviews: {
        id: string | null;
        productId: string;
        rating: number | null;
        comment: string | null;
        createdAt: Date | null;
        author: string | null;
    }[];
    attributeCategories: {
        id: string | null;
        name: string | null;
        slug: string | null;
        displayOrder: number | null;
        attributes: {
            id: string | null;
            categoryId: string | null;
            name: string | null;
            value: string | null;
            order: number | null;
            slug: string | null;
        }[];
    }[];
    manufacturer: {
        id: string | null;
        name: string | null;
        slug: string | null;
        description: string | null;
        images: {
            id: string | null;
            manufacturerId: string | null;
            imageUrl: string;
            storageType: string | null;
            order: number | null;
            storageKey: string | null;
        }[];
    };
} 


}
export default function ProductPage({productDetails}: ProductUnited) {
    const [isExpanded, setIsExpanded] = useState(false);
    const {addToCart} = useCart();
    const {addToFavorite} = useFavorite();
  const INITIAL_DISPLAY_COUNT = 6;

  // Собираем все атрибуты из всех категорий
  const allAttributes = productDetails?.attributeCategories.flatMap(category => 
    category.attributes
      .filter(attr => attr.name && attr.value)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  );

  // Определяем, какие атрибуты показывать
  const displayedAttributes = isExpanded 
    ? allAttributes 
    : allAttributes?.slice(0, INITIAL_DISPLAY_COUNT);
if (!allAttributes) {
  return null;
}
  const hasMore = allAttributes?.length > INITIAL_DISPLAY_COUNT;

  if (allAttributes?.length === 0) {
    return null;
  }
   const splitAttributes = {
        left: allAttributes?.filter((_, index) => index % 2 === 0),
        right: allAttributes?.filter((_, index) => index % 2 === 1)
      }
    
 return ( 
    <div className="pt-[16px] px-[16px] overflow-hidden flex w-full flex-col gap-3">
  <div className="flex overflow-x-auto gap-2 items-center px-4 md:px-0 snap-x snap-mandatory text-gray-600 text-[14px]" style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
        <div className="flex items-center gap-2 min-w-[80px]"><p>Каталог</p>
        <ChevronRight className="w-[12px] h-[12px]"/></div>
        </div>
         <div className="flex flex-col lg:hidden gap-1">
            <h3 className="text-[20px] text-gray-900 font-semibold  leading-tight lg:text-[32px]">{productDetails?.title}</h3>
            <p className="text-[12px] text-gray-600 ">Код товара   {productDetails?.sku}</p>
            </div>
            <div className="flex flex-row gap-1 items-center lg:hidden">
            <Star className="w-[16px] h-[16px] text-yellow-300" fill="#FFD700"/>
            <p className="text-[14px] text-gray-900 font-semibold">{productDetails?.averageRating} </p>
            <p className="text-[14px] text-gray-600 ">{productDetails?.reviewCount} отзыва</p>
            </div>
            <div className="flex flex-col lg:bg-white lg:p-[30px] lg:rounded-xl gap-10">
        <div className="flex flex-col lg:flex-row lg:justify-start lg:items-start gap-[12px] lg:gap-[80px] ">
            <ImagesSliderProductPage images={productDetails?.images} />
  <div className="lg:flex lg:flex-col items-start hidden justify-start gap-[12px] w-full  ">
     
<div className="flex flex-row justify-between w-full">
    <div className="flex flex-col max-w-[60%]">
     <h3 className="text-[20px] text-gray-900 font-semibold leading-tight  ">{productDetails?.title}</h3>
     <p className="text-[12px] text-gray-600 ">Код товара {productDetails?.sku}</p>
     </div>
  
<div className="relative w-[90px] h-[40px]">
    <Image src={productDetails?.manufacturer.images[0].imageUrl} alt="Product" fill className="object-contain" />
    </div>
    
</div>



<div className="flex flex-row gap-1 items-center ">
            <Star className="w-[16px] h-[16px] text-yellow-300" fill="#FFD700"/>
            <p className="text-[16px] text-gray-900 font-semibold">{productDetails?.averageRating} </p>
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
    
    <button className="bg-blue-600 w-full text-white px-6 py-3 rounded-[8px] font-semibold flex-1 justify-center"
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
    <button className="bg-white border-2 border-gray-200 flex items-center gap-2 text-gray-700 p-3 rounded-[8px]"
    onClick={() => addToFavorite(productDetails)}
    >
      <Heart className="w-[20px] h-[20px]" /> В избранное
    </button>
  </div>
</div>
 <div className="flex flex-row w-full justify-between  ">
 <div className="flex flex-col gap-[12px] items hidden xl:block">
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
    className="bg-blue-600 w-full text-white px-6 py-3 rounded-[8px] font-semibold flex-1 justify-center">
      В корзину
    </button>
    <button
    onClick={() => addToFavorite(productDetails)}
    className="bg-white border-2 w-full border-gray-200 flex items-center justify-center gap-2 text-gray-700 p-3 rounded-[8px]">
      <Heart className="w-[20px] h-[20px]" /> В избранное
    </button>
  </div>
</div>
 </div>
        </div>

        

 

        </div>
        <div className="flex flex-col gap-[12px] items-start pt-10  hidden lg:block">
            <h3 className="text-[24px] text-gray-900 font-semibold">О товаре</h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

					{productDetails?.description}
            </p>
            <button className="text-[14px] text-blue-600  font-semibold">Показать все</button>
        </div>
        <div className="hidden lg:block">
            <h3 className="text-[24px] pb-4 text-gray-900 font-semibold ">
                О производителе
            </h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

							{productDetails?.manufacturer.description}
            </p>
        </div>
       <div className="flex flex-col gap-[12px] hidden lg:block">
        <h3 className="text-[24px] pb-4 text-gray-900 font-semibold">
          Характеристики:
        </h3>
        
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[14px] w-full ">
          {/* Левая колонка */}
          <div className="grid grid-cols-[minmax(80px,_max-content)_1fr] gap-x-10 gap-y-3">
            {splitAttributes?.left?.map((attribute, index) => (
              <React.Fragment key={attribute.id || `attr-left-${index}`}>
                <p className="text-gray-600 max-w-[170px]">
                  {attribute.name}
                </p>
                <p className="text-gray-900">
                  {attribute.value}
                </p>
              </React.Fragment>
            ))}
          </div>

          {/* Правая колонка */}
          <div className="grid grid-cols-[minmax(80px,_max-content)_1fr] gap-x-10 gap-y-3">
            {splitAttributes?.right?.map((attribute, index) => (
              <React.Fragment key={attribute.id || `attr-right-${index}`}>
                <p className="text-gray-600 max-w-[170px]">
                  {attribute.name}
                </p>
                <p className="text-gray-900">
                  {attribute.value}
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>

        
      </div>
         <div className="flex flex-col gap-1 items-start mt-[20px] hidden lg:block ">
            <h3 className="text-[24px] text-gray-900 font-semibold">Отзывы</h3>
            <div className="flex flex-col gap-2 items-start border-b border-gray-200 pb-2 w-full ">
<div className="flex flex-row gap-2 items-center"><div className="flex flex-row gap-1 items-center">
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" />

<p className="text-[24px] text-gray-900 font-semibold">{productDetails?.averageRating}</p>
  <p className="text-[14px] text-gray-600">{productDetails?.reviewCount} отзыва</p>
  </div>
 
  </div>
<Dialog>
    <DialogTrigger className="bg-blue-600 font-semibold text-white px-4 py-4 rounded-lg text-black">Добавить отзыв</DialogTrigger>
    <DialogContent className="bg-white  text-black">
      <DialogHeader>
        <DialogTitle className="text-[24px] text-gray-900 font-semibold">Добавить отзыв</DialogTitle>
      </DialogHeader>
      <ReviewForm product_id={productDetails?.id} />
    </DialogContent>
  </Dialog>
            </div>
          {
            productDetails?.reviews?.map((review) => (
              <div className="flex flex-col gap-2 p-2 " key={review.id}>
            <h3 className="text-[16px] text-gray-900 font-semibold">{review.author}</h3>
<div className="flex flex-row gap-1 items-center">
<Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" />
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     {review.comment}
</p>
<p className="text-[14px] text-gray-600">{review.createdAt?.toDateString()}</p>
          </div>

          ))
          }
          <div className="flex flex-col gap-2 p-2 ">
            <h3 className="text-[16px] text-gray-900 font-semibold">Кирилл</h3>
<div className="flex flex-row gap-1 items-center">
<Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" />
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     В характеристики указана функция загрузки белья во время стирки, не получилось разобраться как это сделать.  Так как во время стирки двери блокируются. 
</p>
<p className="text-[14px] text-gray-600">12.12.2023</p>
          </div>
          <div className="flex flex-col gap-2 p-2  ">
            <h3 className="text-[16px] text-gray-900 font-semibold">Кирилл</h3>
<div className="flex flex-row gap-1 items-center">
<Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" />
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     В характеристики указана функция загрузки белья во время стирки, не получилось разобраться как это сделать.  Так как во время стирки двери блокируются. 
</p>
<p className="text-[14px] text-gray-600">12.12.2023</p>
          </div>
<div className="flex flex-col gap-2 p-2  ">
            <h3 className="text-[16px] text-gray-900 font-semibold">Кирилл</h3>
<div className="flex flex-row gap-1 items-center">
<Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" />
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     В характеристики указана функция загрузки белья во время стирки, не получилось разобраться как это сделать.  Так как во время стирки двери блокируются. 
</p>
<p className="text-[14px] text-gray-600">12.12.2023</p>
          </div>
        </div>
        </div>

    <div className="flex items-center lg:hidden justify-between pt-5">
    <h1 className="text-[24px] text-gray-900 font-semibold">
{productDetails?.price} руб
        </h1>
        <div className="flex items-center flex-row gap-3">
            <button 
            onClick={() => addToFavorite(productDetails)}
            className=" text-gray-900  rounded-[8px]">
          <Heart className="w-5 h-5"/>
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
            className="bg-blue-600 text-white px-[16px] py-2 rounded-[8px] font-semibold">
            В корзину
        </button></div>
        </div>
        
         <div className="flex flex-col gap-[12px] items block lg:hidden">
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
        <div className="flex flex-col gap-[12px] items-start pt-5">
            <h3 className="text-[24px] text-gray-900 font-semibold">О товаре</h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

					
                    {productDetails?.description}
            </p>
            <button className="text-[14px] text-blue-600  font-semibold">Показать все</button>
        </div>
        <div>
            <h3 className="text-[24px] pb-4 text-gray-900 font-semibold ">
                О производителе
            </h3>
            <p className="text-[14px] text-gray-900 max-w-[600px]">

							{productDetails?.manufacturer.description}
            </p>
        </div>
        <div className="flex flex-col gap-1 items-start mt-[20px] ">
            <h3 className="text-[24px] text-gray-900 font-semibold">Отзывы</h3>
            <div className="flex flex-row gap-2 items-center border-b border-gray-200 pb-2 w-full ">
<div className="flex flex-row gap-1 items-center">
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[24px] h-[24px] text-yellow-300" />
</div>
<p className="text-[24px] text-gray-900 font-semibold">4.0</p>
  <p className="text-[14px] text-gray-600">122 отзыва</p>
            </div>
          <div className="flex flex-col gap-2 p-2 ">
            <h3 className="text-[16px] text-gray-900 font-semibold">Кирилл</h3>
<div className="flex flex-row gap-1 items-center">
<Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" />
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     В характеристики указана функция загрузки белья во время стирки, не получилось разобраться как это сделать.  Так как во время стирки двери блокируются. 
</p>
<p className="text-[14px] text-gray-600">12.12.2023</p>
          </div>
          <div className="flex flex-col gap-2 p-2  ">
            <h3 className="text-[16px] text-gray-900 font-semibold">Кирилл</h3>
<div className="flex flex-row gap-1 items-center">
<Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" />
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     В характеристики указана функция загрузки белья во время стирки, не получилось разобраться как это сделать.  Так как во время стирки двери блокируются. 
</p>
<p className="text-[14px] text-gray-600">12.12.2023</p>
          </div>
<div className="flex flex-col gap-2 p-2  ">
            <h3 className="text-[16px] text-gray-900 font-semibold">Кирилл</h3>
<div className="flex flex-row gap-1 items-center">
<Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" fill="#FFD700"/>
    <Star className="w-[20px] h-[20px] text-yellow-300" />
</div>
<p className="text-[14px] text-gray-900 pt-1"> 
     В характеристики указана функция загрузки белья во время стирки, не получилось разобраться как это сделать.  Так как во время стирки двери блокируются. 
</p>
<p className="text-[14px] text-gray-600">12.12.2023</p>
          </div>
        </div>
<p className="text-[14px] text-blue-600 font-semibold">
    Показать все отзывы
</p>
    </div>
 )
}