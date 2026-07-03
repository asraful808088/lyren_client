'use client';

import { FC } from 'react';
import { motion } from 'motion/react';
import { Package, ShieldCheck, Gift, Headphones } from 'lucide-react';

const services = [
  { icon: Package, title: "Carbon Neutral Shipping", description: "Delivered with zero environmental impact." },
  { icon: ShieldCheck, title: "Lifetime Repair Promise", description: "Free repairs for all our crafted pieces." },
  { icon: Gift, title: "Artisan Gift Wrapping", description: "Sustainable packaging for special moments." },
  { icon: Headphones, title: "Atelier Support", description: "Connect with our craftsmen directly." },
];

const ShopServicesHighlight: FC = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <service.icon className="w-6 h-6 text-[#d4af37]" strokeWidth={1} />
              <h3 className="text-sm text-white tracking-widest uppercase">{service.title}</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[200px]">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopServicesHighlight;
