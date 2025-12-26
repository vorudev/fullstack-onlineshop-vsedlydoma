import { useCart } from "@/app/context/cartcontext";
import {useFavorite} from "@/app/context/favoritecontext";
import Image from "next/image";
import { useState } from "react";
import {Heart, Minus, Plus, ShoppingCart} from "lucide-react";
import { Star } from "lucide-react";
interface  Product{
  product: {
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    isActive: boolean | null;
    slug: string;
    title: string;
    priceRegional: number | null;
    description: string;
    keywords: string | null;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
} 
  productImages: {
    id: string;
    productId: string;
    imageUrl: string;
    storageType: string;
    storageKey: string | null;
    order: number | null;
    isFeatured: boolean | null;
    createdAt: Date | null;
}[]
reviews: {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  status: string;
  author_name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}[]
attributes: {
  id: string;
  productId: string;
  name: string;
  value: string;
  order: number | null;
  slug: string;
  createdAt: Date | null;
}[]
manufacturer: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
manufacturerImages: {
  id: string;
  manufacturerId: string;
  imageUrl: string;
  storageType: string;
  storageKey: string | null;
  order: number | null;
  isFeatured: boolean | null;
  createdAt: Date | null;
}[]
internals: { 
  slug: string;
  currentLimit: number;
}
stats: {
  averageRating: number;
  totalCount: number;
  ratingDistribution: any;
}
}

