'use server'
import ProfilePage from "./client"
import {getUserOrders} from "@/lib/actions/orders"

interface PageProps {
    searchParams: Promise<{ // Добавляем Promise
        page?: string;
        search?: string;
        status?: string;
      }>;
}
export default async function Profile({searchParams}: PageProps) {
     const { page, search, status} = await searchParams;
   const currentPage = Number(page) || 1;
  const searchQuery = search || '';
    const {orders, pagination} = await getUserOrders(
        {
            page: currentPage,
            pageSize: 10,
            search: searchQuery,
            status: status,
        }
    );
    return <ProfilePage orders={orders} pagination={pagination} />
}