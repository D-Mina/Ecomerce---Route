'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Brand } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { Award, Search } from 'lucide-react';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/api/v1/brands')
      .then(({ data }) => {
        if (data.data) setBrands(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            All Brands
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Official products from the world's most trusted manufacturers
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen text="Loading brands..." />
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No brands match "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredBrands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand._id}`}
              className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 relative flex items-center justify-center p-2 mb-3">
                <img
                  src={brand.image || '/placeholder.png'}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors truncate max-w-full">
                {brand.name}
              </h3>
              <span className="text-xs text-primary font-medium mt-1">View Products →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
