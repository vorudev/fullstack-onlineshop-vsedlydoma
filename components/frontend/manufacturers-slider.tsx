
import Link from "next/link";
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import Image from 'next/image';
interface ManufacturersWithImages { 
    manufacturersWithImages: {
    images: {
        id: string;
        manufacturerId: string;
        imageUrl: string;
    }[];
    id: string;
    name: string;
    slug: string;
}
}
export const ManufacturersSlider = ({ manufacturersWithImages }: ManufacturersWithImages) => {
    return (
    
    <div className="bg-gray-50 py-8 px-4 rounded-2xl flex flex-col gap-4"> 
     <div className="relative w-[80px] h-[80px]">
        <Image
        src={manufacturersWithImages.images[0].imageUrl}
        alt={manufacturersWithImages.name}
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-full"
        />
     </div>
        <h3 className="text-lg font-semibold">{manufacturersWithImages.name}</h3>
    </div>
    )

}
