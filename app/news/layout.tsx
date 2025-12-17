import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { Suspense } from "react";
import Footer from "@/components/frontend/footer";
import { getContactUs } from "@/lib/actions/contact-us";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Новости магазина",
  description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
  keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
 
};

export default async function NewsLayout({ children }: { children: React.ReactNode }) {
    const contacts = await getContactUs()
    return (
        <>
      <main className="bg-gray-100 lg:bg-white "> 
               <Header contacts={contacts} />

  
            {children}
    
            <NavMenuMobile />
            <Footer contacts={contacts} />
            </main>
        </>
    );
}
