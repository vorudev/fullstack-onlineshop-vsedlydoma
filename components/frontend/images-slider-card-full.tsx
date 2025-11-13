'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import { useState, useRef, useEffect } from 'react';
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
  title: string;
}

export default function ImagesSlider({ images, title }: Images) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);


  // Сортируем изображения: сначала featured, потом по order
  const sortedImages = images.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.order === null && b.order !== null) return 1;
    if (a.order !== null && b.order === null) return -1;
    if (a.order !== null && b.order !== null) return a.order - b.order;
    return 0;
  });

  
  return (
   <div className="w-full overflow-hidden">
  <div
    className="flex gap-3 overflow-x-auto 2xl:overflow-visible py-2 scroll-snap-center px-10 2xl:px-0 snap-x snap-mandatory 2xl:snap-none scrollbar-hide pb-2 2xl:justify-center"
    style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      cursor: 'grab',
    }}
  >
    {sortedImages.slice(0, window.innerWidth >= 1536 ? 1 : sortedImages.length).map((image) => (
      <div
        key={image.id}
        className="flex-shrink-0 snap-start lg:snap-center 2xl:snap-none w-[180px] h-[150px] xl:w-[160px] xl:h-[160px] aspect-[1/1.15] lg:aspect-[1/1] relative rounded-lg overflow-hidden"
      >
        <Image
          src={image.imageUrl}
          fill
          alt={`${title}${image.isFeatured ? ' - главное фото' : ''}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    ))}
  </div>
  {/* Индикаторы точек */}
</div>
  );
}