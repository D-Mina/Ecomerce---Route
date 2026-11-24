'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Order } from '@/types';
import Link from 'next/link';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Banknote, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

export default function AllOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const userId = user.id || user._id;

    if (userId) {
      api.get(`/api/v1/orders/user/${userId}`)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            setOrders(data);
          } else if (Array.isArray(data.data)) {
            setOrders(data.data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="pb-16 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span>Order History</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Track and review your past orders & delivery status
            </p>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-600 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-max">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
          </span>
        </div>

        {loading ? (
          <LoadingSpinner fullScreen text="Loading your orders..." />
        ) : orders.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-primary flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
              You haven't placed any orders yet. Start exploring our catalog to get fresh items delivered!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => {
              const orderId = order.id || order._id;
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4 sm:space-y-6"
                >
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-gray-900 text-sm sm:text-base">
                          Order #{orderId}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-400">• {dateStr}</span>
                      </div>
                      {order.shippingAddress && (
                        <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {order.shippingAddress.details}, {order.shippingAddress.city} ({order.shippingAddress.phone})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {/* Payment method badge */}
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700">
                        {order.paymentMethodType === 'card' ? (
                          <>
                            <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                            <span>Card</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                            <span>Cash</span>
                          </>
                        )}
                      </span>

                      {/* Paid status */}
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                          order.isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.isPaid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Payment Pending</span>
                          </>
                        )}
                      </span>

                      {/* Delivered status */}
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                          order.isDelivered
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{order.isDelivered ? 'Delivered' : 'In Transit'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2.5">
                    {order.cartItems?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between text-xs sm:text-sm py-1"
                      >
                        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 pr-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-50 border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={item.product?.imageCover || '/placeholder.png'}
                              alt={item.product?.title || 'Product'}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate text-xs sm:text-sm">
                              {item.product?.title || 'Item'}
                            </p>
                            <p className="text-gray-400 text-[10px] sm:text-xs">Qty: {item.count}</p>
                          </div>
                        </div>

                        <span className="font-bold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                          {item.price * item.count} EGP
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer with Total */}
                  <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Total Order Amount</span>
                    <span className="text-lg sm:text-xl font-black text-primary">
                      {order.totalOrderPrice} EGP
                    </span>
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
