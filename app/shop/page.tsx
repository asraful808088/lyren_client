'use client';

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import ShopHero from '@/components/ShopHero';
import ProductGrid from '@/components/ProductGrid';
import ProductFilter from '@/components/ProductFilter';
import NewArrivalsSection from '@/components/NewArrivalsSection';
import SustainabilityCommitment from '@/components/SustainabilityCommitment';
import Testimonials from '@/components/Testimonials';
import ShopServicesHighlight from '@/components/ShopServicesHighlight';
import UniqueAtelierVisit from '@/components/UniqueAtelierVisit';
import FeaturedCollection from '@/components/FeaturedCollection';
import { UIProduct } from '@/data/products';

import { productApi , Product, getErrorMessage} from "@/services/authApi";
const GRADIENTS = [
  'from-rose-900/40 to-black',
  'from-amber-900/40 to-black',
  'from-emerald-900/40 to-black',
  'from-violet-900/40 to-black',
  'from-sky-900/40 to-black',
];
function mapToUI(p: Product, idx: number): UIProduct {
  const mainImg = p.images?.find(i => i.type === 'main') ?? p.images?.[0];
  
  const discountPrice = p.discount > 0 && p.discount < 100
    ? +(p.price * (1 - p.discount / 100)).toFixed(2)
    : undefined;

  return {
    id:            String(p.id),
    name:          p.name,
    description:   p.miniDesc,
    price:         p.price,
    discountPrice,
    rating:        p.averageRating ?? 0,
    tag:           p.collection || undefined,
    category:      p.category || 'All',
    imageUrl:      mainImg?.image,
    imageColor:    GRADIENTS[idx % GRADIENTS.length],
    encodedId:p.encodedId
  };
}

interface FilterState {
  minRating: number;
  minPrice: number;
  maxPrice: number;
  showDiscounts: boolean;
  sortBy: string;
  tag: string;
  searchTerm: string;
  category: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const PAGE_SIZE = 12;

function ShopContent() {
  const searchParams   = useSearchParams();
  const categoryParam  = searchParams.get('category') || 'All';

  const [products,  setProducts]  = useState<UIProduct[]>([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [filters,   setFilters]   = useState<FilterState | null>(null);

  const fetchProducts = useCallback(async (f: FilterState, p: number) => {
    setLoading(true);
    setError(null);
    try {
      let res;

      if (f.searchTerm.trim()) {
        res = await productApi.search(f.searchTerm.trim(), p, PAGE_SIZE);
      } else if (f.tag !== 'All') {
        res = await productApi.getByCollection(f.tag, p, PAGE_SIZE);
      } else if (f.category !== 'All') {
        res = await productApi.getByCategory(f.category, p, PAGE_SIZE);
      } else {
        res = await productApi.getAll(p, PAGE_SIZE);
      }
      
      const paged = res.data!;
      console.log(paged)
let mapped = (paged.data ?? []).map((pr, i) => mapToUI(pr, i));

      
      mapped = mapped.filter(pr =>
        pr.price >= f.minPrice &&
        pr.price <= f.maxPrice &&
        (!f.showDiscounts || pr.discountPrice !== undefined)
      );
      if (f.sortBy === 'price-asc')  mapped.sort((a, b) => a.price - b.price);
      if (f.sortBy === 'price-desc') mapped.sort((a, b) => b.price - a.price);

      setProducts(mapped);
setTotal(paged.total);
    } catch (err) {
      console.warn("API call failed, falling back to local mock products:", err);
      try {
        const { products: mockProducts } = await import('@/data/products');
        let filtered = mockProducts.map((pr, i) => {
          const discountPrice = pr.discountPrice;
          return {
            id: String(pr.id),
            name: pr.name,
            description: pr.description,
            price: pr.price,
            discountPrice,
            rating: pr.rating,
            tag: pr.tag,
            category: pr.category || 'All',
            imageColor: pr.imageColor,
            imageUrl: undefined,
            encodedId: String(pr.id),
          };
        });

        if (f.category !== 'All') {
          filtered = filtered.filter(p => p.category === f.category);
        }
        if (f.tag !== 'All') {
          filtered = filtered.filter(p => p.tag === f.tag);
        }
        if (f.searchTerm.trim()) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(f.searchTerm.trim().toLowerCase()));
        }
        filtered = filtered.filter(pr =>
          pr.price >= f.minPrice &&
          pr.price <= f.maxPrice &&
          (!f.showDiscounts || pr.discountPrice !== undefined)
        );
        if (f.sortBy === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
        if (f.sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);

        setProducts(filtered);
        setTotal(filtered.length);
      } catch (fallbackErr) {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filters) fetchProducts(filters, page);
  }, [filters, page, fetchProducts]);
 
  const handleFilterChange = (f: FilterState) => {
    setPage(1);
    setFilters(f);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <motion.main
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 py-24 flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-[320px] shrink-0">
          <ProductFilter
            key={categoryParam}
            onFilterChange={handleFilterChange}
            initialCategory={categoryParam}
          />
        </aside>

        <div className="flex-1 flex flex-col gap-8">
          {categoryParam !== 'All' && (
            <div className="flex items-center gap-3 px-4 py-3 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg">
              <span className="text-[#d4af37] text-[10px] uppercase tracking-widest font-semibold">
                {categoryParam === 'For Him' ? '♂' : categoryParam === 'For Her' ? '♀' : '◈'}
                &nbsp;Showing: {categoryParam}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5 pb-4">
            <span className="text-gray-400">
              {loading ? 'Loading…' : `${total} Products Found`}
            </span>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/[0.02] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <ProductGrid
              products={products}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <div className="border-t border-white/5 pt-24 pb-24">
        <NewArrivalsSection />
      </div>
      <div className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6"><SustainabilityCommitment /></div>
      </div>
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6"><Testimonials /></div>
      </div>
      <div className="py-24 bg-[#0d0d0d]"><ShopServicesHighlight /></div>
      <div><UniqueAtelierVisit /></div>
    </motion.main>
  );
}

function ShopFallback() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-24 flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-[320px] h-96 bg-white/[0.02] animate-pulse rounded-xl shrink-0" />
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-white/[0.02] animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <ShopHero />
      <Suspense fallback={<ShopFallback />}>
        <ShopContent />
      </Suspense>
      <FeaturedCollection />
    </div>
  );
}