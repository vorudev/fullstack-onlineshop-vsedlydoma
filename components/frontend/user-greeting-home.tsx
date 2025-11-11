'use client';
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function UserGreetingHome() {
    const session = useSession();
    return (
        <div className="min-w-[80vw] md:min-w-[40vw] md:w-full xl:w-[30%] xl:min-w-0 bg-blue-100 rounded-xl shadow py-4 pl-4 snap-center flex-col flex gap-10 relative  overflow-hidden">
<div className="flex flex-col max-w-[250px]"><h3 className="text-lg xl:text-xl font-semibold ">{session ? "Привет, " + session?.data?.user?.name + "!": "Личный кабинет"}</h3>
    <p className="text-gray-600 text-sm xl:text-base">Отслеживайте свои заказы в личном кабинете</p>
    </div> 
    <div className="flex flex-row gap-2">
       {session ? <Link href="/profile" className="bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm border border-gray-300 py-2 px-3 xl:text-base">Мои заказы</Link> : <Link href="/signin" className="bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm border border-gray-300 py-2 px-3 xl:text-base">Войти</Link>} 
        
    </div>
    <div className="absolute -bottom-4 -right-5 text-blue-500/50">
    <ShoppingCart className="w-30 h-30" /> 
    </div>
  </div>
    );
}