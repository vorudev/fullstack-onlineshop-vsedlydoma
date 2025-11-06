'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import { useState, useMemo } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { DeleteImageFromProductButton } from './delete-image-from-product';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

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
    <div className="space-y-4">
      {/* Основной слайдер */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs, Zoom]}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        zoom
        spaceBetween={10}
        className="rounded-lg overflow-hidden"
        style={{ aspectRatio: '1/1' }}
      >
        {sortedImages.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="swiper-zoom-container">
              <img
                src={image.imageUrl}
                alt={`${title}${image.isFeatured ? ' - главное фото' : ''}`}
                className="w-full h-full object-cover"
              /> 
              <DeleteImageFromProductButton image={image} />
              {/* Опционально: значок для главного фото */}
              {image.isFeatured && (
                <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                  Главное фото
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Миниатюры (если больше 1 изображения) */}
      {sortedImages.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          watchSlidesProgress
          className="thumbs-swiper"
        >
          {sortedImages.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative">
                <img
                  src={image.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover rounded cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                />
                {/* Индикатор главного фото на миниатюре */}
                {image.isFeatured && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}