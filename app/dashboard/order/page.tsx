
import { getAllOrders } from "@/lib/actions/orders";
import { getActiveOrders } from "@/lib/actions/orders";
import { UpdateOrderForm } from "@/components/forms/update-order-form";
import AddOrderItemForm from "@/components/forms/add/add-items-to-order-form";
import ExportToExcel from "@/components/exceljs-download";
import { getProducts } from "@/lib/actions/product";
import { OrdersTable } from "@/components/active-orders-table";
import { get } from "http";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    limit: number;
    sortBy?: | "createdAt" | "total";
    sortOrder?: "asc" | "desc";
    userType?: 'all' | 'guests' | 'registered';
    timeRange?: 'all' | 'today' | 'week' | 'month' | 'year';
  }>;
}
export const metadata: Metadata = {
  title: "Актуальные заказы",
  description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
  keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
  robots: { 
    index: true,
    follow: true, 
    nocache: false,
    googleBot: { 
        index: true, 
        follow: true, 
        "max-snippet": -1, 
        "max-image-preview": "large",
        "max-video-preview": "large"
    }
}
};
export default async function OrderPage({searchParams} : PageProps) {
  const { page, search, limit, sortBy, sortOrder, userType, timeRange} = await searchParams;
  const currentPage = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const searchQuery = search || '';
  const { ordersWithDetails, pagination} = await getAllOrders({ 
  page: currentPage,
  pageSize: limitNumber,
  search: searchQuery,
  status: 'pending',
  sortBy: sortBy,
  sortOrder: sortOrder,
  userType: userType, 
  timeRange: timeRange
 })
    return (
        <OrdersTable 
        currentPage={pagination.page} 
        totalPages={pagination.totalPages}  
        totalRevenue={pagination.totalRevenue} 
        total={pagination.totalOrders}
        totalUsers={pagination.totalUsers} 
        orders={ordersWithDetails}  
        limit={limitNumber}
        guestOrders={pagination.guestOrders}
        userType={userType}
        timeRange={timeRange}
        />
       
    );
}