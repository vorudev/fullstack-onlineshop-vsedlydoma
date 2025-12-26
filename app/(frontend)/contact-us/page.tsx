import { Metadata } from "next";
import ContactUsPage from "./client";
import { getContactUs } from "@/lib/actions/contact-us";
import { Suspense } from "react";
import ContactUsSkeleton from "@/components/frontend/skeletons/contact-us-telephone";
export const metadata: Metadata = {
    title: "Связаться с нами",
    description: "Свяжитесь с нами для получения консультации или заказа товаров. Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
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
  export default function ContactUsPageLoyaout() {
    return (
      
          <Suspense fallback={<ContactUsSkeleton />}>
            <ContactUsContentWrapper />
          </Suspense>

    );
  }
async function ContactUsContentWrapper() {
    const contactUs = await getContactUs();
  
    if (!contactUs) {
      return (
        <div className="p-[16px] bg-white rounded-xl text-center py-8">
          <p className="text-gray-600">Контактная информация не найдена</p>
        </div>
      );
    }
  
    return  <div className="bg-white"><ContactUsPage contactUs={contactUs} /> </div>;
  }
  