export default function DesktopSection({product, manufacturer, manufacturerImages, reviews, attributes, stats }: Product) {
    const {addToCart, cart, removeFromCart, updateQuantity} = useCart();
    const {addToFavorite, favorite, removeFromFavorite} = useFavorite();
    const [maxVisible] = useState(8);
   const isInCart = cart.some((item) => item.id === product.id);
      const isInFavorite = favorite.some((item) => item.id === product.id);
      const cartItem = cart.find((item) => item.id === product.id);
    const visibleAttributes = attributes.slice(0, maxVisible) || [];
  const hasMore = attributes.length > maxVisible;
    const scrollToComponent = () => {
    const element = document.getElementById('target-component');
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  const toggleFavorite = (product: Product['product']) => {
    if (isInFavorite) {
      removeFromFavorite(product.id); // или product, зависит от вашей реализации
    } else {
      addToFavorite(product.id);
    }
  };
  const toggleCart = (product: Product['product']) => {
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product.id);
    }
  };
  const quantity = cartItem?.quantity || 0;

  const handleIncrement = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isInCart) {
          updateQuantity(product.id, quantity + 1);
      } else {
          addToCart(product.id);
      }
  };

  const handleDecrement = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (quantity > 1) {
          updateQuantity(product.id, quantity - 1);
      } else if (quantity === 1) {
          removeFromCart(product.id);
      }
  };

  const handleMainClick = () => {
      if (!isInCart) {
          addToCart(product.id);
      }
  };

    return (
        <div className="lg:flex lg:flex-col  items-start hidden justify-start gap-[12px] w-full  ">
           
      <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col max-w-[60%]">
           <h1 className="text-[20px] text-gray-900  font-semibold leading-tight  ">{product?.title}</h1>
           <p className="text-[12px] text-gray-600 ">Код товара {product?.sku}</p>
           </div>
        
           {manufacturer && manufacturerImages?.length > 0 && (
  <div className="relative w-[90px] h-[40px]">
    <Image 
      src={manufacturerImages[0]?.imageUrl} 
      alt="Product" 
      fill 
      className="object-contain" 
    />
  </div>
)}
      </div>
      
      
      
      <div className="flex flex-row gap-1  items-center ">
                  <Star className="w-[16px] h-[16px] text-yellow-300" fill="#FFD700"/>
                  <p className="text-[16px] text-gray-900 font-semibold">{stats.averageRating.toFixed(2)} </p>
                  <p className="text-[16px] text-gray-600 pl-[6px]">{stats.totalCount} отзыва</p> 
       </div>
       <div className="flex flex-col gap-3 xl:hidden  items-start">
        <div className="flex flex-col items-start  gap-2">
          
         {product?.inStock === 'В наличии' ?  <div className="flex flex-col "> 

        <div className={`${product?.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-1 rounded-md self-start`}>
    <p className={`text-[12px] text-gray-600 ${product?.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>{product?.inStock}</p>
    </div>
      <h2 className="text-[28px] text-gray-900 font-semibold">
{product?.priceRegional ? `${product?.priceRegional.toFixed(2)} руб` : "Цена не указана"}
        </h2>
        </div> :  <div className={`${product?.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-2 rounded-md self-start`}>
    <p className={`text-[16px] text-gray-600  font-semibold ${product?.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>Уточните наличие</p>
    </div>}
        </div>
       <div className="flex flex-col gap-2 items-center w-full">
          
       <div className="flex items-center w-full xl:min-w-[140px] min-w-[100px] ">
            {isInCart ? (
                // Состояние: товар в корзине
                <div className="flex items-center w-full rounded-md border border-blue-600 overflow-hidden bg-white">
                    <button
                        onClick={handleDecrement}
                        className="flex-shrink-0 w-8 h-10 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Уменьшить количество"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center px-2 py-3.5 text-blue-600">
                        <span className="text-sm font-medium">{quantity}</span>
                    </div>
                    
                    <button
                        onClick={handleIncrement}
                        className="flex-shrink-0 w-8 h-10 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Увеличить количество"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                // Состояние: товар не в корзине
                <button
                    onClick={handleMainClick}
                    className="flex items-center justify-center gap-2 w-full xl:px-4 py-3 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors"
                >
                    <ShoppingCart className="w-4 h-4 hidden xl:block" />
                    <span>В корзину</span>
                </button>
            )}
        </div>
          <button className="bg-white border-2 border-gray-200 cursor-pointer flex items-center gap-2 text-gray-700 p-3 rounded-[8px]"
 onClick={() =>  toggleFavorite(product)}
          >
            <Heart className={isInFavorite ? 'w-[20px] h-[20px] text-red-600 fill-red-600' : 'w-[20px] h-[20px]'} /> {isInFavorite ? 'В избранном' : 'В избранное'}
          </button>
        </div>
      </div>
       <div className="flex flex-row w-full justify-between  ">
       <div className="flex flex-col gap-3 hidden xl:block ">
      <h2 className="text-sm text-gray-900 font-semibold mb-3">
        Характеристики:
      </h2>
      {attributes.length > 0 ? (
      <div className="max-w-[150px]">
        <div className="">
           {visibleAttributes.map((attr, index) => (
            <div
              key={attr.id || attr.slug || index}
              className="grid grid-cols-[minmax(150px,1fr)_minmax(100px,1fr)] text-[14px]  gap-3 py-1"
            >
              <div className="text-gray-500 font-medium break-words">
                {attr.name || 'Не указано'}
              </div>
              <div className="text-black text-start text-right break-words">
                {attr.value || '—'}
              </div>
            </div>
          ))} 
          {hasMore && (
            <button
             className="text-blue-600 font-semibold cursor-pointer text-[14px]"
             onClick={scrollToComponent}
             >
              Показать все
            </button>
          )}
        </div>
      </div>
       ) : (
      <p className="text-[14px] text-gray-600">Характеристики отсутствуют</p>
     )}
     </div>
    
    
      <div className="xl:flex hidden  flex-col gap-3 items-end">
        <div className="flex flex-col items-end gap-2">
          
          {product?.inStock === 'В наличии' ?  <div className="flex flex-col "> 

        <div className={product?.inStock === 'В наличии' ? 'flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-[6px]' : 'flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-[6px]'}>
            <div className={product?.inStock === 'В наличии' ? 'w-2 h-2 bg-green-500 rounded-full' : 'w-2 h-2 bg-red-500 rounded-full'}></div>
            <span className={product?.inStock === 'В наличии' ? 'text-green-700' : 'text-red-700'}>{product?.inStock}</span>
          </div>
      <h2 className="text-[28px] text-gray-900 font-semibold">
{product?.priceRegional ? `${product?.priceRegional.toFixed(2)} руб` : "Цена не указана"}
        </h2>
        </div> :  <div className={`${product?.inStock === 'В наличии' ? 'bg-green-600/20' : 'bg-red-600/20'} text-white px-2 py-2 rounded-md self-start`}>
    <p className={`text-[16px] text-gray-600  font-semibold ${product?.inStock === 'В наличии' ? 'text-green-600' : 'text-red-600'}`}>Уточните наличие</p>
    </div>}
        </div>
        <div className="flex flex-col gap-2 items-center w-full">
          
        <div className="flex items-center w-full xl:min-w-[140px] min-w-[100px] ">
            {isInCart ? (
                // Состояние: товар в корзине
                <div className="flex items-center w-full rounded-md border border-blue-600 overflow-hidden bg-white">
                    <button
                        onClick={handleDecrement}
                        className="flex-shrink-0 w-8 h-10 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Уменьшить количество"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center px-2 py-3.5 text-blue-600">
                        <span className="text-sm font-medium">{quantity}</span>
                    </div>
                    
                    <button
                        onClick={handleIncrement}
                        className="flex-shrink-0 w-8 h-10 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Увеличить количество"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                // Состояние: товар не в корзине
                <button
                    onClick={handleMainClick}
                    className="flex items-center justify-center gap-2 w-full xl:px-4 py-3 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors"
                >
                    <ShoppingCart className="w-4 h-4 hidden xl:block" />
                    <span>В корзину</span>
                </button>
            )}
        </div>
          <button
          onClick={() =>  toggleFavorite(product)}
          className={`bg-white  border-2 w-full cursor-pointer hover:bg-gray-100 transition  border-gray-200 flex items-center justify-center gap-2 text-gray-700 p-3 rounded-[8px]`}>
            <Heart className={`w-[20px] h-[20px] ${isInFavorite ? 'fill-red-500 text-red-500' : '' }`} />  { isInFavorite ? 'В избранном' : 'В избранное' }
          </button>
        </div>
      </div>
       </div>
              </div>
    );
}