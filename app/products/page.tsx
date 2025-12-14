'use server'
import ProductList from "./sort";
import { getCategoryBySlug } from "@/lib/actions/product-categories";
import FilterSidebar from "./filtersidebar";

import { buildCategoryUrl } from "@/lib/actions/categories";
import { getFilteredProducts } from '@/lib/actions/product-categories';
import { getFilterCategoriesWithFiltersByProductCategory } from '@/lib/actions/filter-categories';
import { getCategoryWithNavigation } from "@/lib/actions/categories";
import { getProductImages } from '@/lib/actions/image-actions';

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
  const data = await getCategoryWithNavigation(categorySlug || '');
  if (!data) {
    notFound();
  }
  const {category, breadcrumbs} = data;
  
  const canonicalUrl = `https://fullstack-onlineshop-vsedlydoma.vercel.app/products/${categorySlug}`;
  return {
    title: category.name, // или productDetails.title
    description: `${category.description} — ${category.description || 'Купить в Минске по выгодной цене'}`,
    keywords: `${category.name || ''}, сантехника, товары для дома минск`,
    alternates: {
      canonical: canonicalUrl, // ← Вот это нужно добавить
    },
    openGraph: {
      type: 'website', 
      url: canonicalUrl, // Тоже хорошо для соцсетей
      title: category.name,
      description: category.description || "",
      siteName: 'Магазин Всё для дома',
      locale: 'ru_RU',

    },
  };
}
export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams; 
  const categorySlug = resolvedSearchParams.category as string | undefined;
  const selectedFilters: Record<string, string[]> = {};
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 20;
  if (categorySlug) {
    Object.keys(resolvedSearchParams).forEach(key => {
    const value = resolvedSearchParams[key];
    
    // Пропускаем category и chain
    if (value && key !== 'category' && key !== 'chain' && key !== 'priceFrom' && key !== 'priceTo' && key !== 'page' && key !== 'limit') { 
      selectedFilters[key] = Array.isArray(value) ? value : value.split(',');
    }
  });
  }
  const priceFrom = Number(resolvedSearchParams.priceFrom) || undefined;
  const priceTo = Number(resolvedSearchParams.priceTo) || undefined;
  const data = await getCategoryWithNavigation(categorySlug || '');
   if (!data) {
      notFound();
    }
  const {category, breadcrumbs} = data;
const [
  {productsWithDetails, pagination, availableManufacturers, images}, 
  filterCategoriesWithFilters,
  
] = await Promise.all([
  getFilteredProducts(category.id, selectedFilters, page, limit, priceFrom, priceTo),
  getFilterCategoriesWithFiltersByProductCategory(category.id),
])
const productsWithDetailAndImages = productsWithDetails?.map(product => {
  // Находим картинки, которые принадлежат текущему продукту
  const productImages = images?.filter(img => img.productId === product.id) || [];
  
  return {
    ...product,
    images: productImages,
  };
});

    return (
        <div className="flex flex-col px-[16px] gap-2 lg:px-6 text-black xl:max-w-[1400px] lg:max-w-[1000px] mx-auto">
          <nav className=" text-sm text-gray-600 pt-[20px]">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id}>
              <Link
                href={buildCategoryUrl(
                  crumb.slug,
                  breadcrumbs.slice(0, index + 1)
                )}
                className="hover:text-blue-600"
              >
                {crumb.name}
              </Link>
              {index < breadcrumbs.length - 1 && ' / '}
            </span>
          ))}
        </nav>
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <p className="text-gray-600">{pagination.total} товаров</p>
           
            
            <FilterSidebar 
            filterCategories={filterCategoriesWithFilters} 
            categorySlug={categorySlug} 
            avaliableManufacturers={availableManufacturers}
            productsWithDetails={productsWithDetailAndImages}
            page={page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            />
           
        </div>
    );
}
