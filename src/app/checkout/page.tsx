'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserAddress } from '@/types';
import { 
  CreditCard, 
  Banknote, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartId, totalCartPrice, numOfCartItems } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  useEffect(() => {
    api.get('/api/v1/addresses')
      .then(({ data }) => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setSavedAddresses(data.data);
          if (data.data.length > 0) {
            const first = data.data[0];
            setSelectedAddressId(first._id);
            setDetails(first.details || '');
            setPhone(first.phone || '');
            setCity(first.city || '');
          }
        }
      })
      .catch(console.warn);
  }, []);

  const handleSelectAddress = (addr: UserAddress) => {
    setSelectedAddressId(addr._id);
    setDetails(addr.details);
    setPhone(addr.phone);
    setCity(addr.city);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cartId) {
      toast.error('No active cart found');
      return;
    }

    if (!details.trim() || !phone.trim() || !city.trim()) {
      toast.error('Please fill in all required shipping address fields');
      return;
    }

    try {
      setSubmitting(true);
      const shippingAddress = {
        details,
        phone,
        city,
        postalCode: postalCode || '11511',
      };

      if (paymentMethod === 'cash') {
        const { data } = await api.post(`/api/v1/orders/${cartId}`, {
          shippingAddress,
        });

        if (data.status === 'success') {
          toast.success('Cash order placed successfully! 🎉');
          router.push('/allorders');
        } else {
          toast.error(data.message || 'Failed to place cash order');
        }
      } else {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const { data } = await api.post(
          `/api/v1/orders/checkout-session/${cartId}?url=${baseUrl}`,
          { shippingAddress }
        );

        if (data.status === 'success' && data.session?.url) {
          toast.success('Redirecting to secure online payment...');
          window.location.href = data.session.url;
        } else {
          toast.error('Failed to create payment session');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error processing order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="pb-16 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Select shipping address and payment method to complete your purchase
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left: Address & Payment options (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Saved Addresses Selector (if available) */}
            {savedAddresses.length > 0 && (
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Select from Saved Addresses
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-xs space-y-1 ${
                        selectedAddressId === addr._id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span>{addr.name}</span>
                        {selectedAddressId === addr._id && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-gray-600 truncate">{addr.details}</p>
                      <p className="text-gray-400">{addr.city} • {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Address Inputs */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">Shipping Details</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street & Address Details *
                  </label>
                  <input
                    type="text"
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="e.g. 15 El-Tahrir St, Apartment 4B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01012345678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Cairo, Giza, Alexandria"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 11511"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">Choose Payment Method</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                    paymentMethod === 'cash'
                      ? 'border-primary bg-primary/5 text-gray-900 ring-1 ring-primary/40'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-primary flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">Cash on Delivery</h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-500">Pay cash upon delivery</p>
                  </div>
                </div>

                {/* Online Payment (Card) */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 text-gray-900 ring-1 ring-primary/40'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">Online Payment</h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-500">Visa / Mastercard / Stripe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sticky top-20">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Order Summary</h3>

              <div className="space-y-2.5 text-xs sm:text-sm border-b border-gray-100 pb-3">
                <div className="flex justify-between text-gray-600">
                  <span>Items count:</span>
                  <span className="font-semibold text-gray-900">{numOfCartItems} items</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping fee:</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Selected Payment:</span>
                  <span className="font-semibold text-gray-900 uppercase text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                    {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Card'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm sm:text-base font-bold text-gray-900">Total to Pay</span>
                <span className="text-xl sm:text-2xl font-black text-primary">
                  {totalCartPrice} EGP
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 sm:py-3.5 px-4 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-primary/20 hover:shadow-lg transition-all"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{paymentMethod === 'cash' ? 'Confirm Cash Order' : 'Pay Online'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] sm:text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted & secure checkout process</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
