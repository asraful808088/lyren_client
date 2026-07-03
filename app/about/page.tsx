'use client';

import { motion } from "motion/react";
import AboutHero from '@/components/AboutHero';
import AboutAtelier from '@/components/AboutAtelier';
import AboutSustainabilityCommitment from '@/components/AboutSustainabilityCommitment';
import AboutStoreFeatures from '@/components/AboutStoreFeatures';
import AboutTestimonials from '@/components/AboutTestimonials';
import AboutTimeline from '@/components/AboutTimeline';
import AboutArtisans from '@/components/AboutArtisans';
import Gallery from '@/components/Gallery';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function About() {
  return (
    <div className="bg-[#050505] text-white">
      <AboutHero />
      

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <AboutAtelier />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <Gallery />
            </motion.div>
        </div>
      </section>

      <AboutTimeline />

     
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-[#d4af37] text-[10px] uppercase tracking-[0.4em] mb-16">Our Commitments</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#0d0d0d] p-8 rounded-sm border border-white/5">
                    <AboutSustainabilityCommitment />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#0d0d0d] p-8 rounded-sm border border-white/5">
                    <AboutStoreFeatures />
                </motion.div>
            </div>
        </div>
      </section>

     
      <AboutArtisans />

   
      <section className="py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <AboutTestimonials />
        </motion.div>
      </section>
    </div>
  );
}
