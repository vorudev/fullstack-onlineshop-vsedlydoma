'use client';
import { useFavorite } from "@/app/context/favoritecontext";
import {Heart} from "lucide-react"
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
    const { addToFavorite, favorite } = useFavorite();
    const isInFavorite = favorite.some((item) => item.product.id === product.id)
    return (
        <button
            className={` lg:w-full bg-gray-100 p-2 rounded-xl lg:bg-white ${isInFavorite ? "" : "cursor-pointer"}`}
            onClick={() => addToFavorite(product)}
            disabled={isInFavorite}
        >
            {isInFavorite ?  <Heart className="lg:w-6 lg:h-6 w-4 h-4 text-red-500" /> : <Heart className="lg:w-6 lg:h-6 w-4 h-4 text-gray-500" />}
        </button>
    );
}

