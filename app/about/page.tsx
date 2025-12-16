
import { Star, User, MapPin } from "lucide-react";
import Map from "@/components/frontend/map";
import { getAboutInfo } from "@/lib/actions/about-info";
export default async function AboutPage() {
    const about = await getAboutInfo();
    return (
       <main className=" mx-auto bg-gray-100 lg:min-h-screen  lg:bg-white xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[24px] pr-[12px] pl-[12px] ">
<div className="flex flex-col gap-5">
<div className="p-[16px] bg-white flex-col flex gap-5 rounded-xl ">
<h2 className="text-[20px] md:text-[32px] font-semibold leading-tight">
   {about?.title}
</h2>
<p className="text-[15px] ">
    {about?.description}
</p>
<div className="flex flex-col gap-3">


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
       </div>
       </main>
    );
}