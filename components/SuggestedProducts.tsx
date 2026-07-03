import { FC } from 'react';
import Link from 'next/link';
import { products } from '../data/products';

const SuggestedProducts: FC = () => {
  return (
    <div className="py-24 border-t border-white/5">
      <h3 className="text-xl text-white font-serif italic mb-12">You Might Also Like</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {products.slice(0, 8).map(p => (
          <Link key={p.id} href={`/product/${p.id}`} className="group">
            <div className={`h-64 mb-4 bg-gradient-to-br ${p.imageColor}`} />
            <h4 className="text-sm text-white">{p.name}</h4>
            <p className="text-xs text-gray-500">${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
