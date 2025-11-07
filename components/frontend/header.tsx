import { MapPin, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import CategoriesTable from "../categories-table-user"
import SearchBar from "../searchbar-client"

import { Suspense } from "react"
import UserElement from "./icons-header/user-header"
import CartHeader from "./icons-header/cart-header"
import { getCategories } from "@/lib/actions/product-categories";
export default async function Header() {
    const categories = await getCategories();
    return  ( 
        <>
        <header className="bg-white lg:hidden flex flex-col text-black mx-auto gap-3 py-2 px-3">
        <div className="flex flex-row gap-2 items-center justify-between "> 
            <Link href="/">
            <Image src="/logo.webp" alt="logo" width={95} height={35} />
            </Link>
              <div className="flex flex-row gap-2 items-center "> < MapPin className="w-3 h-3" /> <p className=" text-sm"> Минск</p>
              </div>
         </div>
         <Suspense fallback={<div>Loading...</div>}>
        <SearchBar />
        </Suspense>
        </header>
        {/* desktop */}
        <header className="bg-white hidden xl:max-w-[1400px] lg:max-w-[1000px] lg:flex flex-col text-black mx-auto ">
            <nav className="flex flex-row justify-between py-5 px-6 text-gray-800">
<div className="flex flex-row gap-2 items-center ">
   < MapPin className="w-4 h-4" /> <p className=" 2xl:text-lg"> Минск</p>
</div>
<div className="flex flex-row gap-6 items-center "> 
    <Link href="/auth/login" className="2xl:text-lg ">Войти</Link>
    <Link href="/auth/register" className="2xl:text-lg">Регистрация</Link> 
    <Link href="/cart" className="2xl:text-lg">Корзина</Link>
    <Link href="/orders" className="2xl:text-lg">Заказы</Link>
</div>
<p>8-800-555-35-35</p>
            </nav>
            <div className="flex flex-row  justify-between  gap-3 items-center text-gray-600 py-2 px-3" >
                <div className="flex flex-row   rounded-xl items-center flex-shrink-0">
                    <Link href="/">
                    <Image src="/logo.webp" alt="logo" width={160} height={60} />
                    </Link>
                    <CategoriesTable categories={categories} /> </div>
                <SearchBar />
                <div className="flex flex-row gap-2 items-center  "> 

                    
                   <Link href="/wishlist" className="flex flex-col hover:bg-gray-100 rounded-xl transition duration-300 p-3 gap-1 items-center "> <Heart className="2xl:w-6 2xl:h-6 text-gray-400 " />
                   <span className="text-[14px] 2xl:text-md">Избранное</span></Link>
                  
                   <CartHeader />
                   <UserElement />
                </div>
                 
                </div> 

        </header>
        </>
    )
}