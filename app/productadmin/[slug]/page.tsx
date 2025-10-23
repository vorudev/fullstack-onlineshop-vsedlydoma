import { getProductsBySlug } from "@/lib/actions/product";
import { getProductWithCategoryChain } from "@/lib/actions/product-categories";
import Link from "next/link";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductWithCategoryChain(slug);

  if (!data) {
    return <div>Product not found</div>;
  }

  const { product, categoryChain } = data;

  return (
    <>
     <div className="flex flex-col lg:flex-row lg:pt-[70px] pt-[60px] ">
            <div className="lg:w-1/3 w-full"> </div>
            <div>
  <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
  <p className="mb-4">{product.description}</p>
  <p className="text-xl font-semibold mb-4">${product.price}</p>

</div>
  {categoryChain.map((category, index) => (
          <span key={category.id} className="flex items-center gap-2">
            <span>/</span>
            <Link 
              href={`/category/${category.slug}`}
              className={index === categoryChain.length - 1 ? "font-bold" : ""}
            >
              {category.name}
            </Link>
          </span>
        ))}
            </div>

     
     </>
    
  );
}