

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import CategorySkeleton from '@/components/frontend/skeletons/category-skeleton';
import { getCategoryWithNavigation, buildCategoryUrl } from '@/lib/actions/categories';
import { getFeaturedCategoryImage } from '@/lib/actions/image-actions';
import Header from '@/components/frontend/header';
import { categoryMeta } from '@/lib/actions/categories';
import Image from 'next/image';
import { Suspense } from 'react';
import Subcat from './subcat';
import { Metadata } from 'next';
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params  }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await categoryMeta(slug);
  
  if (!data) {
    notFound();
  }


  
  const canonicalUrl = `https://fullstack-onlineshop-vsedlydoma.vercel.app/categories/${data.slug}`;
  return {
    title: data.name, // или productDetails.title
    description: `${data.name} — ${'Купить в Минске по выгодной цене'}`,
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

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}

function CategoryPageSkeleton() {
  return (
    <div className="xl:max-w-[1400px] lg:max-w-[1000px] flex text-black lg:mx-auto py-2 px-[16px] min-h-screen lg:py-0 lg:px-0 bg-gray-100">
      <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2">
        {/* Skeleton для breadcrumbs */}
        <nav className="text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </nav>
        
        {/* Skeleton для заголовка */}
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
        
        {/* Skeleton для карточек */}
        <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Асинхронный компонент с данными
async function CategoryContent({ slug }: { slug: string }) {
  const data = await getCategoryWithNavigation(slug);
  
  if (!data) {
    notFound();
  }

  const { category, breadcrumbs, subcategories } = data;

  if (subcategories.length === 0) {
    redirect(`/products?category=${category.slug}`);
  }

  return (
    <div className="xl:max-w-[1400px] lg:max-w-[1000px] flex text-black lg:mx-auto py-2 px-[16px] min-h-screen lg:py-0 lg:px-0 bg-gray-100">
      <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600">
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

        {/* Заголовок */}
        <h1 className="lg:text-3xl text-2xl font-bold">{category.name}</h1>

        {/* Подкатегории */}
        <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
          {subcategories.map((subcat) => (
            <Subcat key={subcat.id} category={subcat} />
          ))}
        </div>
      </div>
    </div>
  );
}