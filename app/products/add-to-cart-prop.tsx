'use client';
import { useCart } from "@/app/context/cartcontext"; 
import { ShoppingCart } from "lucide-react";
import { CheckIcon } from "lucide-react";
interface ProductUnited {
   
  product: {
    averageRating: number;
    reviewCount: number;
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    slug: string;
    title: string;
    description: string;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[]
}
}
export const AddToCart: React.FC<ProductUnited> = ({ product }) => {
    const { addToCart, cart, removeFromCart } = useCart();
    const toggleCart = (product: ProductUnited['product']) => {
        if (isInCart) {
          removeFromCart(product.id);
        } else {
          addToCart(product);
        }
      };
   
    
    const isInCart = cart.some((item) => item.product.id === product.id);
    
    return (
        <button onClick={() => toggleCart(product)} className={`flex cursor-pointer w-full min-w-[140px] max-w-[140px] items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${isInCart ? 'bg-white border-blue-600  text-blue-600 ' : 'bg-blue-600 hover:bg-blue-700 text-white '}`}>
        {isInCart ? 'В корзине' : 'В корзину'}
       </button>
    );
 } 