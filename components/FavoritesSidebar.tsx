'use client';

import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { Product } from '../data/products';
import { PriceTag } from './PriceTag';

export default function FavoritesSidebar() {
  const { favorites, removeFavorite, isOpen, setIsOpen } = useFavorites();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f0f0f] border-l border-white/10 z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Heart size={16} className="text-[#d4af37]" />
            <span className="text-xs tracking-[0.25em] uppercase text-white font-medium">
              Saved Items
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {favorites.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Heart size={24} className="text-gray-700 mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                No saved items
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-white/5 pb-6 last:border-0"
              >
                <div className="relative w-20 h-24 bg-[#1a1a1a] rounded overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900" />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-white/80 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[13px] font-light text-[#d4af37] mt-1">
                      <PriceTag price={item.price} discountPrice={item.discountPrice} />
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => {
                        if (addToCart) {
                          addToCart({
                            id: Number(item.id),
                            name: item.name,
                            price: item.price,
                            discountPrice: item.discountPrice,
                            description: '',
                            rating: 5,
                            imageColor: 'from-gray-700 to-gray-900',
                          } as Product);
                        }
                      }}
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition"
                    >
                      <ShoppingBag size={11} />
                      Add to bag
                    </button>

                    <span className="w-px h-3 bg-white/10" />

                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="text-gray-600 hover:text-red-400 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {favorites.length > 0 && (
          <div className="px-6 py-5 border-t border-white/10">
            <p className="text-[10px] text-center text-gray-600 tracking-[0.15em] uppercase">
              {favorites.length} item{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        )}
      </div>
    </>
  );
}