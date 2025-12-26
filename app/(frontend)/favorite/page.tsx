
import { useFavorite } from "@/app/context/favoritecontext";
import FavoritePage from "./favorite-client";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Избранное",
    description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
    keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
    robots: { 
        index: true,
        follow: true, 
        nocache: false,
        googleBot: { 
            index: true, 
            follow: true, 
            "max-snippet": -1, 
            "max-image-preview": "large",
            "max-video-preview": "large"
        }
    }
  };
export default function Page() {
    return (
        <div className="text-black bg-gray-100">
            <FavoritePage />
        </div>
    );
}
