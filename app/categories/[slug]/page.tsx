

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import CategorySkeleton from '@/components/frontend/skeletons/category-skeleton';
import { getCategoryWithNavigation, buildCategoryUrl } from '@/lib/actions/categories';
import { getFeaturedCategoryImage } from '@/lib/actions/image-actions';
import Header from '@/components/frontend/header';
import Image from 'next/image';
import { Suspense } from 'react';
import Subcat from './subcat';
import { Metadata } from 'next';
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params  }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryWithNavigation(slug);
  
  if (!data) {
    notFound();
  }

  const { category, breadcrumbs, subcategories} = data;
  if (subcategories.length === 0) {
    redirect(`/products?category=${category.slug}`);
  }

  
  const canonicalUrl = `https://fullstack-onlineshop-vsedlydoma.vercel.app/categories/${category.slug}`;
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

export default async function CategoryPage({ params }: PageProps) {
  // Шаг 1: Получаем параметры
  const { slug } = await params;
  


  // Шаг 2: Получаем категорию (нужна для следующих запросов)
  const data = await getCategoryWithNavigation(slug);
  
  if (!data) {
    notFound();
  }

  const { category, breadcrumbs, subcategories} = data;
  if (subcategories.length === 0) {
    redirect(`/products?category=${category.slug}`);
  }



  return ( <>

    <div className=" xl:max-w-[1400px] lg:max-w-[1000px] flex text-black lg:mx-auto py-2 px-[16px] min-h-screen   lg:py-0 lg:px-0 bg-gray-100">

      <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2 ">
 <Suspense fallback={
  <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2 ">
     <nav className="text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        <span className="text-gray-400">/</span>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        <span className="text-gray-400">/</span>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </nav>
    <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
  <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
    {Array.from({ length: 10 }).map((_, index) => (
      <CategorySkeleton key={index} />
    ))}
    </div>
    </div>
  }> 
        <nav className=" text-sm text-gray-600">
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

        <h1 className="lg:text-3xl text-2xl font-bold ">{category.name}</h1>
       

  
        {subcategories.length > 0 ? (
                      <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
              {subcategories.map((subcat) => (
                <Subcat
                  key={subcat.id}
                  category={subcat}
                />
              ))}
            </div>

        ) : (
         <div className="text-center py-8">
    <p className="text-gray-600 mb-4">Загрузка товаров...</p>
  </div>

        )}
        </Suspense>
      </div>
    </div>
    </>
  );
}