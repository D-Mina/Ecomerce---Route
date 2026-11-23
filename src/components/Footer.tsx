import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top App Download Promo Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Get the FreshCart App</h3>
          <p className="text-sm text-gray-600">
            We will send you a link, open it on your phone to download the app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="email"
              placeholder="Email .."
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
            />
            <button
              type="button"
              className="px-6 py-2.5 bg-primary hover:bg-routeGreenHover text-white text-sm font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              Share App Link
            </button>
          </div>
        </div>

        {/* Payment Partners & App Stores Bar */}
        <div className="border-y border-gray-200 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Payment Partners</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-blue-900">Amazon Pay</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-blue-600">American Express</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-red-600">MasterCard</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-blue-500">PayPal</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Get deliveries with FreshCart</span>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-gray-900 text-white rounded text-xs flex items-center gap-1.5 cursor-pointer hover:bg-black transition-colors">
                <span className="text-[10px] uppercase block leading-none">Download on</span>
                <span className="font-semibold text-xs">App Store</span>
              </div>
              <div className="px-3 py-1 bg-gray-900 text-white rounded text-xs flex items-center gap-1.5 cursor-pointer hover:bg-black transition-colors">
                <span className="text-[10px] uppercase block leading-none">Get it on</span>
                <span className="font-semibold text-xs">Google Play</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 pt-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-primary text-white flex items-center justify-center">
              <ShoppingCart className="w-3 h-3" />
            </div>
            <span>© {new Date().getFullYear()} FreshCart E-Commerce. All rights reserved.</span>
          </div>
          <div className="flex space-x-4">
            <a href="https://ecommerce.routemisr.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Route API</a>
            <a href="https://www.facebook.com/Routelearning" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Route Academy</a>
            <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
