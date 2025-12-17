import { AddContactUsPhones } from "@/components/forms/add/add-contact-us-phones";
import {getContactUs} from "@/lib/actions/contact-us";
import AdminContactsPage from "@/app/dashboard/contact-us/client-contacts";
import { AddContactUsTelephone } from "@/components/forms/add/add-contact-us-telephones";
import { Pencil, Plus, User, MapPin } from "lucide-react";
import { AddContactUsInfo } from "@/components/forms/add/add-contact-us-info";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {About} from "@/db/schema";
import {getAboutInfo} from "@/lib/actions/about-info";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getPrivacyPolicy } from "@/lib/actions/law-actions";
import { getTermsOfService } from "@/lib/actions/law-actions";
import { Metadata } from "next";
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
export default async function ContactUsPage() {
    const[contactUs, about, privacyPolicy, termsOfService] = await Promise.all([
        getContactUs(),
        getAboutInfo(),
        getPrivacyPolicy(),
        getTermsOfService(),
    ]);

 
    return (
       
           <div className="p-[16px] 
 ">
            
            <AdminContactsPage contactUs={contactUs} about={about} privacyPolicy={privacyPolicy} termsOfService={termsOfService} />
           </div>

    );
}