'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import { useState, useMemo } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import Image from 'next/image';
interface Image {
  id: string;
    createdAt: Date | null;
    productId: string;
    imageUrl: string;
    storageType: string;
    storageKey: string | null;
    order: number | null;
    isFeatured: boolean | null
}

export default function ImagesSlider({ images, title }: { 
  images: Image[], 
  title: string 
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Сортируем изображения: сначала featured, потом по order
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      // Сначала featured изображение
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // Потом по order (null в конец)
      if (a.order === null && b.order !== null) return 1;
      if (a.order !== null && b.order === null) return -1;
      if (a.order !== null && b.order !== null) return a.order - b.order;
      
      return 0;
    });
  }, [images]);

  return (
    <div className="w-full overflow-hidden">
  <div className="flex lg:hidden gap-3 overflow-x-auto py-2  snap-x snap-mandatory scrollbar-hide pb-2"
       style={{ 
         scrollbarWidth: 'none',
         msOverflowStyle: 'none',
       }}>
    {sortedImages.map((image) => (
      <div 
        key={image.id}
        className="flex-shrink-0 snap-start relative rounded-lg overflow-hidden"
        style={{ 
          width: 'calc(100vw - 3rem)',
          maxWidth: '180px',
          maxHeight: '150px',
          aspectRatio: '1/1.15'
        }}
      >
       {image.isFeatured && <Image
          src={image.imageUrl}
          width={180}
          height={150}
          alt={`${title}${image.isFeatured ? ' - главное фото' : ''}`}
          className="w-full h-full object-contain"
        />
       }
      </div>
    ))}
  </div>
<div className="hidden lg:block aspect-[1/1] relative w-[200px] h-[200px]">
   
</div>  
</div>


  );
}