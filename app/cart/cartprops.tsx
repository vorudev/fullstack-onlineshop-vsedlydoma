import React from "react";
import { useCart } from "../context/cartcontext"; // Adjust the import path as necessary
import { useState, useEffect, useCallback } from "react";
import type { CartItem } from "../context/cartcontext";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { getFeaturedImage } from "@/lib/actions/image-actions";
import { ProductImage } from "@/db/schema";
type CartItemProps = {
  item: CartItem;
};

export const CartItemComponent = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [image, setImage] = useState<ProductImage | null>(null);

  const [inputValue, setInputValue] = useState(item.quantity.toString());


  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^\d*$/.test(val)) {
      setInputValue(val);
    }
  }, []);
 


  const handleBlur = useCallback(() => {
    const trimmed = inputValue.trim();

  

    if (trimmed === '' || trimmed === '0') {
      removeFromCart(item.id);
      return;
    }


    const parsed = Number(trimmed);
    if (Number.isInteger(parsed) && parsed > 0) {
      updateQuantity(item.id, parsed);
    } else {
      setInputValue(item.quantity.toString());
    }
  }, [
    inputValue,
    item.id,
    item.quantity,
    updateQuantity,
    removeFromCart
  ]);


  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        (e.target as HTMLInputElement).blur();
      }
    },
    []
  );

  // изменить в продакшене
useEffect(() => {
    const fetchFeaturedImage = async () => {
        const image = await getFeaturedImage(item.id);
        setImage(image);
    };
    fetchFeaturedImage();
}, [item.id]);

  return (
   
   
     
     
        
       
           <li key={item.id} className="flex gap-4 w-full lg:p-4 p-3 bg-white rounded-lg border ">

  <div className="flex flex-col items-between gap-4 lg:gap-0 lg:items-start w-full">
    <div className="flex gap-4 w-full items-start " >
    {/* Image Section */}
    <div className="flex-shrink-0 items-center flex flex-col">
      {image && (
        <div className="relative lg:w-24 lg:h-24 w-18 h-18 bg-gray-50 rounded-md overflow-hidden">
          <Image
            src={image?.imageUrl || ''}
            alt={item.title}
            fill
            className="object-contain w-full h-full"
          />
        </div>
      )}
      <p className="text-gray-400 text-[12px] text-center">{item.sku}</p>
    </div>

    {/* Content Section */}
    <div className="flex-1 flex flex-col gap-3 py-2">
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-base lg:font-medium text-[16px] cl text-gray-900 flex-1">{item.title}</h2>
        <button 
          className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0" 
          onClick={() => removeFromCart(item.id)}
          aria-label="Удалить товар"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className=" justify-between items-center hidden lg:flex">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-16 border text-black border-gray-300 rounded-md px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition duration-300 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">шт</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">{item.price.toFixed(2)} руб</p>
      </div> 
    </div>
    </div>  
    <div className="flex gap-4 justify-between items-center lg:hidden">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-16 border text-black border-gray-300 rounded-md px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition duration-300 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">шт</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">{item.price.toFixed(2)} руб</p>
      </div>   
  </div>
</li>
        
  );
};

export default CartItemComponent; 