'use client';

import { FC } from 'react';
import { UIProduct } from '@/data/products';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductCardImage';
import ProductInfo from './ProductCardInfo';
import ProductPrice from './ProductCardPrice';

const ProductCard: FC<{ product: UIProduct }> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-[#0a0a0a] p-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 group border border-transparent hover:border-white/10">
      <ProductImage
        product={product}
        onAddToCart={(p) => {
          addToCart({
            id: Number(p.id),
            name: p.name,
            price: p.price,
            description: p.description || '',
            rating: p.rating || 5,
            imageColor: p.imageColor || 'from-gray-700 to-gray-900',
            discountPrice: p.discountPrice,
            tag: p.tag,
            category: p.category as any,
          });
        }}
      />
      <ProductInfo product={product} />
      <p className="text-[10px] opacity-40 mb-4 h-8 tracking-wide">{product.description}</p>
      <ProductPrice product={product} />
    </div>
  );
};

export default ProductCard;