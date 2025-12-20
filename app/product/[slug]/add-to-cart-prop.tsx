'use client';
import { useCart } from "../../context/cartcontext"; 


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
    
    const isInCart = cart.some((item) => item.id === product.id);
    
    return (
        <button
        className={`bg-[rgb(35,25,22)] text-[rgb(228,224,212)] w-full h-[48px] bdog text-[12px] uppercase  ${isInCart ? "" : "cursor-pointer"}`}
        onClick={() => addToCart(product.id)}
        disabled={isInCart}
        >
        {isInCart ? "In Cart" : "Add to Cart"}
        </button>
    );
 } 

    
    

    
    