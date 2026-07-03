'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRandomImage } from '@/hook/useRandomImage';

export default function ShopHero() {
  const bgImage = useRandomImage('shop');

  return (
    <section className="relative h-[60vh] flex flex-col items-center justify-center border-b border-white/10 text-center overflow-hidden bg-[#060606]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 px-4 max-w-3xl"
      >
        <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] mb-4 block">The Artisanal Collection</span>
        <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-8 leading-[0.9]">Curated Essentials</h1>
        <p className="text-gray-400 font-light leading-relaxed mb-6">
          Explore a carefully refined selection of garments where modern silhouettes meet traditional craftsmanship. Each piece has been brought to life with intention, designed to harmonize effortlessly with your daily rhythm.
        </p>
        <p className="text-gray-500 font-light text-sm italic">
          Consciously crafted. Timelessly designed. Made for the quiet beauty of everyday life.
        </p>
      </motion.div>
      <div className="absolute inset-0 bg-[#060606]">
        {bgImage && (
          <Image 
            src={bgImage} 
            alt="Shop Background" 
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[#060606]/60" />
      </div>
    </section>
  );
}
