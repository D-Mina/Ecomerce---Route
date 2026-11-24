'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { Product } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductCard from '@/components/ProductCard';
import StarRating from '@/components/StarRating';
import ReviewsSection from '@/components/ReviewsSection';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ArrowLeft,
  Minus,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api.get(`/api/v1/products/${id}`)
      .then(async ({ data }) => {
        if (data.data) {
          const prod: Product = data.data;
          setProduct(prod);
          setSelectedImage(prod.imageCover || (prod.images && prod.images[0]) || '');

          // Fetch related products from same category
          if (prod.category?._id) {
            try {
              const relRes = await api.get(`/api/v1/products?category[in]=${prod.category._id}&limit=5`);
              if (relRes.data?.data) {
                setRelatedProducts(
                  relRes.data.data.filter((p: Product) => (p._id || p.id) !== (prod._id || prod.id))
                );
              }
            } catch (e) {
              console.warn('Failed to load related products', e);
            }
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load product', err);
        toast.error('Product not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">The requested item could not be retrieved.</p>
        <button
          onClick={() => router.push('/products')}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const productId = product._id || product.id || '';
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      await addToCart(productId);
    }
    setAddingToCart(false);
  };

  const imagesList = [
    product.imageCover,
    ...(product.images || []),
  ].filter(Boolean);

  const uniqueImages = Array.from(new Set(imagesList));

  return (
    <div className="pb-16 space-y-6 sm:space-y-10">
      {/* Breadcrumb & Back */}
      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 overflow-x-auto pb-1">
        <Link href="/" className="hover:text-primary whitespace-nowrap">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary whitespace-nowrap">Products</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 bg-white p-4 sm:p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-sm">
        {/* Gallery / Images (Left: 5 cols) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-3 sm:p-4">
            <img
              src={selectedImage || product.imageCover}
              alt={product.title}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
            {product.priceAfterDiscount && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow">
                Sale
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {uniqueImages.length > 1 && (
            <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
              {uniqueImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-gray-50 p-1 transition-all ${
                    selectedImage === img
                      ? 'border-primary shadow-sm scale-105'
                      : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details (Right: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Category & Brand Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <Link
                  href={`/categories/${product.category._id}`}
                  className="px-2.5 py-0.5 sm:py-1 rounded-md bg-emerald-50 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                >
                  {product.category.name}
                </Link>
              )}
              {product.brand && (
                <Link
                  href={`/brands/${product.brand._id}`}
                  className="px-2.5 py-0.5 sm:py-1 rounded-md bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  {product.brand.name}
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center space-x-3 text-xs sm:text-sm">
              <StarRating rating={product.ratingsAverage} size="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-bold text-gray-800">{product.ratingsAverage || 4.5}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">{product.ratingsQuantity || 0} Ratings</span>
            </div>

            {/* Price section */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 py-2.5 sm:py-3 border-y border-gray-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {product.priceAfterDiscount || product.price} EGP
              </span>
              {product.priceAfterDiscount && (
                <span className="text-sm sm:text-lg text-gray-400 line-through">
                  {product.price} EGP
                </span>
              )}
              {product.priceAfterDiscount && (
                <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {product.price - product.priceAfterDiscount} EGP
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-2">Product Overview</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart & Wishlist */}
          <div className="space-y-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 sm:p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="w-10 sm:w-12 text-center text-xs sm:text-sm font-bold text-gray-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 sm:p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-primary hover:bg-routeGreenHover text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-primary/25 hover:shadow-lg transition-all active:scale-[0.99]"
              >
                {addingToCart ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart ({quantity})</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(productId)}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  inWishlist
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-gray-200 bg-white text-gray-500 hover:text-red-500 hover:border-red-200'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-2 p-2 rounded-lg bg-gray-50 text-[10px] sm:text-xs text-gray-600">
                <Truck className="w-4 h-4 text-primary flex-shrink-0 mb-1 sm:mb-0" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-2 p-2 rounded-lg bg-gray-50 text-[10px] sm:text-xs text-gray-600">
                <RotateCcw className="w-4 h-4 text-primary flex-shrink-0 mb-1 sm:mb-0" />
                <span>14d Returns</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-2 p-2 rounded-lg bg-gray-50 text-[10px] sm:text-xs text-gray-600">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mb-1 sm:mb-0" />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewsSection productId={productId} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 sm:space-y-6 pt-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            Similar Products You Might Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
