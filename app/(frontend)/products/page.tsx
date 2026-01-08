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

function ProductsGridSkeleton() {
  return (
    <>
      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex gap-4 px-[16px]">
        <div className="w-64 hidden lg:block space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </>
  );
}

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

      <Suspense fallback={<ProductsGridSkeleton />}>
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