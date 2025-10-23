'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
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
import { AttributeCategoryForm } from './forms/attributes-categories-form';
import AttributesTable from './attributes-table';
import { Pencil } from 'lucide-react';
import DeleteUserButton from './delete-product-button';

export default function ProductsTable({ products, categories, manufacturers }: { products: Product[]; categories: any, manufacturers: Manufacturer[] }) {
  return (
    <div className="space-y-4">
      {/* Поле поиска */}
    

      {/* Показать количество результатов */}
 
      <Table>
        <TableCaption>A list of your products</TableCaption>
    
        <TableBody className="" >
         
        
            {products.map((product) => (
              
              <TableRow className="flex items-center justify-center" key={product.id} >
                <Link  href={`/dashboard/products/${product.slug}`} className='border-r w-full '>
                <TableCell className="font-medium" >{product.title}</TableCell>
                </Link>
                <TableCell className="inline border-r ">{product.price} руб</TableCell> 

               
                <TableCell className="text-right">{product.slug}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost">
                        <Pencil className="size-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Product</DialogTitle>
                        <ProductForm product={product} categories={categories}  manufacturers={manufacturers}/>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  

                  

                  <DeleteUserButton productId={product.id} />
                </TableCell>
              </TableRow>

            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}