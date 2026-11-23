'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { Brand, Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { ArrowLeft, Award } from 'lucide-react';

export default function BrandDetailsPage() {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([
      api.get(`/api/v1/brands/${id}`),
      api.get(`/api/v1/products?brand=${id}`),
    ])
      .then(([brandRes, prodRes]) => {
        if (brandRes.data?.data) setBrand(brandRes.data.data);
        if (prodRes.data?.data) setProducts(prodRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading brand details & products..." />;
  }

  if (!brand) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Brand Not Found</h2>
        <Link href="/brands" className="text-primary text-sm font-semibold hover:underline">
          Back to all brands
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          href="/brands"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-gray-600 hover:text-primary font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Brands</span>
        </Link>
      </div>

      {/* Brand Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1 justify-center md:justify-start">
            <Award className="w-4 h-4" />
            Official Brand Store
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{brand.name}</h1>
          <p className="text-sm text-gray-500 max-w-lg">
            Shop 100% genuine products directly from {brand.name} with fast delivery and warranties.
          </p>
        </div>
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gray-50 border border-gray-100 p-4 flex items-center justify-center flex-shrink-0">
          <img
            src={brand.image || '/placeholder.png'}
            alt={brand.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Products under this brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Products by {brand.name} ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-2">No products currently available for this brand.</p>
            <Link
              href="/products"
              className="text-primary text-xs font-bold hover:underline"
            >
              Browse other products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
