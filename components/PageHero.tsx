'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRandomImage } from '@/hook/useRandomImage';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  category?: 'contact' | 'faq';
}

export default function PageHero({ title, subtitle, category }: PageHeroProps) {
  const bgImage = useRandomImage(category || 'faq');

  return (
    <section className="relative py-28 border-b border-white/10 text-center overflow-hidden bg-[#060606]">
      {category && bgImage && (
        <div className="absolute inset-0">
          <Image
            src={bgImage}
            alt="Page Hero Background"
            fill
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[#060606]/40" />
        </div>
      )}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-serif leading-[0.9] mb-6 italic text-white">{title}</h1>
        {subtitle && <p className="text-sm opacity-80 leading-relaxed max-w-sm mx-auto font-light">{subtitle}</p>}
      </motion.div>
    </section>
  );
}
