'use client';

import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import AtelierShowcase from '@/components/AtelierShowcase';
import Newsletter from '@/components/Newsletter';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PageHero title="Contact Us" subtitle="We're here to assist you." category="contact" />
      <div className="container mx-auto px-6 py-12 md:py-24 space-y-16 md:space-y-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <ContactInfo />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <ContactForm />
          </motion.div>
        </div>
        
        
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <AtelierShowcase />
        </motion.div>
      </div>
      <Newsletter />
    </div>
  );
}
