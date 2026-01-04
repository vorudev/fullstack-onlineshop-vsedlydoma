import { getAllProducts } from "@/lib/actions/product";
import ProductList from "@/app/(frontend)/search/list";
import { getSearchResults } from "@/lib/actions/search";
import FilterSidebar from "./sidebar";
import Pagination from "@/components/frontend/pagination-client";
import { redirect } from "next/navigation";
interface SearchPageProps {
    searchParams: Promise<{
    search?: string;
    priceFrom: string;
    priceTo: string;
    limit?: string;
    page?: string;

    [key: string]: string | string[] | undefined;}>;
}
export default async function SearchPage({searchParams}: SearchPageProps) {
  const { page, search, limit } = await searchParams;
  const resolvedSearchParams = await searchParams; 
  const pageNumber = Number(resolvedSearchParams.page) || 1;
  const limitNumber = Number(resolvedSearchParams.limit) || 20;
  const selectedFilters: Record<string, string[]> = {};
  Object.keys(resolvedSearchParams).forEach(key => {
    const value = resolvedSearchParams[key];
    
    // Пропускаем category и chain
    if (value && key !== 'category' && key !== 'search' && key !== 'chain' && key !== 'priceFrom' && key !== 'priceTo' && key !== 'page' && key !== 'limit') { 
      selectedFilters[key] = Array.isArray(value) ? value : value.split(',');
    }
  });
  const priceFrom = Number(resolvedSearchParams.priceFrom) || undefined;
  const priceTo = Number(resolvedSearchParams.priceTo) || undefined;

  const currentPage = Number(page) || 1;
  const searchQuery = search || '';
  // const [{ products, pagination }] = await Promise.all([
  //  getAllProducts({
  //    page: currentPage,
  //    pageSize: Number(limit) || 20,
  //   search: searchQuery,
  //  }),
  // ]);

 if (search) { 
  const result = await getSearchResults(search, selectedFilters, priceFrom, priceTo, pageNumber, limitNumber) 

  if ('redirect' in result) {
    // Обработка редиректа
    redirect(result?.redirect || '');
    return; // или другая логика
  }
  const {items, filters, categories, images, availableManufacturers, pagination} = result 

const products = items?.map(product => ({
  ...product,
  images: images?.filter(img => img.productId === product.id) || [],
}));
  return (
      <main className="text-black min-h-screen xl:max-w-[1400px] pt-10 mx-auto lg:max-w-[1000px] pb-40 ">
{/*<ProductList products={products}/> */}
<FilterSidebar 
filterCategories={filters}
totalPages={pagination.totalPages}
total={pagination.total}
limit={limitNumber}
page={pageNumber}
 productsWithDetails={products} 
 avaliableManufacturers={availableManufacturers}
 query={search}/>
 <div className="w-full max-w-[600px] mx-auto">
{/*<Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={pagination.pageSize}
                  /> */}</div> 
      </main>
  );
}
  

  return null
}