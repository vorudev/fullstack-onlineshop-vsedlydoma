'use client';
import { useCart } from "@/app/context/cartcontext"; 
import { ShoppingCart } from "lucide-react";
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
    const { addToCart, cart } = useCart();
    
   
    
    const isInCart = cart.some((item) => item.product.id === product.id);
    
    return (
        <button
        className={` lg:px-3 px-2 bg-blue-600 lg:min-w-[140px] text-[14px] lg:text-[16px] font-semibold lg:py-3 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${isInCart ? "bg-white text-blue-600 border border-blue-600" : "cursor-pointer text-white hover:bg-blue-700  "}`}
        onClick={() => addToCart(product)}
        disabled={isInCart}
        >
       {<ShoppingCart className="lg:w-6 lg:h-6 w-4 h-4" />} <span className="text-[14px] lg:text-[16px]">{isInCart ? "В корзине" : ` Купить`}</span>
        </button>
    );
 } 