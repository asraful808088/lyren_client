'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

const team = [
    { name: 'Jean Pierre', role: 'Master Tailor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop' },
    { name: 'Claire Dubois', role: 'Head Designer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop' },
    { name: 'Marc Laurent', role: 'Artisan Specialist', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop' },
];

export default function AboutArtisans() {
    return (
        <section className="py-24 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6">
                <h3 className="text-center text-[#d4af37] text-[10px] uppercase tracking-[0.4em] mb-16">The Artisans</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {team.map((member, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group border border-white/5 bg-[#0d0d0d] overflow-hidden relative h-80"
                        >
                            <Image src={member.img} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h4 className="text-sm text-white font-medium">{member.name}</h4>
                                <p className="text-[10px] uppercase tracking-widest text-[#d4af37] mt-1">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
