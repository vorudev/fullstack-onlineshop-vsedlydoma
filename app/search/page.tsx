import { getAllProducts } from "@/lib/actions/product";
import ProductList from "@/app/products/sort";
import Pagination from "@/components/pagination";
interface SearchPageProps {
    searchParams: Promise<{
    page?: string;
    search?: string;}>;
}
export default async function SearchPage({searchParams}: SearchPageProps) {
  const { page, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = search || '';
  const [{ products, pagination }] = await Promise.all([
    getAllProducts({
      page: currentPage,
      pageSize: 21,
      search: searchQuery,
    }),
  ]);
  return (
      <main className="text-black min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] pb-40 ">
<ProductList products={products}/>
<Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                  />
      </main>
  );
}