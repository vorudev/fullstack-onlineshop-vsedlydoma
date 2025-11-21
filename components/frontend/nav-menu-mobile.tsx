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
  className="flex flex-row lg:hidden bg-white justify-between py-2 px-5 md:px-15 items-center z-100 fixed bottom-0 w-full text-gray-400"
  style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)' }}
>
   <Link href="/" className={`flex flex-col  items-center ${pathname === '/' ? 'text-blue-600' : ''}`}>
   <Home className="w-5 h-5"/> 
   <span className="text-[11px]">Главная</span> 
   </Link>
   <Link href="/about" className={`flex flex-col  items-center ${pathname === '/about' ? 'text-blue-600' : ''}`}>
   <MapPin className="w-5 h-5"/> 
   <span className="text-xs">О нас</span> 
   </Link>
   <Link href="/categories" className={`flex flex-col  items-center ${pathname === '/categories' ? 'text-blue-600' : ''}`}>
   <TextSearch className="w-5 h-5"/> 
   <span className="text-[11px]">Каталог</span> 
   </Link>
   <Link href="/cart" className={`flex flex-col g items-center ${pathname === '/cart' ? 'text-blue-600' : ''}`}>
   <ShoppingCart className="w-5 h-5"/> 
   <span className="text-[11px]">Корзина</span> 
   </Link>
    {session?.data?.user ? (
        <Link href="/menu" className={`flex flex-col g items-center ${pathname === '/profile' ? 'text-blue-600' : ''}`}>
   <User className="w-5 h-5"/> 
   <span className="text-[11px]">{session?.data?.user?.name}</span> 
   </Link>
     ) : (
        <Link href="/menu" className={`flex flex-col g items-center ${pathname === '/signin' ? 'text-blue-600' : ''}`}>
   <User className="w-5 h-5"/> 
   <span className="text-[11px]">Войти</span> 
   </Link>
     )}
            </div>
    )
}