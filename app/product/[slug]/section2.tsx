import { AddToCart } from "./add-to-cart-prop";
import React from 'react';
import { Star } from 'lucide-react';
import OrderForm from "@/components/forms/order-form";
interface ProductUnited {
   
  product: {
    averageRating: number;
    reviewCount: number;
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    slug: string;
    title: string;
    description: string;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[]
}
}   
export default function Section2({ product }: ProductUnited) { 
    return (
 <div className="bg-[rgb(251,251,239)] text-[rgb(35,25,22)] w-full flex lg:justify-center lg:aspect-[1/1.15] ">
            <div className="px-[20px] py-[20px] lg:py-0 lg:px-0 flex flex-col gap-[24px] lg:gap-[40px] h-full w-full lg:w-[380px] lg:justify-center">
                <div className="flex flex-col w-full items-start lg:items-center gap-[16px] lg:gap-[24px] pr-[32px] lg:pr-[24px] lg:pl-[24px] max-w-[360px] lg:max-w-[380px]">
<div className="flex flex-col gap-3 items-center  w-full p-6 rounded-md  ">


<p className="uppercase text-[11px] md:text-lg bdog1 ">$ {product.price} USD</p>

           
           
<AddToCart  product={product}/>
    </div>       
</div>
            </div>

        </div> 
    );
} 