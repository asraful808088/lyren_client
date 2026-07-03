'use client';

import { motion } from "motion/react";
import Hero from '@/components/Hero';
import LookbookHighlight from '@/components/LookbookHighlight';
import CategoryBanner from '@/components/CategoryBanner';
import FeaturedCollection from '@/components/FeaturedCollection';
import Newsletter from '@/components/Newsletter';
import Gallery from '@/components/Gallery';
import HomeTestimonials from '@/components/HomeTestimonials';
import HomeStoreFeatures from '@/components/HomeStoreFeatures';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  return (
    <div className="bg-[#0a0a0a]">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <Hero />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <LookbookHighlight />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <CategoryBanner />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <FeaturedCollection />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <Gallery />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <HomeStoreFeatures />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <HomeTestimonials />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <Newsletter />
      </motion.div>
    </div>
  );
}
