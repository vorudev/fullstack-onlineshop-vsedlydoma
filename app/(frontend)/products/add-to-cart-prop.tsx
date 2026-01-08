'use client';
import { useCart } from "@/app/context/cartcontext"; 
import { CheckIcon } from "lucide-react";
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
interface ProductUnited {
   id: string
}



export const AddToCart: React.FC<ProductUnited> = ({  id }) => {
    const { addToCart, cart, removeFromCart, updateQuantity } = useCart();
    
    const cartItem = cart.find((item) => item.id === id);
    const isInCart = cartItem !== undefined;
    const quantity = cartItem?.quantity || 0;

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInCart) {
            updateQuantity(id, quantity + 1);
        } else {
            addToCart(id);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 1) {
            updateQuantity(id, quantity - 1);
        } else if (quantity === 1) {
            removeFromCart(id);
        }
    };

    const handleMainClick = () => {
        if (!isInCart) {
            addToCart(id);
        }
    };

    return (
        <div className="flex items-center w-full xl:min-w-[140px] min-w-[100px] max-w-[140px]">
            {isInCart ? (
                // Состояние: товар в корзине
                <div className="flex items-center w-full rounded-md border border-blue-600 overflow-hidden bg-white">
                    <button
                        onClick={handleDecrement}
                        className="flex-shrink-0 w-8 h-9 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Уменьшить количество"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center px-2 py-2 text-blue-600">
                        <span className="text-sm font-medium">{quantity}</span>
                    </div>
                    
                    <button
                        onClick={handleIncrement}
                        className="flex-shrink-0 w-8 h-9 flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Увеличить количество"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                // Состояние: товар не в корзине
                <button
                    onClick={handleMainClick}
                    className="flex items-center  max-h-[38px] justify-center gap-2 w-full xl:px-4 py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors"
                >
                    <ShoppingCart className="w-4 h-4 hidden xl:block" />
                    <span className="text-[14px]">В корзину</span>
                </button>
            )}
        </div>
    );
};