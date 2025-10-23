'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type SortOption = 'default' | 'price-asc' | 'price-desc';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
}

export default function ProductList({ products }: { products: Product[] }) {
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Сортируем продукты на основе выбранной опции
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    
    const productsCopy = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return productsCopy.sort((a, b) => b.price - a.price);
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  return (
    <div>
      {/* Select для выбора сортировки */}
      <div className="mb-6">
        <label htmlFor="sort" className="block text-sm font-medium mb-2">
          Сортировать по:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="border rounded px-4 py-2 w-full max-w-xs"
        >
          <option value="default">По умолчанию</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
        </select>
      </div>

      {/* Список продуктов */}
      <div className="grid gap-4">
        {sortedProducts?.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="card p-4 border rounded hover:shadow-lg transition"
          >
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-gray-800 mt-2">{product.price} ₽</p>
          </Link>
        ))}
      </div>
    </div>
  );
}