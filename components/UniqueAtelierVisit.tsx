import { FC } from 'react';
import { motion } from 'motion/react';

const UniqueAtelierVisit: FC = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0 opacity-10">
        
        <div className="absolute -top-1/2 -right-1/4 w-full h-full rounded-full bg-[#d4af37] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="block text-[#d4af37] text-[8px] uppercase tracking-[0.4em] mb-6">Experience the craft</span>
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-10 leading-tight">
            Visit Our Atelier
          </h2>
          <p className="text-base text-gray-400 font-light mb-12 leading-relaxed max-w-2xl mx-auto">
            Step behind the scenes and witness the meticulous artistry that defines our collection. 
            Join us in our workshop for a curated look at our process, materials, and the passion that brings each piece to life.
          </p>
          <button className="px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-white transition-colors duration-300">
            Book a Private Tour
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default UniqueAtelierVisit;
