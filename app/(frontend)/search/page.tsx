import { getAllProducts } from "@/lib/actions/product";
import { getSearchResults } from "@/lib/actions/search";
import FilterSidebar from "./sidebar";
import Pagination from "@/components/frontend/pagination-client";
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
interface SearchPageProps {
    searchParams: Promise<{
    search?: string;
    priceFrom: string;
    priceTo: string;
    limit?: string;
    page?: string;

    [key: string]: string | string[] | undefined;}>;
}


// Скелетон для карточки продукта
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg lg:border border-gray-200 lg:p-4 py-[18px] animate-pulse">
      {/* Изображение */}
   <div className="flex flex-row gap-[18px] lg:gap-0 lg:flex-col">
    <div className="lg:w-full flex-col gap-5 h-full items-between justify-center px-1 lg:px-2 flex"> 
      <div className="self-center lg:w-[156px] h-[100px] w-[100px] lg:h-[156px] bg-gray-200 rounded-lg lg:mb-3"></div>
      <div className="h-10 lg:hidden bg-gray-200 rounded w-full mb-2"></div>
       </div>
   

     <div>{/* Название */}
      <div className="h-[24px] bg-gray-200 rounded w-2/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full lg:mb-3 mb-2"></div>
      
      {/* Характеристики */}
      <div className="space-y-2 lg:mb-3 mb-2 ">
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      
      </div>
      
      {/* Статус и цена */}
      <div className="flex items-center w-36 justify-between lg:mb-3 mb-2">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 hidden lg:block bg-gray-200 rounded w-16"></div>
      </div>
      
      {/* Кнопка */}
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
    </div>
    </div>
  );
}

// Скелетон для сайдбара с фильтрами (десктоп)
function FilterSidebarSkeleton() {
  return (
    <div className="w-full lg:w-64 space-y-4 animate-pulse">
      {/* Заголовок */}
      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
      
      {/* Фильтры сортировки */}
      <div className="space-y-3 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        ))}
      </div>
      
      {/* Секция "Цена" */}
      <div className="border-t pt-4">
        <div className="h-5 bg-gray-200 rounded w-16 mb-3"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
      
      {/* Другие секции фильтров */}
      {[1, 2, 3, 4,  5, 6, 7].map((section) => (
        <div key={section} className="border-t flex flex-row justify-between pt-4">
          <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-5 mb-3"></div>
        </div>
      ))}
    </div>
  );
}

// Скелетон для мобильной версии
function MobileFilterHeaderSkeleton() {
  return (
    <div className="lg:hidden mb-4 space-y-3 animate-pulse">
      {/* Кнопка сортировки */}
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      
      {/* Активные фильтры */}
      <div className="flex gap-2 overflow-x-auto">
      </div>
    </div>
  );
}

// Общий скелетон страницы
function SearchPageSkeleton() {
  return (
    <main className="text-black bg-white min-h-screen pb-40">
      <div className="xl:max-w-[1400px] pt-4 mx-auto lg:max-w-[1000px] lg:px-4 px-2">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Десктоп сайдбар */}
          <aside className="hidden pt-[16px] lg:block">
            <FilterSidebarSkeleton />
          </aside>
          
          <div className="flex-1">
            {/* Мобильный хедер с фильтрами */}
            <MobileFilterHeaderSkeleton />
            
            {/* Сетка продуктов */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-4 gap-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
            
            {/* Пагинация */}
            <div className="mt-8 flex justify-center gap-2 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Общий скелетон страницы

// Компонент с данными (выносим логику загрузки)
async function SearchResults({ searchParams }: any) {
  const resolvedSearchParams = await searchParams;
  const pageNumber = Number(resolvedSearchParams.page) || 1;
  const limitNumber = Number(resolvedSearchParams.limit) || 20;
  const search = resolvedSearchParams.search;
  
  const selectedFilters: Record<string, string[]> = {};
  Object.keys(resolvedSearchParams).forEach(key => {
    const value = resolvedSearchParams[key];
    if (value && key !== 'category' && key !== 'search' && key !== 'chain' && 
        key !== 'priceFrom' && key !== 'priceTo' && key !== 'page' && key !== 'limit') {
      selectedFilters[key] = Array.isArray(value) ? value : value.split(',');
    }
  });
  
  const priceFrom = Number(resolvedSearchParams.priceFrom) || undefined;
  const priceTo = Number(resolvedSearchParams.priceTo) || undefined;
  
  if (!search) return null;
  
  const result = await getSearchResults(
    search, 
    selectedFilters, 
    priceFrom, 
    priceTo, 
    pageNumber, 
    limitNumber
  );
  
  if ('redirect' in result) {
    redirect(result?.redirect || '');
  }
  
  const { items, filters, categories, images, attributes, availableManufacturers, pagination } = result;
  
  const products = items?.map(product => ({
    ...product,
    images: images?.filter(img => img.productId === product.id) || [],
    attributes: attributes?.filter(attr => attr.productId === product.id) || []
  }));
  console.log(items)
  console.log(categories)
  const itemCategoryIds = new Set(
    items?.map(item => item.categoryId)
  );

  const extraCategories = categories?.filter(
    categoryId => !itemCategoryIds.has(categoryId)
  );
  
  console.log('Categories without items:', extraCategories);
  
  return (
    <FilterSidebar 
      filterCategories={filters}
      categories={categories}
      totalPages={pagination.totalPages}
      total={pagination.total}
      limit={limitNumber}
      page={pageNumber}
      productsWithDetails={products} 
      avaliableManufacturers={availableManufacturers}
      query={search}
    />
  );
}

// Основной компонент страницы
export default async function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <main className="text-black bg-white min-h-screen pb-40">
      <div className="xl:max-w-[1400px] pt-4 mx-auto lg:max-w-[1000px]">
        <Suspense fallback={<SearchPageSkeleton />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}