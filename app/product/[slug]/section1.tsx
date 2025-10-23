import { AddToCart } from "./add-to-cart-prop";
import React from 'react';
interface Section1Props { 
  id: string;
        title: string;
        price: number;
image: string;
description: string
    
} 
export default function Section1({ title, price, image, id, description }: Section1Props) { 
    return (
 <div className="bg-[rgb(251,251,239)] text-[rgb(35,25,22)] w-full flex lg:justify-center lg:aspect-[1/1.15] ">
            <div className="px-[20px] py-[20px] lg:py-0 lg:px-0 flex flex-col gap-[24px] lg:gap-[40px] h-full w-full lg:w-[380px] lg:justify-center">
                <div className="flex flex-col w-full items-start lg:items-center gap-[16px] lg:gap-[24px] pr-[32px] lg:pr-[24px] lg:pl-[24px] max-w-[360px] lg:max-w-[380px]">
<p className="uppercase text-[11px] bdog2 md:text-[12px] lg:hidden">face</p>
<h1 className="uppercase text-[20px] md:text-[22px] lg:text-[24px] prata7 ">
   {title}
</h1>
<p className="text-[13px] lg:text-[14px] lg:text-center  prata6 ">
{description}
</p>
<p className="uppercase text-[11px] md:text-xs bdog1 lg:hidden ">$ {price} USD</p>

            </div>
           <div className="lg:hidden flex ">
<AddToCart  id={id} price={price} title={title} image={image}/>
          
</div>
            </div>

        </div> 
    );
} 