'use client';
import React from 'react';
import { Download } from 'lucide-react';
import ExcelJS from 'exceljs';

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    slug: string;
    description: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    categoryId: string | null;
    manufacturerId: string | null;
  } | null;
  quantity: number;
  price: number;
  title: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  productId: string | null;
  orderId: string | null;
}

interface Order {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string | null;
  status: string;
  sku: string | null;
  notes: string | null;
  total: number; // Было totalPrice
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  orderItems: OrderItem[] | null;
}

interface ExportOrdersToExcelProps {
  orders: Order[] | undefined;
  fileName?: string;
  sheetName?: string;
  buttonText?: string;
  className?: string;
}

const ExportToExcel: React.FC<ExportOrdersToExcelProps> = ({
  orders,
  fileName = 'orders_export',
  sheetName = 'Заказы',
  buttonText = 'Скачать Excel',
  className = '',
}) => {
  const handleExport = async () => {
    if (!orders || orders.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);

      // Заголовки
      worksheet.columns = [
        { header: 'Счет-справка', key: 'invoice', width: 40 },
        { header: 'Цена', key: 'price', width: 15 },
        { header: 'Кол-во', key: 'quantity', width: 12 },
      ];

      // Стилизуем заголовки
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12, color: { argb: '00000000' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' },
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Добавляем данные
      const today = new Date().toLocaleDateString('ru-RU');
      
      orders.forEach((order) => {
        // Добавляем заголовок заказа с датой
        worksheet.addRow({
          invoice: `Счет-справка от ${today} (Номер заказа: ${order.sku || 'N/A'})`,
          price: '',
          quantity: '',
        });

        // Добавляем товары из заказа
        order.orderItems?.forEach((item) => {
          worksheet.addRow({
            invoice: item.product?.title || item.title || 'Без названия',
            price: item.price,
            quantity: item.quantity,
          });
        });

        // Добавляем итого
        const total = order.orderItems?.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const totalRow = worksheet.addRow({
          invoice: 'ИТОГО:',
          price: total,
          quantity: order.orderItems?.reduce((sum, item) => sum + item.quantity, 0),
        });
        totalRow.font = { bold: true };
        
        // Пустая строка между заказами
        worksheet.addRow({});
      });

      // Форматируем цены как валюту
      worksheet.getColumn('price').numFmt = '#,##0.00 руб';

      // Генерируем буфер
      const buffer = await workbook.xlsx.writeBuffer();

      // Создаём blob и скачиваем
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Произошла ошибка при экспорте файла');
    }
  };

  return (
     <button
      onClick={handleExport}
      className={className || 'px-4 py-1 inline-flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'}
    >     <Download className="w-4 h-4" />    
      {buttonText}
    </button>
  );
};

export default ExportToExcel;