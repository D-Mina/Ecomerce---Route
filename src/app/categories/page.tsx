'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Category } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { Layers, Search } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/api/v1/categories')
      .then(({ data }) => {
        if (data.data) setCategories(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            All Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Browse our catalog by product category and subcategories
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen text="Loading categories..." />
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No categories match "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center p-4"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 relative">
                <img
                  src={category.image || '/placeholder.png'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <span className="text-xs text-primary font-medium mt-1">Explore Products →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
