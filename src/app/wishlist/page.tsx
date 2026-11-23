'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <ProtectedRoute>
      <div className="pb-16 space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Save your favorite items and transfer them to your cart anytime
            </p>
          </div>
          <span className="text-sm font-semibold text-gray-600 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-max">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </span>
        </div>

        {loading ? (
          <LoadingSpinner fullScreen text="Loading your wishlist items..." />
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              You haven't saved any items yet. Browse products and tap the heart icon to save!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-sm font-bold shadow-md transition-all hover:scale-105"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => {
              const id = product._id || product.id || '';
              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-xl bg-gray-50 overflow-hidden mb-3 p-3 flex items-center justify-center">
                      <img
                        src={product.imageCover || '/placeholder.png'}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <p className="text-[11px] font-bold text-primary uppercase">
                      {product.category?.name || 'Category'}
                    </p>

                    <Link href={`/products/${id}`}>
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-base font-extrabold text-gray-900 mt-2">
                      {product.priceAfterDiscount || product.price} EGP
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-50 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 py-2 px-3 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => removeFromWishlist(id)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
