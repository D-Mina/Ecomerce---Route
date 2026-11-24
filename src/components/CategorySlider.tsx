'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Category } from '@/types';
import { Layers } from 'lucide-react';

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="my-6 sm:my-10">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <span>Popular Categories</span>
          </h2>
          <p className="text-[11px] sm:text-sm text-gray-500">Explore top items by category</p>
        </div>
        <Link
          href="/categories"
          className="text-xs sm:text-sm font-semibold text-primary hover:text-routeGreenHover hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={12}
          slidesPerView={2.3}
          breakpoints={{
            400: { slidesPerView: 2.7, spaceBetween: 12 },
            480: { slidesPerView: 3.2, spaceBetween: 14 },
            640: { slidesPerView: 4.2, spaceBetween: 16 },
            768: { slidesPerView: 5, spaceBetween: 18 },
            1024: { slidesPerView: 6, spaceBetween: 20 },
            1280: { slidesPerView: 7, spaceBetween: 24 },
          }}
          className="py-1 sm:py-2"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <Link
                href={`/categories/${cat._id}`}
                className="group block text-center"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all duration-300">
                  <img
                    src={cat.image || '/placeholder.png'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <h4 className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors truncate px-1">
                  {cat.name}
                </h4>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
