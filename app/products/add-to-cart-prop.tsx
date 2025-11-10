'use client';
import { useCart } from "@/app/context/cartcontext"; 
import { ShoppingCart } from "lucide-react";
interface AddToCartProps {
id: string;
price: number;
title: string;
sku: string | null;
slug: string;
 } 
export const AddToCart: React.FC<AddToCartProps> = ({ id, price, title, sku, slug }) => {
    const { addToCart, cart } = useCart();
    const product = {
        id,
        title,
        price,
        sku,
        slug

    };
    
    const isInCart = cart.some((item) => item.id === product.id);
    
    return (
        <button
        className={` px-3 bg-blue-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${isInCart ? "bg-white text-blue-600 border border-blue-600" : "cursor-pointer text-white hover:bg-blue-700  "}`}
        onClick={() => addToCart(product)}
        disabled={isInCart}
        >
       {<ShoppingCart className="w-6 h-6" />} {isInCart ? "В корзине" : ` Купить`}
        </button>
    );
 } 