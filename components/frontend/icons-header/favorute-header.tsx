"use client"
import { useFavorite } from "@/app/context/favoritecontext"
import Link from "next/link"
import { Heart } from "lucide-react"

export default function FavoruteHeader() {
    const {favorite} = useFavorite();
    return (
        <Link href="/favorite" className="flex flex-col p-3 hover:bg-gray-100 rounded-xl transition duration-300 gap-1 items-center "> <Heart className="2xl:w-6 2xl:h-6  text-gray-400 " />
       <div className="flex flex-row gap-1 items-center">
        <span className="text-[14px] 2xl:text-md ">Избранное </span>
        <span className="text-[14px] 2xl:text-md ">{favorite.length}</span>
        </div>
        </Link>
    )
}