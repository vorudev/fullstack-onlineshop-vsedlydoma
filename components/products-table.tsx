'use client';

import { useState } from 'react';
import { MoreHorizontal, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductForm } from './forms/product-form';
import DeleteProductButton from './delete-product-button';
import { Manufacturer } from '@/db/schema';
import { Button } from './ui/button';
import { Product } from '@/db/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import AttributeForm from './forms/attributes-form';
import AttributesTable from './attributes-table';
import { Pencil } from 'lucide-react';
import DeleteUserButton from './delete-product-button';

interface ProductWithImages {
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
export default function ProductsTable({ products, categories, manufacturers }: { products: ProductWithImages[]; categories: any, manufacturers: Manufacturer[] }) {
  return (
    <div className="space-y-4">
      {/* Поле поиска */}
    

      {/* Показать количество результатов */}
 
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Фото</TableHead>
              <TableHead className="w-[120px]">Артикул</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="w-[120px]">Цена</TableHead>
              <TableHead className="w-[120px]">Статус</TableHead>
              <TableHead className="w-[120px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Товары не найдены
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  {/* Image */}
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={product?.images[0]?.imageUrl || "https://via.placeholder.com/150"}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* SKU */}
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>

                  {/* Title */}
                  <TableCell className="font-medium max-w-[300px]">
                  
                      {product.title}
          
                  </TableCell>

                  {/* Price */}
                  <TableCell className="font-semibold">
                    {product.price} руб
                  </TableCell>


                  {/* Status */}
                  <TableCell>
                   {product.inStock ? product.inStock : 'Не указано'}
                  </TableCell>

                  {/* Actions */}
                  
                 <TableCell >
                  <div className="flex flex-row gap-2 items-center">
 <DeleteProductButton productId={product.id} />
 <Link href={`/dashboard/products/${product.id}`} >
 Открыть
 </Link>
 </div>
</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
    </div>
  );
}