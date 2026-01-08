'use client'
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
export default function Preview(){ 
    return ( 
        <div className="flex flex-row w-full  gap-[12px] py-[24px] bg-white">
            <div className="flex flex-col gap-2 items-between justify-between">
<div className="relative w-[100px] h-[100px] py-3">
<Image src="https://baucenter.ru/upload/pictures/40/403004203-0.webp?1659036061" alt="product" className="object-cover" width={100} height={100}/>
</div>
<div className="flex text-black justify-center items-center flex-col">
<div className="flex flex-row gap-1 items-center pr-2">
    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
    <p className="font-semibold text-[14px] ">
        4.8
    </p>
</div>
<p className="text-gray-600 text-[14px] ">6 отзывов</p>
</div>
</div>
<div className="flex flex-col">
<h3 className="text-black text-[20px] font-semibold">
3.48 руб
</h3>
<p className="text-[14px] text-black mb-1">
    Колено канализационное 90/30
</p>
<ul className="text-[12px] mb-2">
    <li className="flex flex-row items-center">
        <span className="text-gray-600 pr-1">
            Размер:
        </span>
        <span className="text-black">
            90
        </span>

    </li>
    <li className="flex flex-row items-center">
        <span className="text-gray-600 pr-1">
        угол:
        </span>
        <span className="text-black">
       30
        </span>

    </li>
    <li className="flex flex-row items-center">
        <span className="text-gray-600 pr-1">
        Длина:
        </span>
        <span className="text-black">
        30 см
        </span>

    </li>

    
</ul>
<div className='flex flex-row gap-3 '>
    <button
                  
                    className="flex items-center  max-w-[100px] justify-center gap-2 w-full xl:px-4 py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors"
                >
                    <ShoppingCart className="w-4 h-4 hidden xl:block" />
                    <span className="text-[14px]">В корзину</span>
                </button>
                <button
            className={` lg:w-full cursor-pointer rounded-md lg:bg-white `}

        >
         <Heart className="lg:w-6 lg:h-6 w-5 h-5 text-red-500 fill-red-500" /> 
        </button>
                </div>
</div>
        </div>
    )
}