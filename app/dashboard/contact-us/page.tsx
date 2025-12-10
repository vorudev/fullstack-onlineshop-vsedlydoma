import { AddContactUsPhones } from "@/components/forms/add/add-contact-us-phones";
import {getContactUs} from "@/lib/actions/contact-us";
import AdminContactsPage from "@/app/dashboard/preview/page";
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

export default async function ContactUsPage() {
    const contactUs = await getContactUs();
    const about = await getAboutInfo();

 
    return (
       
           <div className="p-[16px] 
 ">
            
            <AdminContactsPage contactUs={contactUs} about={about} />
           </div>

    );
}