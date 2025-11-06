
'use client'
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCardFull from '@/components/frontend/product-card-full';
import { ProductImage } from '@/db/schema'
import { Product } from '@/db/schema';

type SortOption = 'default' | 'price-asc' | 'price-desc';



interface ProductWithImages {
  product: Product;
  images: ProductImage[];
}

export default function ProductList({products}: {products: ProductWithImages[]}) {


  // Сортируем продукты на основе выбранной опции


  return (
    <div className="w-full">
      {/* Список продуктов */}
      <div className="grid gap-4">
        {products?.map((product) => (
          <ProductCardFull
            key={product.product.id}
            product={product.product}
            images={product.images}
          />
        ))}
      </div>
    </div>
  );
}