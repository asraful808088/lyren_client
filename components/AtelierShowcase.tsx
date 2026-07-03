'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function AtelierShowcase() {
  return (
    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden border border-white/10 group">
      <Image
          src="/assets/about/lighten-up-DcFJuWICOSY-unsplash.jpg"
          alt="Atelier"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
        <h4 className="text-white font-serif italic text-xl mb-2">Visit our Atelier</h4>
        <p className="text-xs text-gray-400 font-light max-w-xs">Experience the artistry behind our collection in person.</p>
      </div>
    </div>
  );
}
