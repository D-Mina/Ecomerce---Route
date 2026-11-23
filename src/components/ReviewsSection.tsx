'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types';
import StarRating from './StarRating';
import { MessageSquare, Send, Trash2, Edit3, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewsSectionProps {
  productId: string;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/v1/products/${productId}/reviews`);
      if (data.data) {
        setReviews(data.data);
      }
    } catch (error) {
      console.warn('Could not load reviews for product', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review.');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please enter a review description.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingReviewId) {
        // Update review: PUT /api/v1/reviews/:id
        const { data } = await api.put(`/api/v1/reviews/${editingReviewId}`, {
          review: reviewText,
          rating,
        });
        if (data.data) {
          toast.success('Review updated successfully!');
          setEditingReviewId(null);
          setReviewText('');
          fetchReviews();
        }
      } else {
        // Create review: POST /api/v1/products/:id/reviews
        const { data } = await api.post(`/api/v1/products/${productId}/reviews`, {
          review: reviewText,
          rating,
        });
        if (data.data) {
          toast.success('Review added successfully!');
          setReviewText('');
          setRating(5);
          fetchReviews();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/api/v1/reviews/${reviewId}`);
      toast.success('Review deleted');
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleStartEdit = (rev: Review) => {
    setEditingReviewId(rev._id);
    setReviewText(rev.review);
    setRating(rev.rating);
    window.scrollTo({ behavior: 'smooth', top: document.getElementById('review-form')?.offsetTop || 0 });
  };

  return (
    <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Customer Reviews ({reviews.length})
          </h3>
          <p className="text-xs text-gray-500">What shoppers think about this product</p>
        </div>
      </div>

      {/* Review Form */}
      <div id="review-form" className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
        <h4 className="text-sm font-bold text-gray-800 mb-3">
          {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
        </h4>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-gray-600">Your Rating:</span>
              <StarRating
                rating={rating}
                interactive={true}
                size="w-5 h-5"
                onRate={(newRating) => setRating(newRating)}
              />
              <span className="text-xs font-bold text-amber-600">{rating} / 5</span>
            </div>

            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
            />

            <div className="flex items-center justify-between">
              {editingReviewId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReviewId(null);
                    setReviewText('');
                    setRating(5);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="ml-auto inline-flex items-center space-x-2 px-5 py-2 bg-primary hover:bg-routeGreenHover text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{editingReviewId ? 'Update Review' : 'Submit Review'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-2">You must be logged in to post a review.</p>
            <a
              href="/login"
              className="inline-block px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-routeGreenHover"
            >
              Sign In to Review
            </a>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-sm text-gray-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isOwner = user && (user._id === rev.user?._id || user.id === rev.user?._id);
            return (
              <div
                key={rev._id}
                className="p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                      {rev.user?.name ? rev.user.name[0] : <UserIcon className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{rev.user?.name || 'Anonymous User'}</span>
                      <span className="text-[10px] text-gray-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <StarRating rating={rev.rating} size="w-3.5 h-3.5" />
                    {isOwner && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleStartEdit(rev)}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rev._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-9">
                  {rev.review}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
