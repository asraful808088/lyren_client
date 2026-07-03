'use client';

import { FC, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

import { productApi, Product, getErrorMessage } from '@/services/authApi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';

import { isReviewUnauthorized, isReviewDuplicate } from '@/services/reviewApi';
import { UIProduct } from '@/data/products';
import {
  Star, Heart, Plus, Minus, Truck, RefreshCw, Shield,
  Sparkles, Check, MessageSquare, CornerDownRight, AlertCircle, Loader
} from 'lucide-react';
import { useReviews } from '@/hook/useReviews';

const GRADIENTS = [
  'from-rose-900/40 to-black',
  'from-amber-900/40 to-black',
  'from-emerald-900/40 to-black',
  'from-violet-900/40 to-black',
  'from-sky-900/40 to-black',
];

interface ReviewDisplay {
  id?: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  react?: number;
}

const ProductDetails: FC = () => {
  const params = useParams();
  const urlId = params?.id as string;

  const { addToCart, setIsOpen } = useCart();
  const { accessToken, setIsLoginOpen } = useAuth();
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Product[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'care' | 'reviews'>('description');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!urlId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const prodRes = await productApi.getByEncodedId(urlId);
        const p = prodRes.data!;

        setProduct(p);
        setActiveImage(p.images?.[0]?.image ?? '');
        setSelectedSize(p.sizes?.[0]?.size ?? 'M');
        setSelectedColor(p.colors?.[0]?.colorName ?? 'Default');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [urlId]);

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    isSubmitting: isSubmittingReview,
    addReview,
    deleteReview,
    reactToReview,
    clearError: clearReviewError,
  } = useReviews(product?.id || null);

  useEffect(() => {
    if (!product || !urlId) return;

    (async () => {
      setSuggestedLoading(true);
      try {
        const sugRes = await productApi.getAll(1, 20);
        const others = (sugRes.data?.data ?? [])
          .filter((x) => x.encodedId !== urlId);
        setSuggested(others);
      } catch (err) {
        console.error('Failed to load suggested products:', err);
      } finally {
        setSuggestedLoading(false);
      }
    })();
  }, [product, urlId]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    const gradient = GRADIENTS[Number(product.id) % GRADIENTS.length];
    const allImages = product?.images ?? [];

    const uiProduct: UIProduct = {
      id: String(product.id),
      name: product.name,
      description: product.miniDesc,
      price: product.price,
      discountPrice:
        product.discount > 0 && product.discount < 100
          ? +(product.price * (1 - product.discount / 100)).toFixed(2)
          : undefined,
      rating: product.averageRating ?? 0,
      tag: product.collection || undefined,
      category: product.category || 'All',
      imageUrl: allImages[0]?.image,
      imageColor: gradient,
      encodedId: product.encodedId,
    };

    for (let i = 0; i < quantity; i++) addToCart(uiProduct as any);
    setTimeout(() => {
      setIsAdding(false);
      setIsOpen(true);
    }, 1000);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const id = String(product.id);
    if (isFavorited(id)) {
      removeFavorite(id);
    } else {
      addFavorite({
        id,
        name: product.name,
        price: discountPrice ?? product.price,
        image: allImages[0]?.image ?? '',
      });
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      clearReviewError();
      setIsLoginOpen(true);
      return;
    }

    if (!newName.trim() || !newText.trim()) {
      return;
    }

    const success = await addReview(
      product?.id || 0,
      {
        username: newName,
        rating: newRating,
        comment: newText,
      },
      accessToken
    );

    if (success) {
      setReviewSuccess(true);
      setNewName('');
      setNewText('');
      setNewRating(5);

      setTimeout(() => setReviewSuccess(false), 2000);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!accessToken) {
      setIsLoginOpen(true);
      return;
    }

    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const success = await deleteReview(product?.id || 0, reviewId, accessToken);
    if (!success) {
      alert('Failed to delete review');
    }
  };

  const handleReactToReview = async (reviewId: number, value: number) => {
    try {
      await reactToReview(product?.id || 0, reviewId, value);
    } catch (error) {
      console.error('Failed to react to review:', error);
    }
  };

  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const discountPrice =
    product && product.discount > 0 && product.discount < 100
      ? +(product.price * (1 - product.discount / 100)).toFixed(2)
      : undefined;

  const gradient = GRADIENTS[Number(product?.id || 0) % GRADIENTS.length];
  const allImages = product?.images ?? [];
  const thumbnails =
    allImages.length > 0 ? allImages.slice(0, 3) : [{ image: '', type: 'main' }];

  const wishlisted = product ? isFavorited(String(product.id)) : false;

  const displayReviews: ReviewDisplay[] = reviews.map((r) => ({
    id: r.id,
    name: r.username,
    rating: r.rating,
    text: r.comment,
    date: new Date(r.createTime).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    react: r.react,
  }));

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="h-[650px] bg-white/[0.02] animate-pulse rounded-2xl" />
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 bg-white/[0.02] animate-pulse rounded-lg"
                style={{ width: `${80 - i * 10}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-serif italic text-white mb-6">
          {error ?? 'Product Not Found'}
        </h2>
        <Link href="/shop" className="text-[#d4af37] border-b border-[#d4af37]">
          Back to Shop
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <div className="mb-12 text-[10px] uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition">
          Shop
        </Link>
        <span>/</span>
        <span className="text-[#d4af37]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative h-[650px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group flex items-center justify-center ${activeImage ? 'bg-black' : `bg-gradient-to-br ${gradient}`}`}
          >
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold flex items-center gap-2">
                <Sparkles size={10} /> Conscious Luxury
              </span>
              <span className="text-xs text-white/70 font-light font-serif italic">
                Artisan handcrafted in limited numbers
              </span>
            </div>
          </motion.div>

          <div className="flex justify-center gap-4">
            {thumbnails.map((img, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveImage(img.image)}
                className={`w-24 h-24 rounded-xl border transition-all duration-300 overflow-hidden relative ${
                  activeImage === img.image
                    ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105'
                    : 'border-white/10 hover:border-white/40'
                }`}
              >
                {img.image ? (
                  <Image src={img.image} alt="" fill className="object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-8 lg:sticky lg:top-24">
          <div className="space-y-4">
            {product.collection && (
              <span className="inline-block px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full font-medium">
                {product.collection}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#d4af37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={
                        i < Math.floor(product.averageRating ?? 0) ? 'currentColor' : 'none'
                      }
                      className={
                        i < Math.floor(product.averageRating ?? 0)
                          ? 'text-[#d4af37]'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-white/80 font-mono">
                  {(product.averageRating ?? 0).toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-gray-400 hover:text-white transition uppercase tracking-widest"
              >
                {displayReviews.length} Reviews
              </button>
            </div>

            <div className="flex items-baseline gap-4 pt-2">
              {discountPrice !== undefined ? (
                <>
                  <span className="text-3xl font-serif text-white font-light">
                    ${discountPrice}
                  </span>
                  <span className="text-lg font-serif text-red-400/80 line-through font-light">
                    ${product.price}
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-serif text-white font-light">
                  ${product.price}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed font-light">
            {product.miniDesc}
          </p>

          {product.colors?.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400">
                <span>Select Color</span>
                <span className="text-white font-medium">{selectedColor}</span>
              </div>
              <div className="flex gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color.colorName}
                    onClick={() => setSelectedColor(color.colorName)}
                    title={color.colorName}
                    className="w-8 h-8 rounded-full border-2 relative flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: color.colorCode, borderColor: 'rgba(255,255,255,0.15)' }}
                  >
                    {selectedColor === color.colorName && (
                      <motion.div
                        layoutId="activeColorBorder"
                        className="absolute -inset-1.5 rounded-full border border-[#d4af37] pointer-events-none"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400">
                <span>Select Size</span>
                <span className="text-white font-medium">{selectedSize}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sizeObj) => {
                  const size = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 h-10 border text-[10px] font-bold rounded-lg relative transition-all ${
                        selectedSize === size
                          ? 'border-[#d4af37] text-white bg-white/5'
                          : 'border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {size}
                      {selectedSize === size && (
                        <motion.div
                          layoutId="activeSizeOverlay"
                          className="absolute inset-0 border border-[#d4af37] rounded-lg pointer-events-none"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <div className="flex items-center justify-between border border-white/10 rounded-xl bg-white/[0.01] px-4 py-2 sm:w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-gray-400 hover:text-white transition p-1"
              >
                <Minus size={14} />
              </button>
              <span className="text-white text-xs font-mono font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-gray-400 hover:text-white transition p-1"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 bg-white text-black py-4 rounded-xl text-[10px] uppercase tracking-[0.25em] font-bold transition-all flex items-center justify-center gap-2 hover:bg-[#d4af37] hover:text-white disabled:opacity-80"
            >
              {isAdding ? (
                <>
                  <Check size={14} /> Added to Cart
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`p-4 border rounded-xl flex items-center justify-center transition-all ${
                wishlisted
                  ? 'border-red-500/30 bg-red-500/10 text-red-500'
                  : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
            {[
              { icon: Truck, title: 'Free Delivery', sub: 'On orders over $200' },
              { icon: RefreshCw, title: 'Easy Returns', sub: '30-day window' },
              { icon: Shield, title: 'Secure Check', sub: '100% Encrypted' },
            ].map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.01] border border-white/[0.02]"
              >
                <Icon size={16} className="text-[#d4af37] mb-2" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-white block mb-1">
                  {title}
                </span>
                <span className="text-[8px] text-gray-500 font-light">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24 border-t border-white/5 pt-16">
        <div className="flex gap-8 mb-12 border-b border-white/5 pb-4 relative">
          {[
            { id: 'description', label: 'Description' },
            { id: 'care', label: 'Care Details' },
            { id: 'reviews', label: `Reviews (${displayReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs uppercase tracking-[0.2em] font-medium pb-4 relative transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-white/80'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37]"
                />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-400 leading-relaxed font-light max-w-3xl space-y-4"
              >
                <p>{product.description}</p>
                <div className="pt-4 grid grid-cols-2 gap-4 text-xs font-light text-gray-500">
                  <div className="flex items-center gap-2">
                    <CornerDownRight size={10} className="text-[#d4af37]" /> Sourced
                    organically from local farms
                  </div>
                  <div className="flex items-center gap-2">
                    <CornerDownRight size={10} className="text-[#d4af37]" /> Low carbon
                    footprint manufacturing
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'care' && (
              <motion.div
                key="care"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-400 leading-relaxed font-light max-w-3xl space-y-4"
              >
                <p>{product.careDetails || 'No care instructions provided.'}</p>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-[1fr,350px] gap-12 items-start"
              >
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                  {reviewsLoading && displayReviews.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                      <Loader className="animate-spin text-[#d4af37]" size={24} />
                    </div>
                  )}

                  {!reviewsLoading && displayReviews.length === 0 && (
                    <div className="text-center text-xs text-gray-500 py-12">
                      No reviews yet. Be the first to review this product.
                    </div>
                  )}

                  {displayReviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest block">
                            {r.name}
                          </span>
                          <span className="text-[9px] text-gray-500 font-mono">{r.date}</span>
                        </div>
                        <div className="flex text-[#d4af37]">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              size={10}
                              fill={idx < r.rating ? 'currentColor' : 'none'}
                              className={
                                idx < r.rating ? 'text-[#d4af37]' : 'text-gray-800'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        {r.text}
                      </p>

                      <div className="flex gap-4 pt-3 border-t border-white/5">
                        <button
                          onClick={() => handleReactToReview(r.id!, 1)}
                          className="text-[10px] text-gray-500 hover:text-[#d4af37] transition flex items-center gap-1"
                        >
                          👍 Helpful ({r.react ?? 0})
                        </button>
                        {accessToken && (
                          <button
                            onClick={() => handleDeleteReview(r.id!)}
                            className="text-[10px] text-gray-500 hover:text-red-400 transition ml-auto"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#d4af37]" />
                    <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
                      Write a Review
                    </h4>
                  </div>

                  {reviewsError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2">
                      <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-red-300 font-medium">Error</p>
                        <p className="text-[8px] text-red-200/80">{reviewsError}</p>
                      </div>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex gap-2">
                      <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[9px] text-emerald-300">Review posted successfully!</p>
                    </div>
                  )}

                  {!accessToken ? (
                    <div className="text-center py-6 space-y-3">
                      <p className="text-[9px] text-gray-400">
                        Sign in to leave a review
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsLoginOpen(true)}
                        className="inline-block px-4 py-2 bg-[#d4af37] text-black text-[9px] uppercase tracking-widest font-bold rounded-lg hover:bg-white transition"
                      >
                        Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAddReview} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-gray-500">
                          Rating
                        </label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="text-[#d4af37] transition-transform hover:scale-125"
                            >
                              <Star
                                size={16}
                                fill={star <= newRating ? 'currentColor' : 'none'}
                                className={
                                  star <= newRating
                                    ? 'text-[#d4af37]'
                                    : 'text-gray-700'
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-gray-500">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Your name"
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-[#d4af37]/60"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-gray-500">
                          Review
                        </label>
                        <textarea
                          required
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full h-24 bg-black border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-[#d4af37]/60 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full bg-[#f5f5f4] text-black py-2.5 rounded-lg text-[9px] uppercase tracking-widest font-bold hover:bg-[#d4af37] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader size={12} className="animate-spin" /> Submitting...
                          </>
                        ) : (
                          'Submit Review'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {suggested.length > 0 && (
        <div className="mt-32 border-t border-white/5 pt-16">
          <h3 className="text-xl font-serif italic text-white mb-12">You Might Also Like ({suggested.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {suggested.map((p, i) => {
              const thumb = p.images?.find((img) => img.type === 'main') ?? p.images?.[0];
              const grad = GRADIENTS[i % GRADIENTS.length];
              return (
                <Link key={p.encodedId} href={`/product/${p.encodedId}`} className="group space-y-4">
                  <div
                    className={`h-80 rounded-xl relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02] border border-transparent group-hover:border-white/10 ${
                      thumb?.image ? 'bg-black' : `bg-gradient-to-br ${grad}`
                    }`}
                  >
                    {thumb?.image ? (
                      <Image
                        src={thumb.image}
                        alt={p.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />
                    )}
                    {p.collection && (
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 text-[9px] text-white uppercase tracking-widest">
                        {p.collection}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white font-medium">
                      {p.name}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-500 font-medium">
                      ${p.price}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;