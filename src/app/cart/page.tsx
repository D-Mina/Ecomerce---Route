'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    numOfCartItems, 
    totalCartPrice, 
    loading, 
    actionLoading, 
    updateProductQuantity, 
    removeCartItem, 
    clearCart,
    applyCoupon 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCode);
    setCouponLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="pb-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Review your items and proceed to checkout
            </p>
          </div>

          {cart && cart.products && cart.products.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
              disabled={actionLoading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs sm:text-sm font-semibold transition-colors w-max"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner fullScreen text="Loading your shopping cart..." />
        ) : !cart || !cart.products || cart.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Looks like you haven't added anything to your cart yet. Explore our fresh deals!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-sm font-bold shadow-md transition-all hover:scale-105"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.products.map((item) => {
                const prod = item.product;
                const prodId = prod?._id || item._id;
                return (
                  <div
                    key={item._id}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:border-gray-200 transition-all"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-50 border border-gray-100 p-2 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={prod?.imageCover || '/placeholder.png'}
                        alt={prod?.title || 'Product'}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <p className="text-[11px] font-bold text-primary uppercase">
                        {prod?.category?.name || 'Item'}
                      </p>
                      <Link
                        href={`/products/${prod?._id || ''}`}
                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-primary transition-colors line-clamp-2"
                      >
                        {prod?.title}
                      </Link>
                      <p className="text-sm font-extrabold text-gray-900 pt-1">
                        {item.price} EGP
                      </p>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 w-full sm:w-auto">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <button
                          onClick={() => updateProductQuantity(prodId, item.count - 1)}
                          disabled={actionLoading}
                          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-bold text-gray-900">
                          {item.count}
                        </span>
                        <button
                          onClick={() => updateProductQuantity(prodId, item.count + 1)}
                          disabled={actionLoading}
                          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeCartItem(prodId)}
                        disabled={actionLoading}
                        className="flex items-center space-x-1 text-xs font-semibold text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & Coupon (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Coupon box */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-primary" />
                  Apply Promo Code
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code..."
                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Summary card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

                <div className="space-y-2 text-sm text-gray-600 border-b border-gray-100 pb-4">
                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="font-semibold text-gray-900">{numOfCartItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{totalCartPrice} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary">
                    {totalCartPrice} EGP
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-4 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Safe & Secure 256-Bit SSL Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
