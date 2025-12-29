
'use client'
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCardFull from '@/components/frontend/product-card-home';
import { ProductImage } from '@/db/schema'
import { Product } from '@/db/schema';
import { Review } from '@/db/schema';
type SortOption = 'default' | 'price-asc' | 'price-desc';
import ProductCardSkeleton from '@/components/frontend/skeletons/product-card-full-skeleton'; 



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
    <div className="w-full">
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Товаров в этой категории пока нет, но мы работаем над этим</p>
      </div>
    </div>
  );
 }
 else {
  return (
    <div className="w-full">
      {/* Список продуктов */}
    {products && products.length > 5 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 " 
      style={{
   // gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  }}>

         {products?.map((product) => (
          <ProductCardFull
            key={product.id}
            product={product}
        
          />
        ))}
      </div>
    
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 " 
      >

         {products?.map((product) => (
          <ProductCardFull
            key={product.id}
            product={product}
        
          />
        ))}
      </div>
    )}
    </div>
  );
}
}
