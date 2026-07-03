import { Star, CheckCircle } from 'lucide-react';
import { FC } from 'react';
import { UIProduct } from '@/data/products';

interface ProductInfoProps {
  product: UIProduct;
}

const ProductInfo: FC<ProductInfoProps> = ({ product }) => (
  <div className="flex flex-col gap-2 mb-4">
    <div className="flex justify-between items-start">
      <h3 className="text-sm font-medium tracking-tight text-white">{product.name}</h3>
      <div className="flex items-center gap-1 text-[#d4af37]">
        <Star size={12} fill="currentColor" />
        <span className="text-[10px] font-mono">{product.rating.toFixed(1)}</span>
      </div>
    </div>
    
    <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider">
      <div className="flex items-center gap-1 text-emerald-500/80">
        <CheckCircle size={10} />
        <span>In Stock</span>
      </div>
      {product.tag && (
        <span className="bg-white/5 px-2 py-0.5 rounded text-white/70">
            {product.tag}
        </span>
      )}
    </div>
  </div>
);

export default ProductInfo;
