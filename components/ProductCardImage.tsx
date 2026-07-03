'use client';

import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import Image from 'next/image';
import { UIProduct } from '@/data/products';
import { useFavorites } from '@/context/FavoritesContext';

interface ProductImageProps {
  product: UIProduct;
  onAddToCart: (product: UIProduct) => void;
}

const ProductImage: FC<ProductImageProps> = ({ product, onAddToCart }) => {
  const router = useRouter();
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();

  const id = String(product.id);
  const wishlisted = isFavorited(id);

  const handleToggleWishlist = () => {
    if (wishlisted) {
      removeFavorite(id);
    } else {
      addFavorite({
        id,
        name: product.name,
        price: product.discountPrice ?? product.price,
        image: product.imageUrl ?? '',
      });
    }
  };

  return (
    <div className={`h-80 mb-6 relative overflow-hidden rounded-lg flex items-end p-6 ${product.imageUrl ? 'bg-black' : `bg-gradient-to-br ${product.imageColor}`}`}>
      {product.imageUrl && (
        <Image src={product.imageUrl} alt={product.name} fill
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
      )}
      {product.tag && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 text-[10px] text-white uppercase tracking-widest z-10">
          {product.tag}
        </div>
      )}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button onClick={() => onAddToCart(product)}
          className="bg-white/10 backdrop-blur-sm p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <ShoppingBag size={16} />
        </button>
        <button onClick={handleToggleWishlist}
          className={`bg-white/10 backdrop-blur-sm p-3 transition-opacity rounded-full opacity-0 group-hover:opacity-100 ${wishlisted ? 'text-red-500' : 'text-white'}`}>
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => router.push(`/product/${product.encodedId}`)}
          className="bg-white/10 backdrop-blur-sm p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <Eye size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductImage;