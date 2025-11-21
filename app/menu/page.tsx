'use client'
import Link from "next/link";
import { HeartIcon, ChevronRight, Info, MessageSquareDot, ShoppingCart, UserCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
export default function MenuPage() {
    const {data: session} = useSession();
    return (
        <main className="min-h-screen mx-auto bg-gray-100 flex-col flex gap-5 lg:bg-white xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[24px] pr-[12px] pl-[12px] pb-30">
           {!session?.user && <div className="flex flex-col gap-2 bg-white rounded-xl border border-gray-200 p-[15px]">
            <h2 className="text-[18px] font-semibold leading-tight">Войдите, что бы видеть информацию о своих заказах</h2>
            <Link href="/signin" className="text-white bg-blue-600 px-[15px] py-[10px] rounded-lg text-center font-semibold">Войти</Link>
            </div> }
            {session?.user && <Link href="/profile" className="flex flex-col gap-2 bg-white rounded-xl border border-gray-200 p-[15px]">
          <div className="flex flex-row items-center gap-3">
          <UserCircle className="w-6 h-6 text-blue-600" /> <h2 className="text-[18px] font-semibold leading-tight">Привет, {session?.user.name}!</h2>
          </div>
            <ChevronRight className="w-5 h-5 text-gray-400 absolute right-5" />
            <Link href="/profile" className="text-white bg-blue-600 px-[15px] py-[10px] rounded-lg text-center font-semibold">В Профиль</Link>
            </Link> }
            <div className="flex flex-col  bg-white rounded-xl border border-gray-200 ">
                <Link href="/favorite" className="flex flex-row items-center gap-3 relative py-[16px] px-[12px] ">
                <HeartIcon className="w-6 h-6 text-gray-400" />
                <h2 className="text-[15px]   leading-tight">Избранное</h2>
                <ChevronRight className="w-5 h-5 text-gray-400 absolute right-3" />
                </Link>
                <Link href="/about" className="flex flex-row items-center gap-3 relative py-[16px] px-[12px]">
            <Info className="w-6 h-6 text-gray-400" />
            <h2 className="text-[15px]   leading-tight">О нас</h2>
            <ChevronRight className="w-5 h-5 text-gray-400 absolute right-3" />
            </Link>
            <Link href="/contact-us" className="flex flex-row items-center gap-3 relative py-[16px] px-[12px]">
            <MessageSquareDot className="w-6 h-6 text-gray-400" />
            <h2 className="text-[15px]   leading-tight">Контакты</h2>
            <ChevronRight className="w-5 h-5 text-gray-400 absolute right-3" />
            </Link>
            <Link href="/cart" className="flex flex-row items-center gap-3 relative py-[16px] px-[12px]">
            <ShoppingCart className="w-6 h-6 text-gray-400" />
            <h2 className="text-[15px]   leading-tight">Корзина</h2>
            <ChevronRight className="w-5 h-5 text-gray-400 absolute right-3" />
            </Link>
            </div>            
        </main>
    );
}
