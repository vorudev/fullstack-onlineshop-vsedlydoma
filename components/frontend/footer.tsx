import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#F7F7F8] border-t border-gray-200 px-4 py-6 mb-[52px] lg:mb-0">
      {/* Верхние ссылки */}
      <div className="grid grid-cols-2 gap-4 text-[15px]">
        <Link href="/categories" className="text-gray-700 seft-start">Каталог</Link>
        <Link href="/manufacturers" className="text-gray-700">Производители</Link>

        <Link href="/about" className="text-gray-700">О нас</Link>
        <Link href="/contacts" className="text-gray-700">Контакты</Link>

        <Link href="/privacy-policy" className="text-gray-700">Политика конфиденциальности</Link>
        <Link href="/privacy-policy" className="text-gray-700">Политика обработки персональных данных</Link>
      </div>

      {/* Социальные сети */}
      <div className="flex items-center gap-4 mt-6">
       <Link href="https://viber.click/375293808246" target="_blank" className="relative w-[24px] h-[24px] ">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Viber_logo_2018_%28without_text%29.svg/970px-Viber_logo_2018_%28without_text%29.svg.png" alt="viber" width={24} height={24} />
       </Link>

        <Link href="https://t.me/Dmitry2407" target="_blank" className="relative w-[24px] h-[24px] ">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png" alt="telegram" width={24} height={24} />
       </Link>

        <Link href="https://www.instagram.com/santehmir_.by/" target="_blank" className="relative w-[24px] h-[24px] ">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png" alt="instagram" width={24} height={24} />
       </Link>

       
      </div>

      {/* Нижний текст */}
      <div className="text-[13px] text-gray-500 mt-6">
        © {new Date().getFullYear()} Все для дома.  
        <br />
        Все права защищены.
      </div>
    </footer>
  );
}
