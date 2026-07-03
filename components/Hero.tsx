'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useRandomImage } from '@/hook/useRandomImage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any } 
  },
};

export default function Hero() {
  const router = useRouter();
  const bgImage = useRandomImage('home');

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#060606]">
      <div className="absolute inset-0">
        {bgImage && (
          <Image
            src={bgImage}
            alt="Hero"
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      
      <motion.div 
        className="relative z-10 text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="text-[#d4af37] font-medium uppercase tracking-[0.6em] mb-6 text-[11px]">
          Summer 2026 Collection
        </motion.h2>
        <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-serif text-white mb-8 italic tracking-tighter">
          The Awakening
        </motion.h1>
        <motion.div variants={itemVariants} className="text-white/70 max-w-lg mx-auto mb-10 text-base font-light leading-relaxed space-y-4">
          <p>
            Discover a collection defined by serene lines and ethereal textures, designed for the quiet moments that matter.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-[#d4af37]/80 text-[10px] uppercase tracking-[0.2em] mb-10">
          Handcrafted • Sustainable • Minimalist
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4 justify-center">
          <button 
            onClick={() => router.push('/shop')}
            className="text-white border-b-2 border-[#d4af37] px-4 py-2 uppercase tracking-widest text-[10px] hover:text-[#d4af37] hover:border-[#d4af37] transition-all duration-300 transform hover:scale-105"
          >
            Explore Collection
          </button>
          <button 
             onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="text-white border-b-2 border-white/30 px-4 py-2 uppercase tracking-widest text-[10px] hover:border-white transition-all duration-300 transform hover:scale-105"
          >
            View Details
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
