'use client';
import { useFavorite } from "@/app/context/favoritecontext";
import {Heart, CheckIcon} from "lucide-react"
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
export const AddToFavorite: React.FC<ProductUnited> = ({ product }) => {
    const { addToFavorite, favorite, removeFromFavorite } = useFavorite();
    const toggleFavorite = (product: ProductUnited['product']) => {
        if (isInFavorite) {
          removeFromFavorite(product.id);
        } else {
          addToFavorite(product.id);
        }
      };
    const isInFavorite = favorite.some((item) => item.id === product.id)
    return (
        <button
            className={` lg:w-full bg-gray-100 p-1 cursor-pointer rounded-md lg:bg-white `}
            onClick={() => toggleFavorite(product)}
        >
            {isInFavorite ?  <Heart className="lg:w-6 lg:h-6 w-5 h-5 text-red-500 fill-red-500" /> : <Heart className="lg:w-6 lg:h-6 w-5 h-5 text-gray-500" />}
        </button>
    );
}

