import { Eye, Heart, ShoppingCart, MapPin, MapPinned, Grid3x3, Building2, TextSelect  } from "lucide-react";
import Map from "./map";
import CategoriesTable from "../categories-table-user-2";
import { getRandomProductsFast, getProducts } from "@/lib/actions/product";
import ProductCard from "./product-card";
import { getAverageRatingByProductId } from "@/lib/actions/reviews";
import { getCategories } from "@/lib/actions/product-categories";
import { get } from "http";
export default async function HomePage () {
const [categories, products ] = await Promise.all([getCategories(), getRandomProductsFast(

)]);
console.log(products);
    return (
        <div className=" min-h-screen mx-auto md:pt-10 pt-4  xl:max-w-[1400px] lg:max-w-[1000px] flex flex-col gap-7  md:px-10 text-black">
          <div className="flex overflow-x-auto gap-4 px-4 md:px-0 snap-x snap-mandatory">
  <div className="min-w-[80vw] md:min-w-[40vw] lg:min-w-[20vw] md:w-full xl:w-[30%] xl:min-w-0 bg-blue-100 rounded-xl shadow py-4 pl-4 snap-center flex-col flex gap-10 relative  overflow-hidden">
   <div className="flex flex-col"><h3 className="text-lg xl:text-xl font-semibold ">Как нас найти</h3>
    <p className="text-gray-600 text-sm xl:text-base ">Контент первой карточки</p>
    </div> 
    <div><button className="bg-white rounded-lg   text-sm border border-gray-300 py-2 px-3 xl:text-base">Показать на карте</button>
    </div>
    <div className="absolute -bottom-4 -right-5 text-blue-500/50">
    <MapPinned className="w-30 h-30" />
    </div>
  </div>
  
  <div className="min-w-[80vw] md:min-w-[40vw] md:w-full xl:w-[30%] xl:min-w-0 bg-blue-100 rounded-xl shadow py-4 pl-4 snap-center flex-col flex gap-10 relative  overflow-hidden">
<div className="flex flex-col"><h3 className="text-lg xl:text-xl font-semibold ">Личный кабинет</h3>
    <p className="text-gray-600 text-sm xl:text-base">Отслеживайте свои заказы</p>
    </div> 
    <div className="flex flex-row gap-2"><button className="bg-white rounded-lg  text-sm border border-gray-300 py-2 px-3 xl:text-base">Войти</button>
<button className="bg-white rounded-lg  text-sm border border-gray-300 py-2 px-3 xl:text-base">Мои заказы</button>
    </div>
    <div className="absolute -bottom-4 -right-5 text-blue-500/50">
    <ShoppingCart className="w-30 h-30" /> 
    </div>
  </div>
    <div className="w-[10%] xl:flex hidden bg-green-100/50 rounded-xl shadow py-4  px-3 flex-col gap-6 relative overflow-hidden">
    <div className="flex flex-col">
      <h3 className="text-base font-semibold xl:text-xl">Каталог</h3>
      <p className="text-gray-600 text-sm xl:text-base">Все товары</p>
    </div>
    <div className="absolute -bottom-3 -right-3 text-green-500/50">
      <TextSelect className="w-20 h-20" />
    </div>
  </div>
   <div className="flex-1 bg-purple-100 hidden  rounded-xl shadow py-4 pl-4 pr-2 xl:flex flex-col gap-10 relative overflow-hidden">
    <div className="flex flex-col">
      <h3 className="text-base font-semibold xl:text-xl">Производители</h3>
      <p className="text-gray-600 text-sm xl:text-base">Популярные бренды</p>
    </div>
    <button className="bg-white rounded-lg text-sm border border-gray-300 py-2 px-3 w-fit xl:text-base">
      Смотреть все
    </button>
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
    <button className="bg-white rounded-lg text-sm border border-gray-300 py-2 px-3 w-fit">
      Смотреть все
    </button>
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
        <div className="flex flex-row gap-3">
          <div className=" absolute z-10 hidden lg:flex"><CategoriesTable categories={categories} /></div>
       <div className="grid grid-cols-1 lg:ml-81  md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Карточка 1 */}
          
          
 { products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}

            
          
          </div>
        </div>
        </div>
    )
}