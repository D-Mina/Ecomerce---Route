'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { Product, Category, Brand } from '@/types';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/categories'),
      api.get('/api/v1/brands'),
    ]).then(([catRes, brandRes]) => {
      if (catRes.data?.data) setCategories(catRes.data.data);
      if (brandRes.data?.data) setBrands(brandRes.data.data);
    }).catch(console.error);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (sort) params.append('sort', sort);
      if (keyword) params.append('keyword', keyword);
      if (selectedCategory) params.append('category[in]', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);

      const { data } = await api.get(`/api/v1/products?${params.toString()}`);
      if (data.data) {
        setProducts(data.data);
        if (data.metadata?.numberOfPages) {
          setTotalPages(data.metadata.numberOfPages);
        }
      }
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  }, [page, sort, keyword, selectedCategory, selectedBrand]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSort('');
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Browse our full catalog with advanced filters & fast delivery
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter controls row */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm text-xs sm:text-sm space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center md:justify-between gap-3">
        {/* Filters */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <div className="col-span-2 sm:col-auto flex items-center space-x-1.5 text-gray-500 font-semibold mr-1">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Filter:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          {(selectedCategory || selectedBrand || keyword || sort) && (
            <button
              onClick={clearFilters}
              className="col-span-2 sm:col-auto flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg bg-red-50 font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center justify-between sm:justify-start space-x-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          <span className="text-gray-500 font-medium">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Default</option>
            <option value="-price">Price: High to Low</option>
            <option value="price">Price: Low to High</option>
            <option value="-ratingsAverage">Top Rated</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid or Loading */}
      {loading ? (
        <LoadingSpinner fullScreen text="Loading fresh products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-base sm:text-lg font-bold text-gray-800 mb-2">No products found</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">Try adjusting your filters or search keywords.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-routeGreenHover shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Responsive Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <button
                disabled={page <= 1}
                onClick={() => {
                  setPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Mobile page indicator */}
              <div className="sm:hidden px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg">
                Page {page} of {totalPages}
              </div>

              {/* Desktop page buttons */}
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  // If lots of pages, show window
                  if (totalPages > 8 && Math.abs(page - pNum) > 2 && pNum !== 1 && pNum !== totalPages) {
                    if (Math.abs(page - pNum) === 3) {
                      return <span key={pNum} className="px-1 text-gray-400">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setPage(pNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        page === pNum
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
