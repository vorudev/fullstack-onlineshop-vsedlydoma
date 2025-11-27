'use client'
import { useCart } from "../context/cartcontext";
import Link from "next/link";
export default function NavbarCart() {
        const { cart, clearCart, totalPrice, isValidating, updatedCart  } = useCart();
        const total = updatedCart?.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    return (
       <div 
  className="flex flex-row lg:hidden bg-white justify-between py-1 px-2 md:px-15 items-center z-[1000] fixed bottom-[50px] w-full text-gray-400"
  style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)' }}
>

 <div className="flex flex-row gap-1 items-center">
<p className="text-[15px] text-black font-semibold">Итого:</p>
{isValidating ?      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div> : <p className="text-[16px] text-black font-semibold ">{total?.toFixed(2)} руб</p>}
</div>

   <div>
    <Link href="/cart" className="bg-blue-500 text-white text-[13px] p-[15px] font-bold w-full h-[44px] flex items-center justify-center rounded-md hover:bg-blue-600">
                        К оформлению
                    </Link>
</div>
 
    
            </div>
    )
}