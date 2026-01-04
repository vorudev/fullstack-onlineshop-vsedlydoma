import { getAllProductsByManufacturerId } from "@/lib/actions/manufacturer";
import { getManufacturerBySlug } from "@/lib/actions/manufacturer";
import Pagination from "@/components/frontend/pagination-client";
import SearchBar from "@/components/frontend/searchbar-manufacturers";
import { getFeaturedManufacturerImage } from "@/lib/actions/image-actions";
import ProductCard from "@/components/frontend/product-card-full";
import Image from "next/image";
import { Metadata } from "next";
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
interface GetProductsByManufacturerIdParams {
    searchParams: Promise<{ // Добавляем Promise
        page?: string;
        search?: string;
        limit: number;
      }>
      params: Promise<{ slug: string }>
} 
export async function generateMetadata({ params  }: GetProductsByManufacturerIdParams
): Promise<Metadata> {
  const { slug } = await params;
    const selectedFilters: Record<string, string[]> = {};
  const manufacturer = await getManufacturerBySlug(slug);
  
  const canonicalUrl = `https://fullstack-onlineshop-vsedlydoma.vercel.app/manufacturers/${manufacturer.slug}`;
  return {
    title: manufacturer.name, // или productDetails.title
    description: `Товары от ${manufacturer.name} - ${ 'Купить в Минске по выгодной цене'}`,
    keywords: `${manufacturer.name || ''}, сантехника, товары для дома минск`,
    alternates: {
      canonical: canonicalUrl, // ← Вот это нужно добавить
    },
    openGraph: {
      type: 'website', 
      url: canonicalUrl, // Тоже хорошо для соцсетей
      title: manufacturer.name,
      description: manufacturer.name || "",
      siteName: 'Магазин Всё для дома',
      locale: 'ru_RU',

    },
  };
}


// 1. Компонент скелетона
function ManufacturerPageSkeleton() {
  return (
    <div className="flex flex-col px-[16px] gap-2 lg:px-6 text-black xl:max-w-[1400px] pb-30 lg:max-w-[1000px] min-h-screen mx-auto">
      {/* Logo skeleton */}
      <div className="flex flex-row gap-4 pt-2 items-center justify-center">
        <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] lg:w-[100px] lg:h-[100px] bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Search bar skeleton */}
      <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

// 2. Асинхронный компонент с данными
async function ManufacturerContent({
  slug,
  currentPage,
  searchQuery,
  limit
}: {
  slug: string;
  currentPage: number;
  searchQuery: string;
  limit: number;
}) {
  // Получаем производителя
  const manufacturer = await getManufacturerBySlug(slug);
  
  if (!manufacturer) {
    notFound();
  }

  // Параллельно загружаем изображение и продукты
  const [featuredImage, { products, images, pagination }] = await Promise.all([
    getFeaturedManufacturerImage(manufacturer.id),
    getAllProductsByManufacturerId({
      manufacturerId: manufacturer.id,
      page: currentPage,
      pageSize: Number(limit) || 20,
      search: searchQuery
    })
  ]);

  // Объединяем продукты с изображениями
  const productsWithDetailAndImages = products?.map(product => {
    const productImages = images?.filter(img => img.productId === product.id) || [];
    return {
      ...product,
      images: productImages,
    };
  });

  return (
    <div className="flex flex-col px-[16px] gap-2 lg:px-6 text-black xl:max-w-[1400px] pb-30 lg:max-w-[1000px] min-h-screen mx-auto">
      {/* Manufacturer logo */}
      <div className="flex flex-row gap-4 pt-2 items-center justify-center">
        <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] lg:w-[100px] lg:h-[100px] relative flex-shrink-0 rounded-lg overflow-hidden">
          {featuredImage && (
            <Image
              src={featuredImage.imageUrl}
              alt={manufacturer.name}
              fill
              className="object-contain p-2"
            />
          )}
        </div>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Products grid */}
      {productsWithDetailAndImages && productsWithDetailAndImages.length > 0 ? (
        <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-2">
          {productsWithDetailAndImages.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Товары не найдены</p>
        </div>
      )}

      {/* Pagination */}
      <div className="max-w-[600px] w-full mx-auto">
        <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.pageSize}
      />
    </div>
    </div>
  );
}

// 3. Главный компонент страницы
export default async function ManufacturerPage({ 
  searchParams, 
  params 
}: GetProductsByManufacturerIdParams) {
  const { page, search, limit} = await searchParams;
  const { slug } = await params;
  
  const currentPage = Number(page) || 1;
  const searchQuery = search || '';

  return (
    <Suspense fallback={<ManufacturerPageSkeleton />}>
      <ManufacturerContent 
        slug={slug}
        limit={limit}
        currentPage={currentPage}
        searchQuery={searchQuery}
      />
    </Suspense>
  );
}