import { Eye, Heart, ShoppingCart, MapPin, MapPinned, Grid3x3, Building2, TextSelect  } from "lucide-react";
import Map from "./map";
import CategoriesTable from "../categories-table-user-2";
import { getRandomProductsFast, getProducts } from "@/lib/actions/product";
import ProductCard from "./product-card-full";
import Link from "next/link";
import { getProductImages } from "@/lib/actions/image-actions";
import UserGreetingHome from "./user-greeting-home";
import { getAverageRatingByProductId } from "@/lib/actions/reviews";
import { getCategories } from "@/lib/actions/product-categories";
export default async function HomePage () {
const [categories, {productsWithDetails, images} ] = await Promise.all([getCategories(), getRandomProductsFast(

)]);
const productsWithDetailAndImages = productsWithDetails?.map(product => {
  // Находим картинки, которые принадлежат текущему продукту
  const productImages = images?.filter(img => img.productId === product.id) || [];
  
  return {
    ...product,
    images: productImages,
  };
});
    return (
      
        <div className=" min-h-screen mx-auto  xl:max-w-[1400px] lg:max-w-[1000px]  text-black">
          <div className=" absolute z-10 hidden lg:flex"><CategoriesTable categories={categories} /></div>
          <div className="lg:ml-81 ml-0 overflow-hidden md:pt-10 lg:pt-5 pt-4 flex flex-col gap-7  md:px-10">
          
          <div className="flex overflow-x-auto gap-4 px-4 md:px-0 snap-x snap-mandatory " style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
  <div className="min-w-[80vw] md:min-w-[40vw] lg:min-w-[20vw] md:w-full xl:w-[30%] xl:min-w-0 bg-blue-100 rounded-xl shadow py-4 pl-4 snap-center flex-col flex lg:hidden gap-10 relative  overflow-hidden">
   <div className="flex flex-col"><h3 className="text-lg xl:text-xl font-semibold ">Как нас найти</h3>
    <p className="text-gray-600 text-sm xl:text-base ">Контент первой карточки</p>
    </div> 
    <div><button className="bg-white rounded-lg   text-sm border border-gray-300 py-2 px-3 xl:text-base">Показать на карте</button>
    </div>
    <div className="absolute -bottom-4 -right-5 text-blue-500/50">
    <MapPinned className="w-30 h-30" />
    </div>
  </div>
  
   <UserGreetingHome />
    <Link href="/categories" className="w-[20%] xl:flex hidden bg-green-100/50 rounded-xl shadow py-4  px-3 flex-col gap-6 relative overflow-hidden">
    <div className="flex flex-col">
      <h3 className="text-base font-semibold xl:text-xl">Каталог</h3>
      <p className="text-gray-600 text-sm xl:text-base">Все товары</p>
    </div>
    <div className="absolute -bottom-3 -right-3 text-green-500/50">
      <TextSelect className="w-20 h-20" />
    </div>
  </Link>
   <div className="flex-1 bg-purple-100 hidden  rounded-xl shadow py-4 pl-4 pr-2 xl:flex flex-col items-between justify-between gap-2 relative overflow-hidden">
    <div className="flex flex-col ">
      <h3 className="text-base font-semibold xl:text-xl">Производители</h3>
      <p className="text-gray-600 text-sm xl:text-base">Популярные бренды</p>
    </div>
    <Link href="/manufacturers" className="bg-white rounded-lg text-sm border border-gray-300 py-2 px-3 w-fit xl:text-base">
      Смотреть все
    </Link>
    <div className="absolute -bottom-4 -right-4 text-purple-500/50">
      <Building2 className="w-24 h-24" />
    </div>
  </div>
</div>
<div className="flex gap-4 xl:hidden px-4 md:px-0 ">
  {/* Карточка Каталог */}
  <div className="w-[35%] bg-green-100/50 rounded-xl shadow py-4 px-3 flex flex-col gap-6 relative overflow-hidden">
    <div className="flex flex-col">
      <h3 className="md:text-lg text-base font-semibold">Каталог</h3>
      <p className="text-gray-600 text-sm">Все товары</p>
    </div>
    <div className="absolute -bottom-3 -right-3 text-green-500/50">
      <TextSelect className="w-20 h-20" />
    </div>
  </div>
  
  {/* Карточка Производители */}
  <div className="flex-1 bg-purple-100 rounded-xl shadow py-4 pl-4 pr-2 flex flex-col gap-6 relative overflow-hidden">
    <div className="flex flex-col">
      <h3 className="md:text-lg text-base font-semibold">Производители</h3>
      <p className="text-gray-600 text-sm">Популярные бренды</p>
    </div>
    <Link href="/manufacturers" className="bg-white rounded-lg text-sm border border-gray-300 py-2 px-3 w-fit">
      Смотреть все
    </Link>
    <div className="absolute -bottom-4 -right-4 text-purple-500/50">
      <Building2 className="w-24 h-24" />
    </div>
  </div>
</div>
         <div className="bg-white rounded-2xl  p-8 mb-12 overflow-hidden  hidden lg:flex w-full ">
          <div className=" flex-col lg:flex-row gap-8 items-center flex w-full  ">
            <div className="flex flex-col gap-4 max-w-[600px]">
              <h1 className="2xl:text-3xl text-2xl font-bold text-gray-900">
                Все для дома
              </h1>
              <p className="text-base 2xl:text-lg text-gray-600 leading-relaxed">
                Мы предлагаем широкий ассортимент сантехнической продукции: смесители, канализация, полипропилен, фитинги и металлопласт, сшитый полиэтилен, сливные трапы, герметики и другие комплектующие - всё от проверенных производителей. Сможем подсказать по любому вопросу, будь то ремонт в квартире или обустройство нового дома.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-600">Более 5000 товаров</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-600">Гарантия на все</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-600">Консультация специалистов</span>
                </div>
              </div>
            </div>
    <div className="relative w-full h-[400px]   rounded-2xl overflow-hidden">
      <Map />
    </div>
          </div>
        </div>
    
        <div className="w-full">
             {/* Список продуктов */}
             <div className="grid gap-4 items-stretch " 
             style={{
           gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
         }}>
               {productsWithDetailAndImages?.map((product) => (
                 <ProductCard
                   key={product.id}
                   product={product}

                 />
               ))}
             </div>
           </div>
 </div>
 </div>
 
    )
}