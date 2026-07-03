'use client';

import { FC } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

const NotFound: FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-8xl font-serif italic text-white mb-6">404</h1>
        <p className="text-gray-400 mb-10 text-lg">The page you are looking for does not exist.</p>
        <Link 
          href="/" 
          className="px-8 py-3 border border-white/20 text-white uppercase text-xs tracking-[0.2em] hover:bg-[#d4af37] hover:border-[#d4af37] transition-all"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
