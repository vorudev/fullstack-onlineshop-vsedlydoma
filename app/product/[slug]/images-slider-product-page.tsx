

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import { Swiper as SwiperType } from 'swiper';
import { Swiper as MainSwiperType } from 'swiper';

interface ProductUnited {
  images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        isFeatured: boolean | null;
        order: number | null;
        createdAt: Date | null;
   
    }[];
}

export default function ProductGallery({images}: ProductUnited) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<MainSwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Сортируем изображения по order
  const sortedImages = [...images].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  return (
    <div className="flex flex-col-reverse  lg:border-r-2 lg:border-gray-100 lg:flex-row gap-2 max-w-full">
      {/* Thumbnails */}
      <div className="w-full h-20 lg:w-[60px] lg:h-auto lg:max-h-[470px]">
        {/* Mobile: горизонтальный слайдер */}
        <div className="lg:hidden h-full">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView="auto"
            watchSlidesProgress={true}
            modules={[Thumbs]}
            className="h-full w-full"
          >
            {sortedImages.map((img, idx) => (
              <SwiperSlide key={img.id} className="!w-[60px]">
                <div 
                  className={`
                    h-[60px] w-[60px] cursor-pointer transition-opacity
                    border-2 rounded overflow-hidden
                    ${activeIndex === idx 
                      ? 'opacity-100 border-blue-500' 
                      : 'opacity-60 border-transparent hover:opacity-100'
                    }
                  `}
                  onClick={() => {
                    setActiveIndex(idx);
                    thumbsSwiper?.slideTo(idx);
                  }}
                >
                  <img 
                    src={img.imageUrl} 
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop: вертикальный скролл */}
        <div 
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="hidden lg:flex max-h-[470px]   lg:flex-col gap-2 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {sortedImages.map((img, idx) => (
            <div 
              key={img.id}
              className={`
                h-[60px] w-[60px] flex-shrink-0 cursor-pointer transition-opacity
                border-l-3 overflow-hidden select-none
                ${activeIndex === idx 
                  ? 'opacity-100 border-blue-500 ' 
                  : 'opacity-60 border-transparent hover:opacity-100'
                }
              `}
              onClick={() => {
                setActiveIndex(idx);
                mainSwiper?.slideTo(idx);
              }}
              
            >
              <img 
                src={img.imageUrl} 
                alt={`Product ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Image */}
      <div className="w-full h-[300px] lg:w-[250px] lg:h-auto lg:aspect-[1/1.15] xl:w-[415px] xl:max-h-[470px]">
        <Swiper
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[Thumbs]}
          className="h-full w-full"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          initialSlide={activeIndex}
         onSwiper={(swiper) => {
            setMainSwiper(swiper);
            if (activeIndex !== swiper.activeIndex) {
              swiper.slideTo(activeIndex);
            }
          }}
        >
          {sortedImages.map((img, idx) => (
            <SwiperSlide key={img.id}>
              <div className="flex items-center justify-center h-full w-full select-none">
                <img 
                  src={img.imageUrl} 
                  alt={`Product ${idx + 1}`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}