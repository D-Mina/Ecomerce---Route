'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';

export default function MainSlider() {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      title: 'Fresh Organic Groceries',
      subtitle: 'Get 20% off on your first order of farm-fresh fruits & vegetables',
      link: '/products',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      title: 'Top Electronics & Gadgets',
      subtitle: 'Upgrade your tech with exclusive seasonal discounts',
      link: '/products',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      title: 'Trendy Fashion Styles',
      subtitle: 'Explore the latest clothing and accessories collection',
      link: '/products',
    },
  ];

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Swiper Slider (2 Columns on large screens) */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-sm relative h-[280px] sm:h-[350px] lg:h-[420px]">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            className="w-full h-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex flex-col justify-center px-8 sm:px-12 text-white">
                    <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-3 uppercase tracking-wider">
                      Exclusive Deals
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold max-w-md leading-tight mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-200 max-w-sm mb-6">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.link}
                      className="inline-flex items-center justify-center bg-primary hover:bg-routeGreenHover text-white font-semibold px-6 py-2.5 rounded-xl shadow-md w-max transition-all hover:scale-105"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 2 Static Side Promo Banners (1 Column on large screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-[280px] sm:h-auto lg:h-[420px]">
          <div className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80"
              alt="Grocery Promo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs font-bold text-primary uppercase">Super Saver</span>
              <h3 className="text-lg font-bold">10% Cashback on Fresh Produce</h3>
              <Link href="/products" className="text-xs font-semibold text-primary underline mt-1">
                Explore items →
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"
              alt="Gadget Promo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs font-bold text-amber-400 uppercase">Flash Deals</span>
              <h3 className="text-lg font-bold">New Arrivals & Best Sellers</h3>
              <Link href="/products" className="text-xs font-semibold text-amber-300 underline mt-1">
                Shop Deals →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
