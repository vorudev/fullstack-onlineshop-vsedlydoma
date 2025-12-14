import { MapPin, ShoppingCart, Heart } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import Image from "next/image"
import CategoriesTable from "../categories-table-user"
import SearchBar from "../searchbar-client"
import FavoruteHeader from "./icons-header/favorute-header"
import { Suspense } from "react"
import UserElement from "./icons-header/user-header"
import CartHeader from "./icons-header/cart-header"
import { getCategories } from "@/lib/actions/product-categories";

interface Props { 
  contacts: {
    clientInfo: {
        id: string;
        phone: string;
        src: string;
        link: string;
        contactUsId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    contactUsTelephones: {
        id: string;
        phone: string;
        contactUsId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    id: string;
    title: string;
    description: string;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null
}
export default function Header({ contacts }: Props) {
  return (
    <>
      <header className="bg-white lg:hidden flex flex-col text-black mx-auto gap-3 py-2 px-3">
        <div className="flex flex-row gap-2 items-center justify-between">
          <Link href="/">
            <Image src="/logo.webp" alt="logo" width={95} height={35} />
          </Link>
          <div className="flex flex-row gap-2 items-center">
            <MapPin className="w-3 h-3" /> <p className="text-sm">Минск, Аэродромная улица, 3</p>
          </div>
        </div>
         <Suspense fallback={ <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
         
              placeholder="Загрузка..."
              className={`w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded-lg focus:outline-none hover:border-gray-300 hover:shadow-md transition duration-300 ease-in-out`}
            
            />
            
          </div>
         <Button
className="px-6 py- disabled:opacity-50 items-center gap-2 hidden md:flex"
>
              Поиск


</Button>
        </div>
        
      </div>}>
         <SearchBar />
         </Suspense>
      </header>

      {/* desktop */}
      <header className="bg-white hidden xl:max-w-[1400px] lg:max-w-[1000px] lg:flex flex-col text-black mx-auto">
    <nav className="relative flex flex-row justify-between py-5 px-6 text-gray-800">      
  <div className="flex flex-row gap-2 items-center">
    <MapPin className="w-4 h-4" />
    <p className="2xl:text-lg">Минск, Аэродромная улица, 3</p>
  </div>

  {/* Центральные ссылки — абсолютный центр */}
  <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-6 items-center">
    <Link href="/about" className="2xl:text-lg">О нас</Link>
    <Link href="/contact-us" className="2xl:text-lg">Контакты</Link>
    <Link href="/news" className="2xl:text-lg">Новости</Link>
    <Link href="/profile" className="2xl:text-lg">Профиль</Link>
  </div>


  <p>
  {contacts?.contactUsTelephones?.[0]?.phone || "Телефон не указан"}
</p>

</nav>
        
        <div className="flex flex-row justify-between gap-3 items-center text-gray-600 py-2 px-3">
          <div className="flex flex-row rounded-xl items-center flex-shrink-0">
            <Link href="/">
              <Image src="/logo.webp" alt="logo" width={160} height={60} />
            </Link>
            
            {/* Suspense для CategoriesTable */}
            <Suspense fallback={<button

        className=" bg-[#0000CD] text-white cursor-pointer text-[14px] 2xl:text-[16px] transition duration-300 font-semibold px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Каталог
      </button>}>
              <CategoriesTableAsync />
            </Suspense>
          </div>
          
          <Suspense fallback={
             <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
         
              placeholder="Загрузка..."
              className={`w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded-lg focus:outline-none hover:border-gray-300 hover:shadow-md transition duration-300 ease-in-out`}
            
            />
            
          </div>
         <Button
className="px-6 py- disabled:opacity-50 items-center gap-2 hidden md:flex"
>
              Поиск


</Button>
        </div>
        
      </div>}>
          <SearchBar />
          </Suspense>
          
          <div className="flex flex-row gap-2 items-center">
            <FavoruteHeader />
            <CartHeader />
            <UserElement />
          </div>
        </div>
      </header>
    </>
  );
}

// Отдельный async компонент для загрузки категорий
async function CategoriesTableAsync() {
  const categories = await getCategories();
  return <CategoriesTable categories={categories} />;
}