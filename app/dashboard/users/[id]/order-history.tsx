'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronDown, ChevronUp, Mail, Package, Phone, User } from 'lucide-react';

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
    userInfo: {
        id: string;
        name: string;
        role: "admin" | "user";
        email: string;
        emailVerified: boolean;
        phoneNumber: string | null;
        phoneNumberVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        twoFactorEnabled: boolean;
        banned: boolean;
    };
    id: string;
    userId: string | null;
    sku: string | null;
    status: string;
    notes: string | null;
    total: number;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    
}[]
user: {
    id: string;
    name: string;
    role: "admin" | "user";
    email: string;
    emailVerified: boolean;
    phoneNumber: string | null;
    phoneNumberVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    twoFactorEnabled: boolean;
    banned: boolean;
}
    }

    


export default function AdminOrdersTable({ orders, user }: Order) {
 const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  



  
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
    <div className="min-h-screen text-white  bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Информация о клиенте */}
        <div className="bg-neutral-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold ">{user.name || 'Клиент'}</h2>
              <p className="text-sm text-gray-500">ID: {user.id || '—'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 ">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{user.email|| '-'}</span>
            </div>
            <div className="flex items-center gap-3 ">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{user.phoneNumber || '—'}</span>
            </div>
            <div className="flex items-center gap-3 ">
              <Package className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold">Заказов: {totalOrders}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">

              <span className="text-lg font-bold ">
                Общая сумма: {totalRevenue.toFixed(2)} руб
              </span>
            </div>
          </div>
        </div>

        {/* Таблица заказов */}
        <div className="rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold ">История заказов</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заказ
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Товары
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-neutral-900 divide-y ">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className=" transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium ">{order.sku}</div>
                        {order.notes && (
                          <div className="text-xs mt-1">📝 {order.notes}</div>
                        )}
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm ">
                          <Calendar className="w-4 h-4" />
                          <span>{order.createdAt?.toLocaleDateString('ru-RU')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold ">
                          {order.total.toFixed(2)} руб
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm ">
                          {order.orderItems.length} {order.orderItems.length === 1 ? 'товар' : 'товара'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/dashboard/order/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        >Перейти к заказу</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
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
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-neutral-900">
                          <div className="space-y-3">
                            
                            
                            <h4 className="font-semibold mb-3">Состав заказа:</h4>
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-3 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium ">{item.title}</div>
                                  <div className="text-sm ">Артикул: {item.productSku}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm ">
                                    {item.quantity} шт × {item.price.toFixed(2)} руб
                                  </div>
                                  <div className="font-semibold ">
                                    {item.quantity * item.price} руб
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex justify-between items-center pt-3 border-t">
                              <span className="text-sm text-gray-500">обновлено: {order.updatedAt?.toLocaleString()}                              </span>
                              <span className="text-lg font-bold ">
                                Итого: {order.total.toFixed(2)} руб
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
              <p className="text-gray-500">У клиента пока нет заказов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}