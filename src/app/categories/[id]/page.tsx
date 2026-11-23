'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { Category, SubCategory, Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { ArrowLeft, Layers, Tag } from 'lucide-react';

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([
      api.get(`/api/v1/categories/${id}`),
      api.get(`/api/v1/categories/${id}/subcategories`),
      api.get(`/api/v1/products?category[in]=${id}`),
    ])
      .then(([catRes, subRes, prodRes]) => {
        if (catRes.data?.data) setCategory(catRes.data.data);
        if (subRes.data?.data) setSubcategories(subRes.data.data);
        if (prodRes.data?.data) setProducts(prodRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading category details & products..." />;
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Category Not Found</h2>
        <Link href="/categories" className="text-primary text-sm font-semibold hover:underline">
          Back to all categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          href="/categories"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-gray-600 hover:text-primary font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
            Category Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{category.name}</h1>
          <p className="text-sm text-emerald-100 max-w-lg">
            Discover all verified items and best deals in the {category.name} section.
          </p>
        </div>
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 p-2 flex-shrink-0">
          <img
            src={category.image || '/placeholder.png'}
            alt={category.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Subcategories Pills Section */}
      {subcategories.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-primary" />
            Subcategories in {category.name} ({subcategories.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <span
                key={sub._id}
                className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-primary hover:border-primary/40 transition-colors"
              >
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Products under this category */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Products in {category.name} ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-2">No products currently available in this category.</p>
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
