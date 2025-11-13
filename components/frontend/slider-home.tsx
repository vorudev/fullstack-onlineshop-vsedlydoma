'use client';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useRef, useEffect } from "react";
import ProductCard from "./product-card-full";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
interface SliderHomeProps {
   products: {
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
    averageRating: number;
    reviewCount: number;
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    slug: string;
    title: string;
    description: string;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
}[]
}
const ProductsSlider = ({ products }: SliderHomeProps = { products: [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(1);
    const maxIndex = Math.max(0, Math.ceil(products.length / slidesPerView) - 3);
  return (
    <div className="w-full max-w-7xl mx-auto group   ">

      <div className="relative ">
        {/* Кастомная кнопка назад */}
        <div className="swiper-button-prev-custom group-hover:opacity-100 opacity-0 absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 transition-all cursor-pointer">
          <ChevronLeft className="w-6 h-6" />
        </div>

        {/* Swiper слайдер - для демо используем CDN версию */}
        <Swiper
  modules={[Navigation, Pagination]}
  spaceBetween={16}
  slidesPerView={1}
onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
  grabCursor={true}
  navigation={{
    prevEl: '.swiper-button-prev-custom',
    nextEl: '.swiper-button-next-custom',
  }}
  pagination={{
    el: '.swiper-pagination',
    clickable: true,
  }}
  breakpoints={{
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 2 },
    1280: { slidesPerView: 3 },
  }}
>
  {products.map((product) => (
    <SwiperSlide key={product.id}>
      <ProductCard product={product} />
    </SwiperSlide>
  ))}
</Swiper>

        {/* Кастомная кнопка вперед */}
        <div className="swiper-button-next-custom absolute duration-200 group-hover:opacity-100 opacity-0 right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 transition-all cursor-pointer">
          <ChevronRight className="w-6 h-6" />
        </div>
      </div>

      {/* Индикаторы пагинации */}
       {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(maxIndex + 1)].map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-blue-500' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Инструкция для вашего проекта */}
      </div>
  );
};

export default ProductsSlider;