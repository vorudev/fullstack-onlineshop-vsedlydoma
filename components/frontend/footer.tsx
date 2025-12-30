'use client'
import Link from "next/link";
import Image from "next/image";
interface Props { 
  contacts: {
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
export default function Footer({ contacts }: Props) {

  return (
    <footer className="bg-[#F7F7F8] border-t border-gray-200 px-4 py-6 mb-[52px] lg:mb-0">
      {/* Верхние ссылки */}
      <div className="xl:max-w-[1400px] lg:max-w-[1000px] mx-auto">
      <div className=" grid grid-cols-2 gap-4 text-[15px]">
        <Link href="/categories" className="text-gray-700 seft-start">Каталог</Link>
        <Link href="/manufacturers" className="text-gray-700">Производители</Link>

        <Link href="/about" className="text-gray-700">О нас</Link>
        <Link href="/contact-us" className="text-gray-700">Контакты</Link>

        <Link href="/privacy-policy" className="text-gray-700">Политика конфиденциальности</Link>
        <Link href="/privacy-policy" className="text-gray-700">Политика обработки персональных данных</Link>
      </div>

      {/* Социальные сети */}
      <div className="flex items-center gap-4 mt-6">
      {(contacts?.clientInfo?.length ?? 0) > 0 ? (
  contacts?.clientInfo!.map((client) => (
    <Link key={client.id} href={client.link} target="_blank" className="relative w-[24px] h-[24px]">
      <Image loading="lazy" src={client.src} alt={client.phone} width={24} height={24} />
    </Link>
  ))
) : (
  <p>Ссылки не указаны</p>
)}
      

       
      </div>

      {/* Нижний текст */}
      <div className="text-[13px] text-gray-500 mt-6">
        © {new Date().getFullYear()} Все для дома.  
        <br />
        Все права защищены.
      </div>
      </div>
    </footer>
  );
}
