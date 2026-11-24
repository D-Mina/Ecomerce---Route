'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const id = product._id || product.id || '';
  const inWishlist = isInWishlist(id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addToCart(id);
    setAdding(false);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistLoading(true);
    await toggleWishlist(id);
    setWishlistLoading(false);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-2.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col justify-between">
      <div>
        {/* Badges & Wishlist Button */}
        <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2 sm:mb-3">
          {product.priceAfterDiscount && (
            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 bg-red-500 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">
              Sale
            </span>
          )}

          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-sm shadow flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
              inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>

          {/* Product Image */}
          <Link href={`/products/${id}`} className="block w-full h-full relative">
            <img
              src={product.imageCover || '/placeholder.png'}
              alt={product.title}
              className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Category & Title */}
        <p className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
          {product.category?.name || 'Category'}
        </p>

        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-primary transition-colors min-h-[34px] sm:min-h-[40px] leading-snug">
            {product.title}
          </h3>
        </Link>
      </div>

      {/* Price & Rating */}
      <div className="pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2 sm:mb-3">
          <div className="flex flex-wrap items-baseline gap-1">
            <span className="text-xs sm:text-base font-bold text-gray-900">
              {product.priceAfterDiscount || product.price} EGP
            </span>
            {product.priceAfterDiscount && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {product.price}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs font-semibold text-gray-700 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-200/60">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
            <span>{product.ratingsAverage || 4.5}</span>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full py-2 sm:py-2.5 px-2 sm:px-3 bg-primary hover:bg-routeGreenHover active:scale-[0.98] text-white rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-sm shadow-primary/20"
        >
          {adding ? (
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">+ Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
