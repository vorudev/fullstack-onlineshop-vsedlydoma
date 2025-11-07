
'use client'
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCardFull from '@/components/frontend/product-card-full';
import { ProductImage } from '@/db/schema'
import { Product } from '@/db/schema';
import { Review } from '@/db/schema';
type SortOption = 'default' | 'price-asc' | 'price-desc';



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


  return (
    <div className="w-full">
      {/* Список продуктов */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {products?.map((product) => (
          <ProductCardFull
            key={product.id}
            product={product}
        
          />
        ))}
      </div>
    </div>
  );
}