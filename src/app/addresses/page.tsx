'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UserAddress } from '@/types';
import { MapPin, Plus, Trash2, X, Phone, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/v1/addresses');
      if (data.status === 'success' && Array.isArray(data.data)) {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error('Failed to load addresses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !details.trim() || !phone.trim() || !city.trim()) {
      toast.error('Please fill in all address details');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/api/v1/addresses', {
        name,
        details,
        phone,
        city,
      });

      if (data.status === 'success') {
        toast.success('Address added successfully!');
        setModalOpen(false);
        setName('');
        setDetails('');
        setPhone('');
        setCity('');
        fetchAddresses();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { data } = await api.delete(`/api/v1/addresses/${addressId}`);
      if (data.status === 'success') {
        toast.success('Address deleted');
        setAddresses((prev) => prev.filter((a) => a._id !== addressId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  return (
    <ProtectedRoute>
      <div className="pb-16 space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Saved Addresses
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage delivery addresses for quicker checkouts
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all w-max"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner fullScreen text="Loading addresses..." />
        ) : addresses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-primary flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Addresses</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Add your home or office address to speed up order checkouts.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-routeGreenHover"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-primary" />
                      {addr.name}
                    </span>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{addr.details}</p>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                  <span>{addr.city}</span>
                  <span className="flex items-center gap-1 text-gray-700 font-medium">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {addr.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Add New Delivery Address
              </h3>

              <form onSubmit={handleAddAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Address Label (e.g. Home, Office, Work) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Home"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street & Details *
                  </label>
                  <input
                    type="text"
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="15 El-Horreya St, Floor 3"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cairo"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all"
                  >
                    {submitting ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
