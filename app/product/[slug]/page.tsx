import { buildCategoryUrl, getProductsBySlug } from "@/lib/actions/product"
import { useCart } from "@/app/context/cartcontext"
import { getReviewsByProductId } from "@/lib/actions/reviews";
import { ReviewsTable } from "@/components/reviews-table";
import Link from "next/link";
import { buildCategoryChain } from "@/lib/actions/product";
import Section1 from "./section1";
import type { Metadata } from "next";
import {getProductsWithDetailsLeftJoin} from "@/lib/actions/product";
import { productPageQueries } from "@/lib/actions/prepared-queries";
interface ProductPageProps {
  params:  Promise<{ slug: string }>;
  searchParams: Promise<{ reviewsLimit?: string}>;
}


export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  // Ожидаем params перед использованием
  const { slug } = await params;
 const { reviewsLimit: reviewsLimitParam } = await searchParams;
  const reviewsLimit = parseInt(reviewsLimitParam || '1');

    const [product] = await productPageQueries.getMain.execute({
      slug: slug
    });

    console.time('Product main query');
const [reviews, productImages, attributes, manufacturer, manufacturerImages, stats] = 
await Promise.all([
  productPageQueries.getReviews.execute({ id: product.id, limit: reviewsLimit }),
  productPageQueries.getImages.execute({ id: product.id }),
  productPageQueries.getAttributes.execute({ id: product.id }),
  productPageQueries.getManufacturer.execute({ id: product.manufacturerId }),
  productPageQueries.getManufacturerImages.execute({ id: product.manufacturerId }),
  productPageQueries.getReviewsStats.execute({ id: product.id })
]);
console.timeEnd('Product main query')
console.log(stats)
  const internals = {
    slug: slug,
    currentLimit: reviewsLimit
  };
 // const breadcrumbs = await buildCategoryChain(productDetails?.categoryId || '');
  return (
   <main className="lg:bg-gray-100 bg-white min-h-screen">
<div className="  xl:max-w-[1400px] lg:max-w-[1000px] flex flex-col  text-black lg:mx-auto py-2 min-h-screen  lg:py-0 lg:px-0 pb-30">
 {/* <div className="pt-2 lg:pt-5 pl-[16px]"><nav className=" text-sm text-gray-600">
                    {breadcrumbs.map((crumb: { id: string; name: string; slug: string }, index) => (
                      <span key={crumb.id}>
                        <Link
                          href={`/categories/${crumb.slug}`}
                          className="hover:text-blue-600"
                        >
                           {crumb.name}
                        </Link>
                        {index < breadcrumbs.length - 1 && ' / '}
                      </span>
                    ))}
                  </nav>
                  </div> */}
<Section1 product={product} stats={stats[0]} productImages={productImages} attributes={attributes} manufacturer={manufacturer[0]} manufacturerImages={manufacturerImages} reviews={reviews} internals={internals}/>

</div>
   </main>
    
  );
}