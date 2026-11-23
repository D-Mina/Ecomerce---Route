'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { User } from '@/types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (formValues: any) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  verifyResetCode: (resetCode: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, password: string, rePassword: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (name: string, email: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  logout: (notify?: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const decoded = jwtDecode<User>(storedToken);
        setUser(decoded);

        // Verify token with backend
        api.get('/api/v1/auth/verifyToken', { headers: { token: storedToken } })
          .then((res) => {
            if (res.data?.decoded) {
              setUser(res.data.decoded);
            }
          })
          .catch((err) => {
            if (err?.response?.status === 401 || err?.response?.status === 400) {
              logout(false);
            }
          });
      }
    } catch (err) {
      console.error('Failed to parse token', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/api/v1/auth/signin', { email, password });
      if (data.message === 'success' && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const decoded = jwtDecode<User>(data.token);
        setUser({ ...decoded, ...data.user });
        toast.success(`Welcome back, ${data.user?.name || 'User'}!`);
        router.push('/');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (formValues: any) => {
    try {
      const { data } = await api.post('/api/v1/auth/signup', formValues);
      if (data.message === 'success' && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const decoded = jwtDecode<User>(data.token);
        setUser({ ...decoded, ...data.user });
        toast.success('Account created successfully!');
        router.push('/');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { data } = await api.post('/api/v1/auth/forgotPasswords', { email });
      toast.success(data.message || 'Verification code sent to your email.');
      return { success: true, message: data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to send reset code.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const verifyResetCode = async (resetCode: string) => {
    try {
      const { data } = await api.post('/api/v1/auth/verifyResetCode', { resetCode });
      if (data.status === 'Success') {
        toast.success('Code verified successfully!');
        return { success: true };
      }
      return { success: false, message: 'Invalid code' };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid or expired reset code.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      const { data } = await api.put('/api/v1/auth/resetPassword', { email, newPassword });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const decoded = jwtDecode<User>(data.token);
        setUser(decoded);
        toast.success('Password reset successfully!');
        router.push('/');
        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to reset password.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const changePassword = async (currentPassword: string, password: string, rePassword: string) => {
    try {
      const { data } = await api.put('/api/v1/users/changeMyPassword', {
        currentPassword,
        password,
        rePassword,
      });
      if (data.message === 'success' && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Password changed successfully!');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to change password.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const updateProfile = async (name: string, email: string, phone: string) => {
    try {
      const { data } = await api.put('/api/v1/users/updateMe/', { name, email, phone });
      if (data.message === 'success' && data.user) {
        setUser((prev) => ({ ...prev, ...data.user }));
        toast.success('Profile updated successfully!');
        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    if (notify) toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        forgotPassword,
        verifyResetCode,
        resetPassword,
        changePassword,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
