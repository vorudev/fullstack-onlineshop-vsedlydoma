
import { getAllCancelledOrders } from "@/lib/actions/orders";
import ExportToExcel from "@/components/exceljs-download";
import { getProducts } from "@/lib/actions/product";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/pagination";
import OrdersTable from "@/components/orders-table-archive";

interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;

  }>;

}
export default async function OrderPage( { searchParams }: PageProps) {
    const { page, search} = await searchParams;
      const currentPage = Number(page) || 1;
  const searchQuery = search || '';
    const { orders, pagination} = await getAllCancelledOrders(
 { 
  page: currentPage,
  pageSize: 21,
  search: searchQuery
 }
    );


    return (
         <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Отмененные заказы</h1>
      


      {/* Панель фильтров */}
      <div className="flex gap-4 my-4 items-center">
        <SearchBar />
      </div>

      {/* Показываем активные фильтры */}
      {(searchQuery ) && (
        <div className="mb-4 text-gray-600">
          {searchQuery && <span>Поиск: "{searchQuery}"</span>}
         
          <span className="ml-2">({pagination.total} найдено)</span>
        </div>
      )}

      <OrdersTable orders={orders}  />   
      
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />
    </div>
    );
}