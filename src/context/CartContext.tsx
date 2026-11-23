'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { Cart } from '@/types';

interface CartContextType {
  cart: Cart | null;
  cartId: string | null;
  numOfCartItems: number;
  totalCartPrice: number;
  loading: boolean;
  actionLoading: boolean;
  getCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<boolean>;
  updateProductQuantity: (productId: string, count: number) => Promise<boolean>;
  removeCartItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  applyCoupon: (couponName: string) => Promise<{ success: boolean; message?: string }>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const getCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      setCartId(null);
      setNumOfCartItems(0);
      setTotalCartPrice(0);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/api/v1/cart');
      if (data.status === 'success') {
        setCart(data.data);
        setCartId(data.data?._id || data.cartId);
        setNumOfCartItems(data.numOfCartItems || 0);
        setTotalCartPrice(data.data?.totalCartPrice || 0);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setCart(null);
        setNumOfCartItems(0);
        setTotalCartPrice(0);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const addToCart = async (productId: string) => {
    if (!token) {
      toast.error('Please login first to add items to your cart.');
      return false;
    }

    try {
      setActionLoading(true);
      const { data } = await api.post('/api/v1/cart', { productId });
      if (data.status === 'success') {
        setCart(data.data);
        setCartId(data.cartId || data.data?._id);
        setNumOfCartItems(data.numOfCartItems || 0);
        setTotalCartPrice(data.data?.totalCartPrice || 0);
        toast.success(data.message || 'Product added to cart!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product to cart.');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateProductQuantity = async (productId: string, count: number) => {
    if (count < 1) {
      return removeCartItem(productId);
    }

    try {
      setActionLoading(true);
      const { data } = await api.put(`/api/v1/cart/${productId}`, { count });
      if (data.status === 'success') {
        setCart(data.data);
        setNumOfCartItems(data.numOfCartItems || 0);
        setTotalCartPrice(data.data?.totalCartPrice || 0);
        toast.success('Cart updated');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const removeCartItem = async (productId: string) => {
    try {
      setActionLoading(true);
      const { data } = await api.delete(`/api/v1/cart/${productId}`);
      if (data.status === 'success') {
        setCart(data.data);
        setNumOfCartItems(data.numOfCartItems || 0);
        setTotalCartPrice(data.data?.totalCartPrice || 0);
        toast.success('Item removed from cart');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setActionLoading(true);
      const { data } = await api.delete('/api/v1/cart');
      if (data.message === 'success' || data.status === 'success') {
        setCart(null);
        setNumOfCartItems(0);
        setTotalCartPrice(0);
        toast.success('Cart cleared');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const applyCoupon = async (couponName: string) => {
    try {
      setActionLoading(true);
      const { data } = await api.put('/api/v2/cart/applyCoupon', { couponName });
      if (data.status === 'success') {
        setCart(data.data);
        setTotalCartPrice(data.data?.totalCartPrice || data.data?.totalAfterDiscount);
        toast.success('Coupon applied successfully!');
        return { success: true };
      }
      return { success: false, message: 'Invalid coupon' };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid or expired coupon';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        numOfCartItems,
        totalCartPrice,
        loading,
        actionLoading,
        getCart,
        addToCart,
        updateProductQuantity,
        removeCartItem,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
