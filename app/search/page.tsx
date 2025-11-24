import { getAllProducts } from "@/lib/actions/product";
import ProductList from "@/app/products/sort";
import Pagination from "@/components/frontend/pagination-client";
interface SearchPageProps {
    searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;}>;
}
export default async function SearchPage({searchParams}: SearchPageProps) {
  const { page, search, limit } = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = search || '';
  const [{ products, pagination }] = await Promise.all([
    getAllProducts({
      page: currentPage,
      pageSize: Number(limit) || 20,
      search: searchQuery,
    }),
  ]);
  return (
      <main className="text-black min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] pb-40 ">
<ProductList products={products}/>
 <div className="w-full max-w-[600px] mx-auto">
<Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={pagination.pageSize}
                  /></div>
      </main>
  );
}