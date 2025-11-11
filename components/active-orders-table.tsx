'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Order } from '@/db/schema';
import { useRouter } from 'next/navigation';
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
import { Button } from './ui/button';
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
import { UpdateOrderForm } from './forms/update-order-form';


export function ActiveOrdersTable({ 
    initialOrders, 

}: { 
    initialOrders: Omit<Order, "notes" | "updatedAt" | "status">[],
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
 const filteredOrders = initialOrders.filter((order) => {
   const searchQueryLower = searchQuery.toLowerCase();
   return ( 
     order.customerPhone?.toLowerCase().includes(searchQueryLower) ||
     order.customerEmail?.toLowerCase().includes(searchQueryLower) ||
     order.customerName?.toLowerCase().includes(searchQueryLower)  || 
     order.id?.toString().includes(searchQueryLower)
   );
 });  return (
    <div className="space-y-4 w-full">
  {/* Поле поиска */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
    <Input
      type="text"
      placeholder="Поиск по названию, slug или цене..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10"
    />
  </div>

  {/* Показать количество результатов */}
  {searchQuery && (
    <p className="text-sm text-gray-500">
      Найдено: {filteredOrders.length} из {initialOrders.length}
    </p>
  )}

  {/* Таблица */}
  <div className="">
    <Table>
      <TableCaption>Лист активных заказов</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Имя</TableHead>
          <TableHead>Телефон</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>ID заказа</TableHead>
          <TableHead className="text-right">Сумма</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500">
              Заказы не найдены
            </TableCell>
          </TableRow>
        ) : (
          filteredOrders.map((order) => (
            <TableRow 
              key={order.id}
              className="cursor-pointer "
              onClick={() => router.push(`/dashboard/order/${order.id}`)}
            >
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell>{order.customerPhone}</TableCell>
              <TableCell>{order.createdAt?.toLocaleDateString()}</TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell className="text-right">{order.total} руб</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Открыть
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
</div>
  ); 

}