'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqItems = [
    { q: 'How is the atelier quality ensured?', a: 'Every garment is handcrafted using premium, ethically sourced textiles by master artisans to ensure longevity.' },
    { q: 'What is the shipping policy?', a: 'We offer complimentary express shipping on all domestic orders over $200.' },
    { q: 'How do I handle returns?', a: 'Returns are accepted within 30 days, provided the items remain in their original, unworn condition.' },
    { q: 'Can I customize my order?', a: 'We offer limited customization on bespoke pieces. Please contact us via our concierge service for details.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship to most locations worldwide using reliable courier partners.' },
    { q: 'How do I join the loyalty program?', a: 'You are automatically enrolled after your first purchase. Check your account settings for tiers and rewards.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay.' },
    { q: 'Are your materials sustainable?', a: 'We exclusively select GOTS-certified silks, organic linens, and regenerative wools.' },
];

export default function FrequentlyAskedQuestions() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 border-b border-white/10 bg-[#0a0a0a]">
            <div className="container mx-auto px-4 max-w-5xl">
                <h3 className="text-center text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-12">Assistance</h3>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                    {faqItems.map((item, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="border-b border-white/5 pb-4"
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex justify-between items-center py-2 text-left"
                            >
                                <span className="text-sm font-light tracking-wide">{item.q}</span>
                                {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-xs opacity-50 pt-2 leading-relaxed">{item.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
