
import { Star, User, MapPin } from "lucide-react";
import Map from "@/components/frontend/map";
import { getAboutInfo } from "@/lib/actions/about-info";
export default async function AboutPage() {
    const about = await getAboutInfo();
    return (
       <main className="min-h-screen mx-auto bg-gray-100 lg:bg-white xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[24px] pr-[12px] pl-[12px] pb-30">
<div className="flex flex-col gap-5">
<h1 className="text-[24px] font-semibold lg:pl-[16px]">О компании</h1>
<div className="p-[16px] bg-white flex-col flex gap-5 rounded-xl ">
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
</div>


 <ul className=" list-disc flex flex-col gap-2 pl-4">
   {about?.clientInfo.map((clientInfo) => (
        <li key={clientInfo.id} className="text-[14px] ">{clientInfo.info}</li>
    ))}
 </ul>

</div>
<div className="flex flex-row gap-4 items-center ">
<MapPin className="w-6 h-6 text-blue-600" /> 
<h2 className="text-[20px] font-semibold">
    Мы на картах
</h2>  
</div>
<div className="relative w-full h-[400px]   rounded-2xl overflow-hidden">
<Map />
</div>
</div>

</div>
       </main>
    );
}