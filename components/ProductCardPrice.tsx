import { FC } from 'react';
import { UIProduct } from '@/data/products';

interface ProductPriceProps {
  product: UIProduct;
}

const ProductPrice: FC<ProductPriceProps> = ({ product }) => (
  <div className="flex items-center gap-3">
    <span className={`font-serif text-md ${product.discountPrice !== undefined ? 'text-red-400 line-through opacity-80' : 'text-white'}`}>
      ${product.price}
    </span>
    {product.discountPrice !== undefined && (
      <span className="font-serif text-md text-white">${product.discountPrice}</span>
    )}
  </div>
);

export default ProductPrice;