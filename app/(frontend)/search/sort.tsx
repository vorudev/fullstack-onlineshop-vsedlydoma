
'use client'
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCardNew from '@/components/frontend/product-card-new';
import { ProductImage } from '@/db/schema'
import { Product } from '@/db/schema';
import { Review } from '@/db/schema';
type SortOption = 'default' | 'price-asc' | 'price-desc';
import ProductCardSkeleton from '@/components/frontend/skeletons/product-card-full-skeleton'; 
import ProductCard from '@/components/frontend/product-card-full';



interface ProductUnited {
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
    attributes: {
      id: string;
      name: string;
      createdAt: Date | null;
      value: string;
      slug: string;
      order: number | null;
      productId: string;
  }[];
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
}

export default function ProductList({products}: {products: ProductUnited[]}) {

  // Сортируем продукты на основе выбранной опции
 if (products && products.length === 0) {
  return (
    <div className="w-full pt-5">
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Товары не найдены</p>
      </div>
    </div>
  );
 }
 else {
  return (
    <div className="w-full">
      {/* Список продуктов */}
    {products && products.length > 5 ? (
    <div className="grid grid-cols-1 lg:pt-5 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" 
    style={{
// gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
}}>
{products?.map((product, index) => (
  <div 
key={product.id}
className={`
${index !== products.length - 1 ? 'border-b border-gray-300 md:border-b-0' : ''}
         md:border-r md:pl-15 md:border-gray-300 lg:border-0 lg:p-0
${(index + 1) % 2 === 0 ? 'md:border-r-0' : ''}
       `}
>
<div className="lg:hidden"> <ProductCardNew product={product} /> </div>
<div className="lg:block hidden"><ProductCard product={product} /></div>
</div>
      ))}
</div>
    
    ) : (
      <div className="grid grid-cols-1 lg:pt-5 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 " 
      style={{
   // gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  }}>

         {products?.map((product, index) => (
         <div 
         key={product.id}
         className={`
          ${index !== products.length - 1 ? 'border-b border-gray-300 md:border-b-0' : ''}
                   md:border-r md:pl-15 md:border-gray-300 lg:border-0 lg:p-0
          ${(index + 1) % 2 === 0 ? 'md:border-r-0' : ''}
                 `}
       >
        <div className="lg:hidden"> <ProductCardNew product={product} /> </div>
        <div className="lg:block hidden"><ProductCard product={product} /></div>
       </div>
        ))}
      </div>
    )}
    </div>
  );
}
}
