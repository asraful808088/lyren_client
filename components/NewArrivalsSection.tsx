'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { productService, type Product } from '@/services/productService';

const NewArrivalsSection: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrending() {
      try {
        setLoading(true);
        const data = await productService.getTrendingProducts();
        if (!cancelled) setProducts(data);
      } catch (e) {
        if (!cancelled) setError('Could not load trending products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTrending();
    return () => { cancelled = true; };
  }, []);

  // Don't render the section at all if there's nothing to show and we're done loading
  if (!loading && !error && products.length === 0) return null;

  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl font-light text-white mb-12">New & Trending</h2>

        {error && (
          <p className="text-xs text-gray-500 font-light">{error}</p>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-[#0a0a0a] p-8 border border-white/10 animate-pulse">
                <div className="h-64 bg-zinc-900 mb-8" />
                <div className="h-3 w-2/3 bg-zinc-800 mb-2" />
                <div className="h-3 w-1/2 bg-zinc-900" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const mainImage =
                product.images?.find((img) => img.type === 'main')?.image ??
                product.images?.[0]?.image;

              return (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="bg-[#0a0a0a] p-8 border border-white/10 group"
                >
                  <div className="h-64 bg-zinc-900 mb-8 overflow-hidden">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <h3 className="text-sm text-white mb-2 tracking-tight">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-6 font-light line-clamp-2">
                    {product.miniDesc}
                  </p>
                  <Link
                    href={`/product/${product.encodedId}`}
                    className="text-[10px] uppercase tracking-widest text-[#d4af37] border-b border-[#d4af37] pb-1 hover:text-white hover:border-white transition-colors inline-block"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivalsSection;