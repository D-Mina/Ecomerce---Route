'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { Product } from '@/types';

interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: Set<string>;
  count: number;
  loading: boolean;
  getWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const getWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/api/v1/wishlist');
      if (data.status === 'success' && Array.isArray(data.data)) {
        setWishlist(data.data);
        const ids = new Set<string>(data.data.map((item: any) => item._id || item.id));
        setWishlistIds(ids);
      }
    } catch (error) {
      console.error('Error fetching wishlist', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getWishlist();
  }, [getWishlist]);

  const addToWishlist = async (productId: string) => {
    if (!token) {
      toast.error('Please login first to manage your wishlist.');
      return false;
    }

    try {
      setWishlistIds((prev) => new Set([...Array.from(prev), productId]));
      const { data } = await api.post('/api/v1/wishlist', { productId });
      if (data.status === 'success') {
        toast.success(data.message || 'Added to Wishlist ❤️');
        getWishlist();
        return true;
      }
      return false;
    } catch (error: any) {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!token) return false;

    try {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      setWishlist((prev) => prev.filter((p) => (p._id || p.id) !== productId));

      const { data } = await api.delete(`/api/v1/wishlist/${productId}`);
      if (data.status === 'success') {
        toast.success(data.message || 'Removed from Wishlist');
        return true;
      }
      return false;
    } catch (error: any) {
      getWishlist();
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
      return false;
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (wishlistIds.has(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        count: wishlist.length,
        loading,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
