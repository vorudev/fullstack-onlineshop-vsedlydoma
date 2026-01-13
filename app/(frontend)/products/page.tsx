'use server'
import ProductList from "./sort";
import { getCategoryBySlug } from "@/lib/actions/product-categories";
import FilterSidebar from "./filtersidebar";
import { categoryMeta } from "@/lib/actions/categories";
import { buildCategoryUrl } from "@/lib/actions/categories";
import { getFilteredProducts } from '@/lib/actions/product-categories';
import { getFilterCategoriesWithFiltersByProductCategory } from '@/lib/actions/filter-categories';
import { getCategoryWithNavigation } from "@/lib/actions/categories";
import { getProductImages } from '@/lib/actions/image-actions';
import { Suspense } from 'react';
import { notFound } from "next/navigation";
import Pagination from "@/components/frontend/pagination-client";
import Link from "next/link";
import { Metadata } from "next";
interface PageProps {
  searchParams: Promise<{
    category: string;
    chain: string;
    priceFrom: string;
    priceTo: string;
    limit?: string;
    page?: string;

    [key: string]: string | string[] | undefined;
  }>;
}
export async function generateMetadata({ searchParams  }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams; 
    const selectedFilters: Record<string, string[]> = {};
  const categorySlug = resolvedSearchParams.category as string | undefined;
   if (categorySlug) {
    Object.keys(resolvedSearchParams).forEach(key => {
    const value = resolvedSearchParams[key];
    
    // Пропускаем category и chain
    if (value && key !== 'category' && key !== 'chain' && key !== 'priceFrom' && key !== 'priceTo' && key !== 'page' && key !== 'limit') { 
      selectedFilters[key] = Array.isArray(value) ? value : value.split(',');
    }
  });
  }
  const data = await categoryMeta(categorySlug || '');
  if (!data) {
    notFound();
  }
  
  const canonicalUrl = `https://fullstack-onlineshop-vsedlydoma.vercel.app/products/${categorySlug}`;
  return {
    title: data.name, // или productDetails.title
    description: `${data.name} — ${ 'Купить в Минске по выгодной цене'}`,
    keywords: `${data.name || ''}, сантехника, товары для дома минск`,
    alternates: {
      canonical: canonicalUrl, // ← Вот это нужно добавить
    },
    openGraph: {
      type: 'website', 
      url: canonicalUrl, // Тоже хорошо для соцсетей
      title: data.name,
      description: data.name || "",
      siteName: 'Магазин Всё для дома',
      locale: 'ru_RU',

    },
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
}

// Быстрая часть - заголовок и breadcrumbs
async function ProductsHeader({ categorySlug }: { categorySlug: string }) {
  const data = await getCategoryWithNavigation(categorySlug);
  
  if (!data) notFound();
  
  const { category, breadcrumbs } = data;

  return (
    <>
      <nav className="text-sm lg:px-[16px]  px-[8px]  text-gray-600 pt-[20px]">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.id}>
            <Link href={buildCategoryUrl(crumb.slug, breadcrumbs.slice(0, index + 1))}>
              {crumb.name}
            </Link>
            {index < breadcrumbs.length - 1 && ' / '}
          </span>
        ))}
      </nav>
      <h1 className="text-2xl lg:px-[16px]  px-[8px] pb-5 font-bold">{category.name}</h1>
    </>
  );
}

// Медленная часть - продукты и фильтры
async function ProductsGrid({ 
  categoryId,
  selectedFilters,
  page,
  limit,
  priceFrom,
  priceTo,
  categorySlug
}: {
  categoryId: string;
  selectedFilters: Record<string, string[]>;
  page: number;
  limit: number;
  priceFrom?: number;
  priceTo?: number;
  categorySlug: string;
}) {
  const [
    { productsWithDetails, pagination, availableManufacturers, images, attributes }, 
    filterCategoriesWithFilters,
  ] = await Promise.all([
    getFilteredProducts(categoryId, selectedFilters, page, limit, priceFrom, priceTo),
    getFilterCategoriesWithFiltersByProductCategory(categoryId),
  ]);

  const products = productsWithDetails?.map(product => ({
    ...product,
    images: images?.filter(img => img.productId === product.id) || [],
    attributes: attributes?.filter(attr => attr.productId === product.id) || []
  }));

  return (
    <>
      <p className="text-gray-600 lg:px-[16px] px-[8px] hidden lg:flex">{pagination.total} товаров</p>
      <FilterSidebar 
        categoryId={categoryId}
        filterCategories={filterCategoriesWithFilters} 
        categorySlug={categorySlug}
        avaliableManufacturers={availableManufacturers}
        productsWithDetails={products}
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={limit}
      />
    </>
  );
}

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

// Общий 
export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedSearchParams.category as string | undefined;
  
  if (!categorySlug) {
    notFound();
  }

  // Парсим параметры
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 20;
  const priceFrom = Number(resolvedSearchParams.priceFrom) || undefined;
  const priceTo = Number(resolvedSearchParams.priceTo) || undefined;

  const selectedFilters: Record<string, string[]> = {};
  Object.keys(resolvedSearchParams).forEach(key => {
    const value = resolvedSearchParams[key];
    if (
      value && 
      !['category', 'chain', 'priceFrom', 'priceTo', 'page', 'limit'].includes(key)
    ) { 
      selectedFilters[key] = Array.isArray(value) ? value : value.split(',');
    }
  });

  const data = await getCategoryWithNavigation(categorySlug);
  if (!data) notFound();

  return (
    <main className="bg-white">
    <div className="flex flex-col gap-2  text-black xl:max-w-[1400px] lg:max-w-[1000px] mx-auto">
      <Suspense fallback={
        <div className="flex flex-col px-[16px] gap-2">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      }>
        <ProductsHeader categorySlug={categorySlug} />
      </Suspense>

      <Suspense fallback={<SearchPageSkeleton />}>
        <ProductsGrid 
          categoryId={data.category.id}
          selectedFilters={selectedFilters}
          page={page}
          limit={limit}
          priceFrom={priceFrom}
          priceTo={priceTo}
          categorySlug={categorySlug}
        />
      </Suspense>
    </div>
    </main>
  );
}