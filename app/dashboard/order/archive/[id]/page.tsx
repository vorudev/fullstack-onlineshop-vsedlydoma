import { getOrderById } from "@/lib/actions/orders";
import { getAllProducts } from "@/lib/actions/product";
import { UpdateOrderForm } from "@/components/forms/update-order-form";
import AddOrderItemForm from "@/components/forms/add/add-items-to-order-form";
import ExportToExcel from "@/components/exceljs-download";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/searchbar";
import { Package } from "lucide-react";
import { User } from "lucide-react";
import { Users } from "lucide-react";
import { Phone } from "lucide-react";
import { Download, Upload, Mail, DollarSign, FileText } from "lucide-react";

import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderForm from "@/components/forms/order-form";
interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    category?: string;
  }>;

}
export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; search?: string; category?: string }> }) {
  // Ожидаем params перед использованием
  const { id } = await params;
  const { page, search, category } = await searchParams;
    const currentPage = Number(page) || 1;
  const searchQuery = search || '';

  const [{products}, order] = await Promise.all([
    getAllProducts({
      page: currentPage,
      pageSize: 21,
      search: searchQuery,
      category,
    }),
    getOrderById(id),
  ])
  // Получаем продукт по slug

    const getStatusConfig = (status: string | undefined) => {
  switch (status) {
    case 'pending':
      return {
        label: 'В обработке',
        className: 'text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md text-sm font-medium'
      };
    case 'completed':
      return {
        label: 'Завершен',
        className: 'text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-sm font-medium'
      };
    case 'cancelled':
      return {
        label: 'Отменен',
        className: 'text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-sm font-medium'
      };
    default:
      return {
        label: status,
        className: 'text-neutral-400 bg-neutral-400/10 px-2 py-1 rounded-md text-sm font-medium'
      };
  }
};

const statusConfig = getStatusConfig(order?.status);
    return (
<>      
         <div className=" bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="bg-neutral-900 rounded-lg shadow-sm border border-neutral-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-100">Заказ #{order?.id}</h1>
                <p className="text-sm text-neutral-400">{order?.createdAt?.toDateString()}</p>
 <p className={statusConfig.className}>{statusConfig.label}</p>
              </div>
            </div>
            
          </div>

          <div className="flex gap-3">
           
          {order && (
  <ExportToExcel 
    orders={[order]} 
    fileName={`order_${order.id}`} 
    buttonText="Скачать Excel"
  />
)}

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Информация о клиенте */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-lg shadow-sm border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-100 mb-4">Информация о клиенте</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">Имя</p>
                    <p className="text-sm font-medium text-neutral-100">{order?.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-neutral-100">{order?.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">Телефон</p>
                    <p className="text-sm font-medium text-neutral-100">{order?.customerPhone}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Примечания</p>
                      <p className="text-sm text-neutral-300 mt-1">{order?.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Итого */}
            <div className="bg-neutral-900 rounded-lg shadow-sm border border-neutral-800 p-6 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">

                  <span className="text-lg font-semibold text-neutral-100">Итого</span>
                </div>
                <span className="text-2xl font-bold text-neutral-100">
                  {order?.total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Товары в заказе */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 rounded-lg shadow-sm border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-100">Товары в заказе</h2>
                 
              </div>

              <div className="space-y-4">
                {order?.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
            
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-100 mb-1">{item.title}</h3>
                      <p className="text-sm text-neutral-400">ID: {item.productId}</p>
                    </div>

                    <div className="text-center px-4">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Кол-во</p>
                      <p className="text-lg font-semibold text-neutral-100">{item.quantity}</p>
                    </div>

                    <div className="text-right min-w-32">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Цена</p>
                      <p className="text-lg font-semibold text-neutral-100">
                        {item.price.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="text-right min-w-32">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Сумма</p>
                      <p className="text-lg font-bold text-blue-400">
                        {(item.price * item.quantity).toLocaleString('ru-RU', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Подитог */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Подитог</span>
                    <span className="font-medium text-neutral-100">
                      {order?.total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Доставка</span>
                    <span className="font-medium text-neutral-100">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
                    <span className="text-neutral-100">Итого</span>
                    <span className="text-blue-400">
                      {order?.total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
<span className="text-neutral-100">
  {order?.status === 'pending' 
    ? 'В обработке' 
    : order?.status === 'completed'
    ? 'Получен'
    : order?.status === 'cancelled'
    ? 'Отменен'
    : 'Обновлен'}
</span>
                    <span className="text-white">
                      {order?.updatedAt?.toLocaleString('ru-RU',)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</>
    )
};