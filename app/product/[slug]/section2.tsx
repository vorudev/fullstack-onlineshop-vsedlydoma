import { AddToCart } from "./add-to-cart-prop";
import React from 'react';
import { Star } from 'lucide-react';
import OrderForm from "@/components/forms/order-form";
interface Section1Props { 
  id: string;
        title: string;
        price: number;
    
} 
export default function Section2({ title, price, id }: Section1Props) { 
    return (
 <div className="bg-[rgb(251,251,239)] text-[rgb(35,25,22)] w-full flex lg:justify-center lg:aspect-[1/1.15] ">
            <div className="px-[20px] py-[20px] lg:py-0 lg:px-0 flex flex-col gap-[24px] lg:gap-[40px] h-full w-full lg:w-[380px] lg:justify-center">
                <div className="flex flex-col w-full items-start lg:items-center gap-[16px] lg:gap-[24px] pr-[32px] lg:pr-[24px] lg:pl-[24px] max-w-[360px] lg:max-w-[380px]">
<div className="flex flex-col gap-3 items-center  w-full p-6 rounded-md  ">


<p className="uppercase text-[11px] md:text-lg bdog1 ">$ {price} USD</p>

           
           
<AddToCart  id={id} price={price} title={title} />
<OrderForm id={id} title={title} price={price} quantity={1}/>
    </div>       
</div>
            </div>

        </div> 
    );
} 