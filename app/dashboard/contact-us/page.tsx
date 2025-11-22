import { AddContactUsPhones } from "@/components/forms/add/add-contact-us-phones";
import {getContactUs} from "@/lib/actions/contact-us";
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
import {notFound} from "next/navigation";
import {Suspense} from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function ContactUsPage() {
    const contactUs = await getContactUs();

 
    return (
       
           <div className="p-[16px] 
 ">
            <div className="flex flex-row items-center gap-4">
<h1 className="text-[20px] font-semibold">Наши контакты</h1>
        <Dialog>
            <DialogTrigger><Button> Изменить <Pencil className="w-4 h-4"/></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить информацио о нас</DialogTitle>
                </DialogHeader>
                <AddContactUsInfo contactUs={contactUs} />
            </DialogContent>
        </Dialog>
        </div>
            <div >
              <div className="flex flex-col bg-white rounded-xl text-black mt-10 gap-5 " >
<div className="p-[16px] 
 flex-col flex gap-5 rounded-xl ">
<h2 className="text-[20px] md:text-[32px] font-semibold leading-tight">
   {contactUs?.title}
</h2>
<p className="text-[15px] ">
    {contactUs?.description}
</p>
<div className="flex flex-col gap-3">
<div className="flex flex-row items-center gap-4">
<User className="w-6 h-6 text-blue-600" /> 
<h2 className="text-[20px] font-semibold">
    Соцсети
</h2>
<Dialog>
                        <DialogTrigger className="cursor-pointer"><Plus className="w-4 h-4"/></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Добавить информацию для клиентов</DialogTitle>
                            </DialogHeader>
                            <AddContactUsPhones contactPhone={null} contactUsId={contactUs?.id || ""} />
                        </DialogContent>
                    </Dialog>
</div>


 <ul className=" list-disc flex flex-col gap-2 pl-4">
    {contactUs?.clientInfo.map((clientInfo) => (
        <div key={clientInfo.id} className="flex flex-row gap-2 ">
       <li key={clientInfo.id} className="flex items-center gap-2 flex-row">
               <a 
               href={clientInfo.link}
                className="flex items-center gap-2 flex-row"
                target="_blank"><div className="relative h-[24px] w-[24px]">
           <Image src={clientInfo.src} alt={clientInfo.phone} width={24} height={24}/>
           </div>
           <p className="text-[14px] ">{clientInfo.phone}</p>
           </a>
          </li>
        <Dialog>
                        <DialogTrigger className="cursor-pointer"> <Pencil className="w-3 h-3" /></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Изменить информацию для клиентов</DialogTitle>
                            </DialogHeader>
                            <AddContactUsPhones contactPhone={clientInfo} contactUsId={contactUs?.id || ""} />
                        </DialogContent>
                    </Dialog>
        </div>
    ))}
 </ul>

</div>
<div className="flex flex-col gap-3">
<div className="flex flex-row items-center gap-4">
<User className="w-6 h-6 text-blue-600" /> 
<h2 className="text-[20px] font-semibold">
    Телефоны
</h2>
<Dialog>
                        <DialogTrigger className="cursor-pointer"><Plus className="w-4 h-4"/></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Добавить телефон</DialogTitle>
                            </DialogHeader>
                            <AddContactUsTelephone contactTelephone={null} contactUsId={contactUs?.id || ""} />
                        </DialogContent>
                    </Dialog>
</div>


 <ul className=" list-disc flex flex-col gap-2 pl-4">
    {contactUs?.contactUsTelephones.map((contactTelephone) => (
        <div key={contactTelephone.id} className="flex flex-row gap-2 ">
        <li className="text-[14px] ">{contactTelephone.phone}</li>
        <Dialog>
                        <DialogTrigger className="cursor-pointer"> <Pencil className="w-3 h-3" /></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Изменить телефон</DialogTitle>
                            </DialogHeader>
                            <AddContactUsTelephone contactTelephone={contactTelephone} contactUsId={contactUs?.id || ""} />
                        </DialogContent>
                    </Dialog>
        </div>
    ))}
 </ul>

</div>

</div>

</div>
                
            
            </div>
           </div>

    );
}