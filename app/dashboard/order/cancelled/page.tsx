
import { getAllOrders } from "@/lib/actions/orders";
import { getActiveOrders } from "@/lib/actions/orders";
import { UpdateOrderForm } from "@/components/forms/update-order-form";
import AddOrderItemForm from "@/components/forms/add/add-items-to-order-form";
import ExportToExcel from "@/components/exceljs-download";
import { getProducts } from "@/lib/actions/product";
import { OrdersTable } from "@/components/archive-orders-table";
import { get } from "http";

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
export default async function OrderPage({searchParams} : PageProps) {
  const { page, search, limit, sortBy, sortOrder, userType, timeRange} = await searchParams;
  const currentPage = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const searchQuery = search || '';
  const { ordersWithDetails, pagination} = await getAllOrders({ 
  page: currentPage,
  pageSize: limitNumber,
  search: searchQuery,
  status: 'cancelled',
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