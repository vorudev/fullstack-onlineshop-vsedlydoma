import React from "react";
import { useCart } from "./context/cartcontext"; // Adjust the import path as necessary
import { useState, useEffect, useCallback } from "react";
import type { CartItem } from "./context/cartcontext";
import Image from "next/image";
type CartItemProps = {
  item: CartItem;
};

export const CartItemComponent = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

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

  return (
   
   
     
     
        
       
            <li key={item.id} className="flex-row flex gap-[16px] h-[154px] lg:py-[12px] py-[10px]">

                
                <div className="flex flex-col justify-between items-start lg:w-[256px] w-full">
<div className="flex-col flex">
    <h1 className="md:text-[12px] text-[11px] bdog uppercase">{item.title}</h1>
    <p className="md:text-[12px] text-[11px] bdog uppercase">$ {item.price} USD</p>
    </div>
                <button className="md:text-[12px] text-[11px] bdog uppercase text-[rgb(133,112,106)] cursor-pointer" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
                <div>
                     <input
          type="number"
          min={1}
          value={inputValue}
           onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="border h-[38px] w-[60px] pt-2 pb-2 pl-3 pr-1.5 text-[12px] cursor-text focus:outline-none"
        />
                </div>
               </li>
        
  );
};

export default CartItemComponent; 