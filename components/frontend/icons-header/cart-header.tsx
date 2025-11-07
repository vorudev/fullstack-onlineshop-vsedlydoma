"use client"
import { useCart } from "@/app/context/cartcontext"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export default function CartHeader() {
    const {totalItems} = useCart();
    return (
        <Link href="/cart" className="flex flex-col p-3 hover:bg-gray-100 rounded-xl transition duration-300 gap-1 items-center "> <ShoppingCart className="2xl:w-6 2xl:h-6  text-gray-400 " />
       <div className="flex flex-row gap-1 items-center">
        <span className="text-[14px] 2xl:text-md ">Корзина </span>
        <span className="text-[14px] 2xl:text-md ">{totalItems}</span>
        </div>
        </Link>
    )
}