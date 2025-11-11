'use client'
import { usePathname } from "next/navigation";
import Link from "next/link";
import {Home, MapPin, ShoppingCart, User, TextSearch } from "lucide-react"
import { useSession } from "@/lib/auth-client";
export default function NavMenuMobile() 
{ 
    const pathname = usePathname();
    const session = useSession();
    return (
<div 
  className="flex flex-row lg:hidden bg-white justify-between py-2 px-5 md:px-15 items-center fixed bottom-0 w-full text-gray-400"
  style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)' }}
>
   <Link href="/" className={`flex flex-col  items-center ${pathname === '/' ? 'text-blue-600' : ''}`}>
   <Home className="w-6 h-6"/> 
   <span className="text-xs">Главная</span> 
   </Link>
   <Link href="/shops" className={`flex flex-col  items-center ${pathname === '/shops' ? 'text-blue-600' : ''}`}>
   <MapPin className="w-6 h-6"/> 
   <span className="text-xs">Магазины</span> 
   </Link>
   <Link href="/categories" className={`flex flex-col  items-center ${pathname === '/categories' ? 'text-blue-600' : ''}`}>
   <TextSearch className="w-6 h-6"/> 
   <span className="text-xs">Каталог</span> 
   </Link>
   <Link href="/cart" className={`flex flex-col g items-center ${pathname === '/cart' ? 'text-blue-600' : ''}`}>
   <ShoppingCart className="w-6 h-6"/> 
   <span className="text-xs">Корзина</span> 
   </Link>
    {session?.data?.user ? (
        <Link href="/profile" className={`flex flex-col g items-center ${pathname === '/profile' ? 'text-blue-600' : ''}`}>
   <User className="w-6 h-6"/> 
   <span className="text-xs">{session?.data?.user?.name}</span> 
   </Link>
     ) : (
        <Link href="/signin" className={`flex flex-col g items-center ${pathname === '/signin' ? 'text-blue-600' : ''}`}>
   <User className="w-6 h-6"/> 
   <span className="text-xs">Войти</span> 
   </Link>
     )}
            </div>
    )
}