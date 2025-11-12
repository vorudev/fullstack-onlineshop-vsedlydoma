'use client';
import { useCart } from "../context/cartcontext"
import OrderForm from "@/components/forms/order-form";
import CartItemComponent from "./cartprops"
import {getFeaturedImage} from "@/lib/actions/image-actions";
import Link from "next/link";
export default function CartPage() {
    const { cart, clearCart, totalPrice  } = useCart();
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

      const getCartItemsString = () => {
        return cart.map(item => `${item.product.title} (x${item.quantity})`).join(', ');
    };
 
    // Для OrderForm нужен один id - можем создать комбинированный
    const cartOrderId = cart.map(item => item.product.id).join(',');
    
    return (  <div className=" min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] ">
        <div className="flex flex-col py-5 px-6">
            {cart.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="bdog md:text-[12px] text-[11px] uppercase text-gray-600">Корзина пуста</p>
                </div>
            ) : (
              <div className="flex lg:flex-row flex-col w-full gap-5">
                
               <div className="flex flex-col bg-white justify-between rounded-xl lg:p-0 w-full lg:w-2/3">
                  <div className="flex flex-col ">  {cart.map((item) => (
                        <CartItemComponent key={item.product.id} item={item} />
                    ))}</div>
                   <div  className="flex flex-row lg:hidden text-black justify-between items-end py-3 border-t px-3 lg:px-0 border-gray-200">
                   <div className="flex flex-col"> 
                    <p className="text-[12px] text-gray-600 ">Итого:</p>
                    <p className="text-[16px] font-semibold ">{cart.length} товара</p>
                     </div>
                    <p className="text-[16px] uppercase font-semibold ">{total.toFixed(2)} руб</p>
                    </div>
                <div className="flex justify-center px-2 py-4 lg:hidden">
                    <Link href="/checkout" className="bg-blue-500 text-white w-full h-[48px] flex items-center justify-center rounded-xl hover:bg-blue-600">
                        Перейти к оформлению
                    </Link>
                </div>
                </div>
                <div className="flex-col hidden lg:flex gap-3 bg-white rounded-xl h-[150px] text-black w-1/3 p-5">
                   <div  className="lg:flex flex-row hidden text-black justify-between items-end ">
                   <div className="flex flex-col"> 
                    <p className="text-[12px] text-gray-600 ">Итого:</p>
                    <p className="text-[16px] font-semibold ">{cart.length} товара</p>
                     </div>
                    <p className="text-[16px] uppercase font-semibold ">{total.toFixed(2)} руб</p>
                    </div>

                     <Link href="/checkout" className="bg-blue-500 text-white w-full h-[48px] flex items-center justify-center rounded-xl hover:bg-blue-600">
                        Перейти к оформлению
                    </Link>
                </div>
                </div>                
            )}
            
            
    
            </div>
        </div>)
}