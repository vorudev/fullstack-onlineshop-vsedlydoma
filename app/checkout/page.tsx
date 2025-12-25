'use client';
import {useCart} from "@/app/context/cartcontext";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useState, useEffect } from "react";
import OrderForm from "@/components/forms/order-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Map from "@/components/frontend/map";
export default function Checkout() {
    const { cart, updatedCart, validationErrors, isValidating, validateCart } = useCart();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        validateCart();
      }, [cart]);
        const outOfStockItems = updatedCart?.filter(
        item => item.product.inStock === "Нет в наличии" || item.product.inStock === "Наличие уточняйте"
    ) || [];
    
    const hasOutOfStockItems = outOfStockItems.length > 0;
    return (
        <div className="text-black min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] pb-70 lg:pb-40 ">
            <div className="flex flex-col py-2 px-8 lg:ml-11">
                <div className="flex flex-row items-center gap-2">
            <Link href="/" className="relative  w-[150px] h-[100px] ">
<Image src="/logo.webp" alt="Logo" fill className="object-contain" />
            </Link>
            <div className="h-12 w-px bg-gray-300 mx-2"></div>
            
            <div className="relative border-l "> <button 
            onClick={() => setOpen(!open)}
            className=" text-black  text-[14px] rounded-xl flex flex-row items-center gap-2">
              Оформляем  {updatedCart?.length} товара <br />  на сумму {updatedCart?.reduce((acc, item) => acc + (item.product?.priceRegional ? item.product.priceRegional * item.quantity : item.product.price * item.quantity), 0).toFixed(2)} руб
             <div className="flex flex-row ml-2 items-center gap-2 text-gray-300 rounded bg-white ">   {open ? <ChevronUp /> : <ChevronDown />}</div>
                </button>
                {open && (
                    <div className="flex flex-col absolute z-50 bg-white shadow-lg rounded-xl px-3 py-3 top-[50px]  lg:w-[400px] -left-[100px] ">
                        {updatedCart?.map(item => (
                            <Link href={`/product/${item.product.slug}`} key={item.product.id} className="flex flex-row border-b py-2 border-gray-200 items-center gap-3 w-full justify-between">
                            
              
                                    <p className="text-[14px] max-w-[300px]">{item.product.title} ({item.quantity} шт)</p>
                                    <p className="text-[14px] ">{item.product.priceRegional ? item.product.priceRegional.toFixed(2) : item.product.price.toFixed(2)} руб</p>
                                
                            </Link>
                        ))}
                    </div>
                )}
                 
                </div>
                </div>
                {hasOutOfStockItems && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4 lg:w-2/3">
                        <div className="flex flex-row items-start gap-3">
                            <div className="text-yellow-600 mt-1">⚠️</div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[14px] font-semibold text-yellow-800">
                                    Внимание! Некоторых товаров нет в наличии
                                </h3>
                                <p className="text-[14px] text-yellow-700">
                                    В вашем заказе есть товары, которых нет в наличии или требуется уточнение наличия. 
                                    После оформления заказа мы свяжемся с вами для подтверждения и уточнения сроков.
                                </p>
                                <div className="flex flex-col gap-1 mt-2">
                                    {outOfStockItems.map(item => (
                                        <p key={item.product.id} className="text-[13px] text-yellow-600">
                                            • {item.product.title} - {item.product.inStock}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
           <div className="flex flex-col"> <div className="flex flex-col">
<div className="flex flex-row items-center gap-6">
<div className="bg-white rounded-full w-6 h-6 flex items-center justify-center font-semibold text-gray-600 border-gray-300 border">1</div>
<div>
    <h2 className="text-[16px] font-semibold">Способ получения</h2>
    <p className="text-[14px] text-gray-600">Выберите способ получения</p>
</div>

                </div>
                <div className="flex flex-row gap-6">   
                <div className=" w-px bg-gray-300 ml-3 lg:block hidden"></div>
                <div className="flex py-4 px-2 flex-col  lg:w-2/3 w-full gap-5">
<div className="flex flex-row items-center gap-2">
   <div className="flex flex-col bg-white p-2 rounded-md">
     <h2 className="text-[14px] font-semibold">Самовывоз </h2>
 
   </div>
   <HoverCard>
  <HoverCardTrigger className="text-gray-600 cursor-pointer w-6 h-6 flex items-center justify-center border border-gray-200 rounded-full">?</HoverCardTrigger>
  <HoverCardContent className="text-[14px] bg-white text-gray-600">
    Временно Доступен только самовывоз
</HoverCardContent>
</HoverCard>
</div>
<div className="bg-white px-3 py-2 flex lg:flex-row flex-col rounded-md w-full lg:h-[200px]">
<div className="flex flex-col gap-1 w-full lg:w-1/2 p-3 ">
    <p className="text-[16px] font-semibold">Минск, Аэродромная ул., 3
</p>
    <p className="text-[14px] text-gray-600">Понедельник - пятница с 9:00 до 19:00, суббота с 10:00 до 16:00, воскресенье с 10:00 до 14:00</p>
    <p className="text-[14px] text-gray-600">+375 29 380-82-46</p>
</div>
 <div className="relative w-full lg:w-1/2 h-[200px] lg:h-auto  rounded-2xl overflow-hidden">
      <Map />
    </div>
</div>
</div>
</div>
            </div>
            <div className="flex flex-col">
<div className="flex flex-row items-center gap-6">
<div className="bg-white rounded-full w-6 h-6 flex items-center justify-center font-semibold text-gray-600 border-gray-300 border">2</div>
<div>
    <h2 className="text-[16px] font-semibold">Выберите способ оплаты
    </h2>
    <p className="text-[14px] text-gray-600">Выберите способ оплаты заказа</p>
    
</div>

                </div>
             <div className="flex flex-row gap-6">   
                <div className=" w-px bg-gray-300 ml-3 lg:block hidden"></div>
                <div className="flex py-4 px-2 flex-col  lg:w-2/3 w-full gap-5">
<div className="flex flex-row items-center gap-2">
   <div className="flex flex-col bg-white p-2 rounded-md">
     <h2 className="text-[14px] font-semibold">Оплата при получении </h2>
 
   </div>
   <HoverCard>
  <HoverCardTrigger className="text-gray-600 cursor-pointer w-6 h-6 flex items-center justify-center border border-gray-200 rounded-full">?</HoverCardTrigger>
  <HoverCardContent className="text-[14px] bg-white text-gray-600">
    Временно доступна только оплата при получении заказа
</HoverCardContent>
</HoverCard>
</div>
</div>
</div>
            </div>
            <div className="flex flex-col">
<div className="flex flex-row items-center gap-6">
<div className="bg-white rounded-full w-6 h-6 flex items-center justify-center font-semibold text-gray-600 border-gray-300 border">3</div>
<div>
    <h2 className="text-[16px] font-semibold">Заполните данные</h2>
    <p className="text-[14px] text-gray-600"></p>
</div>
  


                
                </div>
                <div className="flex flex-row gap-6">   
                <div className=" w-px bg-gray-300 ml-3 lg:block hidden"></div>
                <div className="flex py-4 px-2 flex-col  lg:w-2/3 w-full gap-5">
<div className=" py-2 flex flex-row rounded-md w-full ">

 {updatedCart && <OrderForm items={updatedCart} />}
</div>
</div>
</div>
            </div>
            </div>
            </div>
        </div>
    );
}
