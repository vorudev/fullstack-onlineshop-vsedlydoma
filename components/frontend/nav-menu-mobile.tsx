import Link from "next/link";
import {Home, MapPin, ShoppingCart, User, TextSearch } from "lucide-react"
export default function NavMenuMobile() 
{ 
    return (
<div 
  className="flex flex-row lg:hidden bg-white justify-between py-2 px-5 md:px-15 items-center fixed bottom-0 w-full text-gray-400"
  style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)' }}
>
   <Link href="/" className="flex flex-col text-[#0000CD]  items-center">
   <Home className="w-6 h-6"/> 
   <span className="text-xs">Главная</span> 
   </Link>
   <Link href="/" className="flex flex-col  items-center">
   <MapPin className="w-6 h-6"/> 
   <span className="text-xs">Магазины</span> 
   </Link>
   <Link href="/" className="flex flex-col  items-center">
   <TextSearch className="w-6 h-6"/> 
   <span className="text-xs">Каталог</span> 
   </Link>
   <Link href="/" className="flex flex-col g items-center">
   <ShoppingCart className="w-6 h-6"/> 
   <span className="text-xs">Корзина</span> 
   </Link>
   <Link href="/" className="flex flex-col g items-center">
   <User className="w-6 h-6"/> 
   <span className="text-xs">Войти</span> 
   </Link>
            </div>
    )
}