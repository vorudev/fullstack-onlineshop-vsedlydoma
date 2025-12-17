import { getAllProductsByManufacturerId } from "@/lib/actions/manufacturer";
import { getManufacturerBySlug } from "@/lib/actions/manufacturer";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/frontend/searchbar-manufacturers";
import { getFeaturedManufacturerImage } from "@/lib/actions/image-actions";
import ProductCard from "@/components/frontend/product-card-full";
import Image from "next/image";
import { Metadata } from "next";
interface GetProductsByManufacturerIdParams {
    searchParams: Promise<{ // Добавляем Promise
        page?: string;
        search?: string;
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
export default async function ManufacturerPage({searchParams, params}: GetProductsByManufacturerIdParams) {
    const { page, search } = await searchParams;
     const { slug } = await params;
      const currentPage = Number(page) || 1;
  const searchQuery = search || '';
     const manufacturer = await getManufacturerBySlug(slug);
     const [featuredImage, {products, images, pagination}]= await Promise.all([
        getFeaturedManufacturerImage(manufacturer.id),
        getAllProductsByManufacturerId({
            manufacturerId: manufacturer.id,
            page: currentPage,
            pageSize: 20,
            search: searchQuery
        }
    )
    ]);
    const productsWithDetailAndImages = products?.map(product => {
  // Находим картинки, которые принадлежат текущему продукту
  const productImages = images?.filter(img => img.productId === product.id) || [];
  
  return {
    ...product,
    images: productImages,
  };
});
    return (
        <div className="flex flex-col px-[16px] gap-2 lg:px-6 text-black xl:max-w-[1400px] pb-30 lg:max-w-[1000px] min-h-screen mx-auto">
  <div className="flex flex-row gap-4 pt-2 items-center justify-center">
    <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] lg:w-[100px] lg:h-[100px] relative flex-shrink-0 rounded-lg overflow-hidden ">
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
   <SearchBar />
  <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 lg:gap-6 gap-2">
              {productsWithDetailAndImages?.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
              </div>
              <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                  />
</div>
    );
}