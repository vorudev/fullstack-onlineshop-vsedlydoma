
'use client';
import { useFavorite } from "@/app/context/favoritecontext";
import FavoritePage from "./favorite-client";

export default function Page() {
    const { favorite } = useFavorite();
    return (
        <div className="text-black bg-gray-100">
            <FavoritePage />
        </div>
    );
}
