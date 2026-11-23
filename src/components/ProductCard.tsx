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
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col justify-between">
      <div>
        {/* Badges & Wishlist Button */}
        <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
          {product.priceAfterDiscount && (
            <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Sale
            </span>
          )}

          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-transform hover:scale-110 ${
              inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>

          {/* Product Image */}
          <Link href={`/products/${id}`} className="block w-full h-full relative">
            <img
              src={product.imageCover || '/placeholder.png'}
              alt={product.title}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Category & Title */}
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          {product.category?.name || 'Category'}
        </p>

        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
            {product.title}
          </h3>
        </Link>
      </div>

      {/* Price & Rating */}
      <div className="pt-3 mt-2 border-t border-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-bold text-gray-900">
              {product.priceAfterDiscount || product.price} EGP
            </span>
            {product.priceAfterDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {product.price} EGP
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-xs font-semibold text-gray-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{product.ratingsAverage || 4.5}</span>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full py-2.5 px-3 bg-primary hover:bg-routeGreenHover active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm shadow-primary/20"
        >
          {adding ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>+ Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
