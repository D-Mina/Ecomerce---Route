'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GuestRoute from '@/components/GuestRoute';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const { verifyResetCode } = useAuth();
  const [resetCode, setResetCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await verifyResetCode(resetCode);
    setSubmitting(false);

    if (res.success) {
      router.push(`/reset-password?email=${encodeURIComponent(emailParam)}`);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-primary flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Verify Reset Code
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Please enter the 6-digit code sent to your email address {emailParam ? `(${emailParam})` : ''}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-center">
            6-Digit Reset Code
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            placeholder="123456"
            className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50/50 font-bold"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || resetCode.length < 5}
          className="w-full py-3 px-4 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-primary/25 hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Verify Code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <Link
          href="/forgot-password"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Request another code</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <GuestRoute>
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <Suspense fallback={<LoadingSpinner text="Loading..." />}>
          <VerifyCodeContent />
        </Suspense>
      </div>
    </GuestRoute>
  );
}
