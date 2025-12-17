import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
import { Metadata } from "next";
import { getContactUs } from "@/lib/actions/contact-us";
export const metadata: Metadata = {
    title: "О нашем магазине",
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
export default async function AboutLayout({ children }: { children: React.ReactNode }) {
    const contacts = await getContactUs()
    return (
        <>
   <main className="bg-gray-100 lg:bg-white  "> 
            <Header contacts={contacts} />

            <NavMenuMobile />
        {children}
            <Footer contacts={contacts} />
               </main>
        </>
    );
}
