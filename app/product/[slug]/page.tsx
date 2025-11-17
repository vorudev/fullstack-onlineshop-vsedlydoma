import { getProductsBySlug } from "@/lib/actions/product"
import { useCart } from "@/app/context/cartcontext"
import { getReviewsByProductId } from "@/lib/actions/reviews";
import { ReviewsTable } from "@/components/reviews-table";
import Link from "next/link";
import Section1 from "./section1";
import Section2 from "./section2";
import {getProductsWithDetailsLeftJoin} from "@/lib/actions/product";

import Image from "next/image";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
 const   productDetails = await getProductsWithDetailsLeftJoin(slug);
 if (!productDetails) {
  return <div>Товар не найден</div>;
}

  
  return (
   <main className="lg:bg-gray-100 bg-white min-h-screen">
<div className="  xl:max-w-[1400px] lg:max-w-[1000px] flex text-black lg:mx-auto py-2 min-h-screen  lg:py-0 lg:px-0 pb-30">
<Section1 productDetails={productDetails }/>

</div>
   </main>
    
  );
}