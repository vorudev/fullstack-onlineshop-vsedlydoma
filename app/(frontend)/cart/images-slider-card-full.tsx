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
interface Images {
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[];
title: string
}
export default function ImagesSlider({ images, title }: Images) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Сортируем изображения: сначала featured, потом по order
  const sortedImages = images?.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.order === null && b.order !== null) return 1;
    if (a.order !== null && b.order === null) return -1;
    if (a.order !== null && b.order !== null) return a.order - b.order;
    return 0;
  });
  return (
    <div className="w-full overflow-hidden">
  <div className="flex gap-3 overflow-x-auto py-2  scroll-snap-center  lg:px-0 snap-x snap-mandatory scrollbar-hide pb-2"
    style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
    {sortedImages?.map((image) => (
      <div 
        key={image.id}
        className="flex-shrink-0 snap-start lg:snap-center w-[180px] h-[150px] lg:w-[180px] lg:h-[140px]   aspect-[1/1.15] lg:aspect-[1/1] relative rounded-lg overflow-hidden"
      >
        <Image
          src={image.imageUrl || 'https://media.istockphoto.com/id/1147544807/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BD%D0%B5%D1%82-thumbnail-%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80-%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9.jpg?s=612x612&w=0&k=20&c=qA0VzNlwzqnnha_m2cHIws9MJ6vRGsZmys335A0GJW4='}
     fill
          alt={`${title}${image.isFeatured ? ' - главное фото' : ''}`}
          className="w-full h-full object-contain  "
        />
      </div>
    ))}
  </div>
  
  {/* Индикаторы точек */}

</div>


  );
}