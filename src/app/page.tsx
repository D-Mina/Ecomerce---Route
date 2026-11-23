import React from 'react';
import api from '@/services/api';
import MainSlider from '@/components/MainSlider';
import CategorySlider from '@/components/CategorySlider';
import ProductCard from '@/components/ProductCard';
import { Product, Category, Brand } from '@/types';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones,
  Award
} from 'lucide-react';

async function getHomeData() {
  try {
    const [categoriesRes, productsRes, brandsRes] = await Promise.all([
      api.get('/api/v1/categories'),
      api.get('/api/v1/products?limit=20&sort=-ratingsAverage'),
      api.get('/api/v1/brands?limit=12'),
    ]);

    return {
      categories: (categoriesRes.data?.data || []) as Category[],
      featuredProducts: (productsRes.data?.data || []) as Product[],
      brands: (brandsRes.data?.data || []) as Brand[],
    };
  } catch (error) {
    console.error('Error fetching home data', error);
    return { categories: [], featuredProducts: [], brands: [] };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, brands } = await getHomeData();

  return (
    <div className="space-y-12 pb-8">
      {/* Hero / Main Slider */}
      <MainSlider />

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Free Shipping</h4>
            <p className="text-[11px] text-gray-500">On all orders over 500 EGP</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Easy Returns</h4>
            <p className="text-[11px] text-gray-500">14-day return policy</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">100% Authentic</h4>
            <p className="text-[11px] text-gray-500">Certified genuine goods</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center flex-shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">24/7 Support</h4>
            <p className="text-[11px] text-gray-500">Dedicated assistance</p>
          </div>
        </div>
      </div>

      {/* Categories Swiper Carousel */}
      <CategorySlider categories={categories} />

      {/* Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Hand-picked top quality items for you</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-primary hover:text-routeGreenHover hover:underline"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Top Brands Highlights */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Popular Brands
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Shop your favorite household brand names</p>
          </div>
          <Link
            href="/brands"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-primary hover:text-routeGreenHover hover:underline"
          >
            <span>All Brands</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand._id}`}
              className="group p-4 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center hover:shadow-lg hover:border-primary/40 transition-all duration-300"
            >
              <div className="w-20 h-20 relative flex items-center justify-center p-2 mb-2">
                <img
                  src={brand.image || '/placeholder.png'}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-primary transition-colors text-center truncate max-w-full">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
