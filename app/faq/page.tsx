'use client';

import { motion } from "motion/react";
import PageHero from '@/components/PageHero';
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function FAQ() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PageHero title="FAQ" subtitle="Everything you need to know about your order." category="faq" />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <FrequentlyAskedQuestions />
      </motion.div>
    </div>
  );
}
