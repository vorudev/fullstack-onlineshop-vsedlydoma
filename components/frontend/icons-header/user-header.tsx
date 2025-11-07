'use client'
import { useSession } from "@/lib/auth-client"
import {Suspense} from "react"
import Link from "next/link"
import { User } from "lucide-react"
export default function UserElement() {
    const session = useSession();
    return (
        <Suspense fallback={<Link href="/signin" className="flex flex-col p-3 hover:bg-gray-100 rounded-xl transition duration-300 gap-1 items-center "> <User className="2xl:w-6 2xl:h-6 text-gray-400 " />
                   <span className="text-[14px] 2xl:text-md">Войти</span></Link>}>
           {session.data?.user ? (
            <Link href="/profile" className="flex flex-col p-3 hover:bg-gray-100 rounded-xl transition duration-300 gap-1 items-center "> <User className="2xl:w-6 2xl:h-6 text-gray-400 " />
                   <span className="text-[14px] 2xl:text-md">{session.data.user.name}</span></Link>
           ) : (
            <Link href="/signin" className="flex flex-col p-3 hover:bg-gray-100 rounded-xl transition duration-300 gap-1 items-center "> <User className="2xl:w-6 2xl:h-6 text-gray-400 " />
                   <span className="text-[14px] 2xl:text-md">Войти</span></Link>
           )}
        </Suspense>
    )
}