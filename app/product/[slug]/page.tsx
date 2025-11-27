import { buildCategoryUrl, getProductsBySlug } from "@/lib/actions/product"
import { useCart } from "@/app/context/cartcontext"
import { getReviewsByProductId } from "@/lib/actions/reviews";
import { ReviewsTable } from "@/components/reviews-table";
import Link from "next/link";
import { buildCategoryChain } from "@/lib/actions/product";
import Section1 from "./section1";
import Section2 from "./section2";
import {getProductsWithDetailsLeftJoin} from "@/lib/actions/product";

import Image from "next/image";
interface ProductPageProps {
  params:  Promise<{ slug: string }>;
  searchParams: Promise<{ reviewsLimit?: string}>;
}
export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  // Ожидаем params перед использованием
  const { slug } = await params;
 const { reviewsLimit: reviewsLimitParam } = await searchParams;
  const reviewsLimit = parseInt(reviewsLimitParam || '5');
 const   productDetails = await getProductsWithDetailsLeftJoin(slug, reviewsLimit);
 if (!productDetails) {
  return <div>Товар не найден</div>;
}

  const internals = {
    slug: slug,
    currentLimit: reviewsLimit
  };
  const breadcrumbs = await buildCategoryChain(productDetails?.categoryId || '');
  return (
   <main className="lg:bg-gray-100 bg-white min-h-screen">
<div className="  xl:max-w-[1400px] lg:max-w-[1000px] flex flex-col  text-black lg:mx-auto py-2 min-h-screen  lg:py-0 lg:px-0 pb-30">
  <div className="pt-2 lg:pt-5 pl-[16px]"><nav className=" text-sm text-gray-600">
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
                  </div>
<Section1 productDetails={productDetails} internals={internals}/>

</div>
   </main>
    
  );
}