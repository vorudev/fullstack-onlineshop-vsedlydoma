import { AddAboutInfo } from "@/components/forms/add-about-info";
import {getAboutInfo} from "@/lib/actions/about-info";
import { Pencil, Plus, User, MapPin } from "lucide-react";
import { AddAboutClientInfo } from "@/components/forms/add-about-client-info";
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
import { Button } from "@/components/ui/button";


export default async function AboutPage() {
    const about = await getAboutInfo();

 
    return (
       
           <div className="p-[16px] 
 ">
            <div className="flex flex-row items-center gap-4">
<h1 className="text-[20px] font-semibold">Информация о нас</h1>
        <Dialog>
            <DialogTrigger><Button>Изменить <Pencil className="w-4 h-4"/></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить информацио о нас</DialogTitle>
                </DialogHeader>
                <AddAboutInfo about={about} />
            </DialogContent>
        </Dialog>
        </div>
            <div >
              <div className="flex flex-col mt-10 bg-white text-black rounded-xl gap-5 " >
<div className="p-[16px] 
 flex-col flex gap-5 rounded-xl ">
<h2 className="text-[20px] md:text-[32px] font-semibold leading-tight">
   {about?.title}
</h2>
<p className="text-[15px] ">
    {about?.description}
</p>
<div className="flex flex-col gap-3">
<div className="flex flex-row items-center gap-4">
<User className="w-6 h-6 text-blue-600" /> 
<h2 className="text-[20px] font-semibold">
    Для клиентов
</h2>
<Dialog>
                        <DialogTrigger className="cursor-pointer"><Plus className="w-4 h-4"/></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Добавить информацию для клиентов</DialogTitle>
                            </DialogHeader>
                            <AddAboutClientInfo clientInfo={null} aboutId={about?.id || ""} />
                        </DialogContent>
                    </Dialog>
</div>


 <ul className=" list-disc flex flex-col gap-2 pl-4">
    {about?.clientInfo.map((clientInfo) => (
        <div key={clientInfo.id} className="flex flex-row gap-2 ">
        <li className="text-[14px] ">{clientInfo.info}</li>
        <Dialog>
                        <DialogTrigger className="cursor-pointer"> <Pencil className="w-3 h-3" /></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Изменить информацию для клиентов</DialogTitle>
                            </DialogHeader>
                            <AddAboutClientInfo clientInfo={clientInfo} aboutId={about?.id || ""} />
                        </DialogContent>
                    </Dialog>
        </div>
    ))}
 </ul>

</div>
<div className="flex flex-col gap-3">
    <h2 className="text-[20px] font-semibold">Домашняя страница</h2>
<p className="text-[15px] ">
    {about?.home}
</p>
</div>
</div>

</div>
                
            
            </div>
           </div>

    );
}