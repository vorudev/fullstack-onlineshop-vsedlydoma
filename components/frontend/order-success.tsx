import React from 'react';
import { CheckCircle, Package, Mail, Phone, Calendar, FileText, Home } from 'lucide-react';
import Link from 'next/link';

interface OrderSuccessProps {
  order: {
    id: string;
    createdAt: Date | null;
    status: string;
    notes: string | null;
    total: number;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    orderItems: {
      id: string;
      title: string;
      price: number;
      quantity: number;
      productSku: string | null;
      product: {
        title: string;
        sku: string | null;
      } | null;
    }[];
  } | undefined;
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Заказ не найден</h2>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Заказ успешно оформлен!
          </h1>
          <p className="text-slate-600 text-lg mb-4">
            Спасибо за ваш заказ. Мы отправили подтверждение на вашу почту.
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-100 px-6 py-3 rounded-full">
            <span className="text-slate-600 font-medium">Номер заказа:</span>
            <span className="font-bold text-slate-800">#{order.id.slice(0, 8)}</span>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Информация о заказе
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600 mt-1" />
              <div>
                <p className="text-sm text-slate-600 mb-1">Дата создания</p>
                <p className="font-semibold text-slate-800">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Package className="w-5 h-5 text-slate-600 mt-1" />
              <div>
                <p className="text-sm text-slate-600 mb-1">Статус</p>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {order.customerName && (
            <div className="border-t border-slate-200 pt-6 mb-6">
              <h3 className="font-semibold text-slate-800 mb-4">Контактная информация</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {order.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{order.customerName}</p>
                  </div>
                </div>
                
                {order.customerEmail && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-5 h-5" />
                    <span>{order.customerEmail}</span>
                  </div>
                )}
                
                {order.customerPhone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {order.notes && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-800 mb-2">Примечания</h3>
              <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Состав заказа
          </h2>
          
          <div className="space-y-4 mb-6">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {item.product?.title || item.title}
                  </h3>
                  {item.productSku && (
                    <p className="text-sm text-slate-500">Артикул: {item.productSku}</p>
                  )}
                  <p className="text-sm text-slate-600 mt-1">
                    {formatPrice(item.price)} × {item.quantity} шт.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-lg">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t-2 border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-slate-800">Итого:</span>
              <span className="text-2xl font-bold text-slate-800">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-8 py-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
             На главную
          </Link>
          
        </div>
      </div>
    </div>
  );
}