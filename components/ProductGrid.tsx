'use client';

import ProductCard from './ProductCard';
import { UIProduct } from '@/data/products';
import Pagination from './Pagination';

interface ProductGridProps {
  products: UIProduct[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductGrid({ products, currentPage, totalPages, onPageChange }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-4xl opacity-20">◈</span>
        <p className="text-gray-500 text-xs uppercase tracking-widest">No products match your filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}