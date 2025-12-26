import { Suspense } from 'react';
import { ProductSkeleton } from '@/components/frontend/skeletons/product-page-skeleton';
import ProductPage from './main';
import { productPageQueries } from '@/lib/actions/prepared-queries';
import { Metadata } from 'next';
interface ProductPageProps {
    params:  Promise<{ slug: string }>;
    searchParams: Promise<{ reviewsLimit?: string}>;
  }
  export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const [product] = await productPageQueries.getMain.execute({
      slug: slug
    });
    if (!product.id) {
      return {
        title: 'Товар не найден',
        description: 'Запрашиваемый товар не найден',
      };
    }
    const canonicalUrl = `https://fullstack-onlineshop-vsedlydoma.vercel.app/product/${slug}`;
    return {
      title: product.title, // или productDetails.title
      description: `${product.description} — ${product.description || 'Купить в Минске по выгодной цене'}`,
      keywords: `${product.keywords || ''}, сантехника, товары для дома минск`,
      alternates: {
        canonical: canonicalUrl, // ← Вот это нужно добавить
      },
      openGraph: {
        type: 'website', 
        url: canonicalUrl, // Тоже хорошо для соцсетей
        title: product.title,
        description: product.description,
        siteName: 'Магазин Всё для дома',
        locale: 'ru_RU',
  
      },
    };
  }
  
export default async function ProductPageLayout({ params,  searchParams  }: ProductPageProps) {
    const { slug } = await params;
    const { reviewsLimit: reviewsLimitParam } = await searchParams;
     const reviewsLimit = parseInt(reviewsLimitParam || '5');
   
       const [product] = await productPageQueries.getMain.execute({
         slug: slug
       });
  return (
    <main className="lg:bg-gray-100 bg-white min-h-screen">
      <div className="xl:max-w-[1400px] lg:max-w-[1000px] flex flex-col text-black lg:mx-auto py-2 min-h-screen lg:py-0 lg:px-0 pb-30">
        <Suspense fallback={<ProductSkeleton />}>
           <ProductPage 
           product={product}
           reviewsLimit={reviewsLimit}/>
        </Suspense>
      </div>
    </main>
  );
}
