'use client'

import Image from "next/image";

interface ContactUsPageProps {
    contactUs: {
    clientInfo: {
        id: string;
        phone: string;
        src: string;
        link: string;
        contactUsId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    contactUsTelephones: {
        id: string;
        phone: string;
        contactUsId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    id: string;
    title: string;
    description: string;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null
}


export default function ContactUsPage({ contactUs }: ContactUsPageProps) {
    return (
         <main className="min-h-screen mx-auto bg-gray-100 lg:bg-white xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[24px] pr-[12px] pl-[12px] pb-30">
<div className="flex flex-col gap-5">
<h1 className="text-[24px] font-semibold lg:pl-[16px]">Контакты</h1>
<div className="p-[16px] bg-white flex-col flex gap-5 rounded-xl ">
<h2 className="text-[20px] md:text-[32px] font-semibold leading-tight">
{contactUs?.title}
</h2>
<p className="text-[15px] ">
    {contactUs?.description}
</p>
<div className="flex flex-col gap-3">
<div className="flex flex-row items-center gap-4">
<h2 className="text-[20px] font-semibold">
  Наш телефон
</h2>
</div>


 <ul className=" list-disc flex flex-col gap-2 pl-4">
    {contactUs?.contactUsTelephones.map((telephone) => (
        <li key={telephone.id} className="text-[14px] " ><button onClick={() => window.location.href = 'tel:' + telephone.phone}>{telephone.phone}</button></li>
    ))}
           
 </ul>

</div>
<div className="flex flex-col gap-3">
<div className="flex flex-row items-center gap-4">
<h2 className="text-[20px] font-semibold">
    Наши соцсети
</h2>
</div>


 <ul className=" flex flex-col gap-2 ">

    {contactUs?.clientInfo.map((clientInfo) => (
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
   ))}
       <li >
   <a 
   href="https://viber.com/ru/"
   className="flex items-center gap-2 flex-row"
    target="_blank">
    <div className="relative h-[24px] w-[24px]">
    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png" alt="WhatsApp" width={24} height={24}/>
    </div>
    <p className="text-[14px] ">+7 (999) 999-99-99</p>
    </a>
   </li>
   <li>
   <a 
   href="https://viber.com/ru/"
   className="flex items-center gap-2 flex-row"
    target="_blank">
    <div className="relative h-[24px] w-[24px]">
    <Image src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Instagram" width={24} height={24}/>
    </div>
    <p className="text-[14px] ">+7 (999) 999-99-99</p>
    </a>
   </li>
   <li>
   <a 
   href="https://viber.com/ru/"
   className="flex items-center gap-2 flex-row"
    target="_blank">
    <div className="relative h-[24px] w-[24px]">
    <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dbOUeCrOBe-mkfGD-fEjQNECJrkromWTYg&s" alt="Telegram" width={24} height={24}/>
    </div>
    <p className="text-[14px] ">+7 (999) 999-99-99</p>
    </a>
   </li>
           
 </ul>

</div>
</div>

</div>
       </main>
    );
}