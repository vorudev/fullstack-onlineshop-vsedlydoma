'use client';
import { useFavorite } from "@/app/context/favoritecontext";
import {Heart, CheckIcon} from "lucide-react"
interface ProductUnited {
   id: string
}
export const AddToFavorite: React.FC<ProductUnited> = ({ id }) => {
    const { addToFavorite, favorite, removeFromFavorite } = useFavorite();
    const toggleFavorite = (id: string) => {
        if (isInFavorite) {
          removeFromFavorite(id);
        } else {
          addToFavorite(id);
        }
      };
    const isInFavorite = favorite.some((item) => item.id === id)
    return (
        <button
            className={` lg:w-full cursor-pointer rounded-md lg:bg-white `}
            onClick={() => toggleFavorite(id)}
        >
            {isInFavorite ?  <Heart className="lg:w-6 lg:h-6 w-5 h-5 text-red-500 fill-red-500" /> : <Heart className="lg:w-6 lg:h-6 w-5 h-5 text-gray-500" />}
        </button>
    );
}

