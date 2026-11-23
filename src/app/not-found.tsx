import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 max-w-md mb-8 text-sm sm:text-base">
        The page you are looking for doesn't exist or has been moved. Explore our fresh catalog instead!
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-routeGreenHover text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary rounded-xl font-semibold text-sm shadow-sm transition-all"
        >
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
}
