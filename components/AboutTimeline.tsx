'use client';

import { motion } from 'motion/react';

const events = [
    { year: '2015', title: 'Atelier Founded', desc: 'Established in the heart of Paris with a vision for timeless artistry.' },
    { year: '2018', title: 'Sustainable Shift', desc: 'Transitioned to 100% ethically sourced textiles and organic production.' },
    { year: '2022', title: 'Global Recognition', desc: 'Awarded for excellence in conscious luxury and master craftsmanship.' },
];

export default function AboutTimeline() {
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6">
                <h3 className="text-center text-[#d4af37] text-[10px] uppercase tracking-[0.4em] mb-16">Our Journey</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {events.map((event, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 border border-white/5 bg-[#0d0d0d] hover:border-[#d4af37]/30 transition-all duration-300"
                        >
                            <span className="text-[#d4af37] text-xs font-mono mb-4 block">{event.year}</span>
                            <h4 className="text-xl font-serif text-white mb-4">{event.title}</h4>
                            <p className="text-sm text-gray-400 font-light leading-relaxed">{event.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
