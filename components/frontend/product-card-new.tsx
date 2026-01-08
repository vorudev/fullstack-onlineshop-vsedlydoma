'use client'

import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { AddToCart } from "@/app/(frontend)/products/add-to-cart-prop";
import { AddToFavorite } from "@/app/(frontend)/products/add-to-favorite-prop";
import Link from "next/link";
import { useState } from "react";

interface ProductUnited {
    product: {
      averageRating: number;
      reviewCount: number;
      id: string;
      categoryId: string | null;
      priceRegional: number | null;
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
      attributes: {
        id: string;
        name: string;
        createdAt: Date | null;
        value: string;
        slug: string;
        order: number | null;
        productId: string;
    }[];
  }
  }


  export default function ProductCardNew({product}: ProductUnited) {
    const [maxVisible, setMaxVisible] = useState(3);
    const sortedImages = product.images.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.order === null && b.order !== null) return 1;
      if (a.order !== null && b.order === null) return -1;
      if (a.order !== null && b.order !== null) return a.order - b.order;
      return 0;
    }); 
    const visibleAttributes = product.attributes.slice(0, maxVisible) || [];
    return (
        <div 
        
        className="flex flex-row w-full  gap-[12px] py-[18px] bg-white"
        key={product.id}>
      <Link href={`/product/${product.slug}`} className="flex flex-col gap-2 items-between justify-between pb-3">
<div className="relative w-[100px] overflow-hidden flex items-center h-[100px] py-3">
<Image 
  src={sortedImages[0]?.imageUrl || "/images/placeholder.png"} 
  alt="product" 
  className="object-cover" 
  width={100} 
  height={100}
/>
</div>
{product.reviewCount > 0 ? (<div className="flex text-black justify-center items-center flex-col">
<div className="flex flex-row gap-1 items-center pr-2">
<Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
<p className="font-semibold text-[14px] ">
  {product.averageRating.toFixed(1)}
</p>
</div>
<p className="text-gray-600 text-[14px] ">{product.reviewCount} отзывов</p>
</div>) : (
  <div className="flex text-black justify-center items-center flex-col">
  <div className="flex flex-row gap-1 items-center ">
  <Star className="w-4 h-4 text-gray-400 fill-gray-400"/>

  </div>
  <p className="text-gray-600 text-[14px] ">Нет отзывов</p>
  </div>
)}
</Link>
<div className="flex flex-col">
{product.inStock === 'В наличии' ? (
  <h3 className="text-gray-900 font-semibold text-[16px]">{product.priceRegional ? product.priceRegional.toFixed(2) : "Цена не установлена"} руб</h3>
) : product.inStock === 'Наличие уточняйте' ? (
  <h3 className="text-gray-900 font-semibold text-[16px]">Наличие уточняйте</h3>
) : (
  <h3 className="text-gray-900 font-semibold text-[16px]">Нет в наличии</h3>
)}
<Link href={`/product/${product.slug}`} className="text-[14px] line-clamp-1 text-black mb-1">
{product.title} 
</Link>
<ul className="text-[12px]  md:min-h-[54px]">

  {visibleAttributes.map((attr: { id: string; name: string; value: string; order: number | null; slug: string; createdAt: Date | null; }) => ( 
    <li key={attr.id} className="flex flex-row items-center">
<span className="text-gray-600 pr-1">
      {attr.name}:
  </span>
  <span className="text-black">
      {attr.value}
  </span>
    </li>
  ))}


</ul>
<div className="flex py-2"><div className={`${product.inStock === 'В наличии' ? 'bg-green-600/20' :  product.inStock === 'Наличие уточняйте' ? 'bg-yellow-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${product.inStock === 'В наличии' ? 'text-green-600' : product.inStock === 'Наличие уточняйте' ? 'text-yellow-600' : 'text-red-600'}`}>{product.inStock}</p>
    </div>
    </div>
<div className='flex flex-row gap-3 '>
 <div className="w-[120px] "><AddToCart  id={product.id}/> </div>
           <AddToFavorite id={product.id} />
          </div>
</div>
  </div>
      );
  }