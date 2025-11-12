'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronDown, ChevronUp, Mail, Package, Phone, User } from 'lucide-react';
import Pagination from '@/components/frontend/pagination-orders';
import { useRouter, useSearchParams, usePathname } from "next/navigation";
interface Order {
     orders: {
        orderItems: {
        id: string;
        orderId: string | null;
        productId: string | null;
        productSku: string | null;
        price: number;
        title: string;
        quantity: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    id: string;
    userId: string | null;
    status: string;
    notes: string | null;
    total: number;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}[]
pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
}


export default function OrderHistoryTable({ orders, pagination }: Order) {
 const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
 const router = useRouter();
 const searchParams = useSearchParams();
 const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
 const pathname = usePathname();
 

 const handleStatusChange = (status: string) => {
  setSelectedStatus(status);
  const newSearchParams = new URLSearchParams();
  newSearchParams.set('status', status);
  router.push(`${pathname}?${newSearchParams.toString()}`);
};

  const getValueFromSearchParams = (key: string) => {
    const value = searchParams.get(key);
    return value ? value : null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const toggleExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const customerInfo = orders[0] || {};

  return (
    <div className=" pb-4 text-white bg-white rounded-xl ">
      <div className="">
        {/* Информация о клиенте */}
        <div className="px-4 py-4">
          
        
            <div className="flex items-center gap-3 text-gray-400">
              <Package className="w-5 h-5 text-gray-400 " />
              <span className="text-[16px] ">Заказов: {totalOrders}</span>
            </div>
        </div>

        {/* Таблица заказов */}
        <div className="overflow-hidden">
   <div className="flex items-center gap-3 px-4 py-4">
     <select
     id="status"
     value={getValueFromSearchParams('status') || ''}
     onChange={(e) => handleStatusChange(e.target.value)}
     className="py-2 outline-none text-black px-0 m-0 flex border-none ring-none"
     >
       <option value="">Все статусы</option>
       <option value="pending">Ожидание</option>
       <option value="completed">Получен</option>
       <option value="cancelled">Отменено</option>
     </select>
   </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заказ от:
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-4 hidden lg:table-cell py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Товары
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Номер заказа
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-black divide-y ">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className=" transition-colors">
                     
                     
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm ">
                          <Calendar className="w-4 h-4" />
                          <span>{order.createdAt?.toLocaleDateString('ru-RU')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold ">
                          {formatPrice(order.total)}
                        </div>
                      </td>
                      <td className="px-4 hidden lg:table-cell py-4 whitespace-nowrap">
                        <div className="text-sm ">
                          {order.orderItems.length} {order.orderItems.length === 1 ? 'товар' : 'товара'}
                        </div>
                      </td>
                     
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {expandedOrder === order.id && (
                      <tr className="">
                        <td colSpan={6} className=" px-2 py-4 bg-white">
                          <div className="space-y-3 border-l border-gray-300 pl-4 pr-2">
                            <h4 className="font-semibold mb-3">Состав заказа:</h4>
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center  rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium ">{item.title}</div>
                                  <div className="text-sm ">Артикул: {item.productSku}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm ">
                                    {item.quantity} шт × {formatPrice(item.price)}
                                  </div>
                                  <div className="font-semibold text-[16px] ">
                                    {formatPrice(item.quantity * item.price)}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex justify-between items-center pt-3 border-t">
                             
                              <span className="text-lg font-bold text-[16px]">
                                Итого: {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">У вас пока нет заказов</p>
            </div>
          )}
        </div>


        <Pagination totalPages={pagination.totalPages} total={pagination.total} currentPage={pagination.page} />
      </div>
    </div>
  );
}