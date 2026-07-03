import { FC } from 'react';
import { Product } from '../data/products';

interface SmallProductCardProps {
  product: Product;
}

const SmallProductCard: FC<SmallProductCardProps> = ({ product }) => (
  <div className="flex items-center gap-4 bg-[#0a0a0a] p-3 border border-white/5 hover:border-[#d4af37]/20 transition-all">
    <div className={`w-16 h-16 ${product.imageColor}`}></div>
    <div>
      <h4 className="text-[10px] uppercase tracking-widest">{product.name}</h4>
      <p className="text-[9px] text-[#d4af37]">${product.price}</p>
    </div>
  </div>
);

export default SmallProductCard;
