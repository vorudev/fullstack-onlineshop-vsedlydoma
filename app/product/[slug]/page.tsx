import { getProductsBySlug } from "@/lib/actions/product"
import { useCart } from "@/app/context/cartcontext"
import { getReviewsByProductId } from "@/lib/actions/reviews";
import { ReviewsTable } from "@/components/reviews-table";
import Link from "next/link";
import Section1 from "./section1";
import Section2 from "./section2";

import Image from "next/image";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
  const product = await getProductsBySlug(slug);

  if (!product) {
    return <div>Product not found</div>;
  }


  return (
    <>
     <div className="flex flex-col lg:flex-row lg:pt-[70px] pt-[60px] ">
            <div className="lg:w-1/3 w-full"> </div>
            <div className="lg:w-1/3 w-full"> <Section1 title={product.title} description={product.description} price={product.price}  id={product.id} image={product.image}/></div>
            <div className="lg:w-1/3 w-full hidden lg:block"> <Section2 title={product.title} price={product.price}  id={product.id} /></div>
        </div>
        <ReviewsTable productId={product.id} />
    
     </>
    
  );
}