'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Search, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { productApi, Product, getErrorMessage } from  '@/services/authApi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  'Fresh',
  'T-Shirt',
  'Sharp',
  'Touch Tee',
  'Classic Tee',
];

const TRENDING = [
  { label: 'New Arrivals', href: '/shop' },
  { label: 'Sale',         href: '/shop' },
  { label: 'For Him',      href: '/shop' },
  { label: 'For Her',      href: '/shop' },
];

const GRADIENTS = [
  'from-rose-900/40 to-black',
  'from-amber-900/40 to-black',
  'from-emerald-900/40 to-black',
  'from-violet-900/40 to-black',
  'from-sky-900/40 to-black',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router     = useRouter();
  const inputRef   = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setError(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);



  const handleProductClick = (id: number | string) => {
    router.push(`/product/${id}`);
    onClose();
  };

  const handleViewAll = () => {
    router.push(`/shop?search=${encodeURIComponent(query)}`);
    onClose();
  };


    const handleQueryChange = useCallback((value: string) => {
  setQuery(value);
  clearTimeout(debounceRef.current);

  if (!value.trim()) {
    setResults([]);
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);

  debounceRef.current = setTimeout(async () => {
    try {
     
      const [searchRes, categoryRes, collectionRes] = await Promise.allSettled([
        productApi.search(value.trim(), 1, 12),
        productApi.getByCategory(value.trim(), 1, 6),
        productApi.getByCollection(value.trim(), 1, 6),
      ]);

      const searchItems   = searchRes.status     === 'fulfilled' ? (searchRes.value.data?.data     ?? []) : [];
      const categoryItems = categoryRes.status   === 'fulfilled' ? (categoryRes.value.data?.data   ?? []) : [];
      const collectionItems = collectionRes.status === 'fulfilled' ? (collectionRes.value.data?.data ?? []) : [];

      
      const seen = new Set<string | number>();
      const merged: Product[] = [];

      for (const p of [...searchItems, ...categoryItems, ...collectionItems]) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          merged.push(p);
        }
      }

      const q = value.toLowerCase();
      const scored = merged
        .map(p => {
          const name       = p.name.toLowerCase();
          const desc       = p.miniDesc?.toLowerCase() ?? '';
          const category   = p.category?.toLowerCase() ?? '';
          const collection = p.collection?.toLowerCase() ?? '';

          let score = 0;
          if (name === q)                   score += 100; 
          if (name.startsWith(q))           score += 60;  
          if (name.includes(q))             score += 40; 
          if (category.includes(q))         score += 20;  
          if (collection.includes(q))       score += 15;  
          if (desc.includes(q))             score += 10;  

          let fi = 0;
          for (const ch of q) {
            const idx = name.indexOf(ch, fi);
            if (idx !== -1) { score += 2; fi = idx + 1; }
          }

          return { product: p, score };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(x => x.product);

      setResults(scored);
    } catch (err) {
      setError(getErrorMessage(err));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 250); 
}, []);




  if (!isOpen) return null;

  const hasQuery   = query.length > 1;
  const hasResults = results.length > 0;

  return (
    <>
      
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
        onClick={onClose}
      />

      
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-white/10">
        
        <div className="container mx-auto px-4 flex items-center gap-4 py-6">
          {loading
            ? <Loader2 size={16} className="text-[#d4af37] animate-spin flex-shrink-0" />
            : <Search size={16} className="text-[#d4af37] flex-shrink-0" />
          }
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search for styles, pieces, collections…"
            className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm tracking-wide outline-none border-none"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="text-gray-600 hover:text-white transition p-1 flex-shrink-0"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition p-1 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        
        <div className="w-full h-px bg-white/5" />

        
        <div className="container mx-auto px-4 py-6 pb-8">

          
          {hasQuery ? (
            <>
              {error && (
                <p className="text-xs text-red-400 tracking-wide">{error}</p>
              )}

              {!error && hasResults && (
                <>
                  
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-gray-600">
                      {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                    </p>
                    {results.length >= 6 && (
                      <button
                        onClick={handleViewAll}
                        className="text-[10px] tracking-[0.2em] uppercase text-[#d4af37] hover:text-white transition flex items-center gap-1"
                      >
                        View All <ArrowUpRight size={11} />
                      </button>
                    )}
                  </div>

                  
                  <ul className="space-y-1">
                    {results.map((product, i) => {
                      const mainImg = product.images?.find(img => img.type === 'main') ?? product.images?.[0];
                      const grad    = GRADIENTS[i % GRADIENTS.length];
                      const discountPrice = product.discount > 0 && product.discount < 100
                        ? +(product.price * (1 - product.discount / 100)).toFixed(2)
                        : null;

                      return (
                        <li key={product.id}>
                          <button
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-4 group py-2.5 hover:bg-white/[0.02] px-2 rounded-lg transition text-left"
                          >
                            
                            <div className={`w-11 h-11 rounded-lg shrink-0 overflow-hidden relative ${mainImg?.image ? 'bg-black' : `bg-gradient-to-br ${grad}`}`}>
                              {mainImg?.image && (
                                <Image src={mainImg.image} alt={product.name} fill className="object-cover" />
                              )}
                            </div>

                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-300 group-hover:text-white transition tracking-wide truncate">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-gray-600 truncate mt-0.5 tracking-[0.1em] uppercase">
                                {[product.category, product.collection].filter(Boolean).join(' · ')}
                              </p>
                            </div>

                            
                            <div className="text-right shrink-0">
                              {discountPrice ? (
                                <>
                                  <p className="text-xs text-white font-mono">${discountPrice}</p>
                                  <p className="text-[10px] text-red-400 line-through font-mono">${product.price}</p>
                                </>
                              ) : (
                                <p className="text-xs text-gray-300 font-mono">${product.price}</p>
                              )}
                            </div>

                            <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#d4af37] shrink-0" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {!error && !loading && !hasResults && (
                <p className="text-xs text-gray-600 tracking-wide">
                  No results for &ldquo;<span className="text-gray-400">{query}</span>&rdquo;
                </p>
              )}
            </>

          ) : (
            
            <div className="flex flex-col sm:flex-row gap-10">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-600 mb-4">Trending</p>
                <ul className="space-y-1">
                  {TRENDING.map((t) => (
                    <li key={t.label}>
                      <Link
                        href={t.href}
                        onClick={onClose}
                        className="flex items-center gap-2 group text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-white transition py-1.5"
                      >
                        <ArrowUpRight size={11} className="text-[#d4af37] opacity-60 group-hover:opacity-100 transition" />
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-600 mb-4">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleQueryChange(s)}
                      className="px-3 py-1.5 border border-white/10 text-[10px] tracking-[0.15em] uppercase text-gray-500 hover:border-[#d4af37]/40 hover:text-white transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}