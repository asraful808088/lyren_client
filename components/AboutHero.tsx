'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRandomImage } from '@/hook/useRandomImage';

export default function AboutHero() {
  const bgImage = useRandomImage('about');

  return (
    <section className="relative h-[80vh] flex items-center justify-center border-b border-white/10 overflow-hidden bg-[#060606]">
      <div className="absolute inset-0">
        {bgImage && (
          <Image 
            src={bgImage} 
            alt="Atelier" 
            fill
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 px-6 text-center max-w-3xl"
      >
        <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] mb-4 block">Our Philosophy</span>
        <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-8 leading-[0.9]">Atelier & Craft</h1>
        <p className="text-gray-200 font-light text-lg leading-relaxed mb-6">
          We believe in slow fashion. Every garment in our collection is a testament to the hands that made it, and the stories they weave together. We prioritize craftsmanship, longevity, and thoughtfulness in every stitch.
        </p>
      </motion.div>
    </section>
  );
}
