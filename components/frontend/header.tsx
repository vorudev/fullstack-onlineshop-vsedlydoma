import { MapPin, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import CategoriesTable from "../categories-table-user"
import SearchBar from "../searchbar-client"
import FavoruteHeader from "./icons-header/favorute-header"
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
   < MapPin className="w-4 h-4" /> <p className=" 2xl:text-lg"> Минск, Аэродромная улица, 3</p>
</div>
<div className="flex flex-row gap-6 items-center "> 
    <Link href="/about" className="2xl:text-lg ">О нас</Link>
    <Link href="/contact-us" className="2xl:text-lg">Контакты</Link> 
    <Link href="/news" className="2xl:text-lg">Новости</Link>
    <Link href="/profile" className="2xl:text-lg">Профиль</Link>
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

                    
                   <FavoruteHeader />
                  
                   <CartHeader />
                   <UserElement />
                </div>
                 
                </div> 

        </header>
        </>
    )
}