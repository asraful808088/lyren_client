'use client';

import { motion } from 'motion/react';

export default function ContactForm() {
  return (
    <div className="bg-[#121212] border border-white/5 p-6 sm:p-10 md:p-12 h-full flex flex-col justify-center">
      <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-8">Send a Message</h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input type="text" placeholder="Name" className="w-full bg-[#0a0a0a] border border-white/5 p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors" />
          <input type="email" placeholder="Email" className="w-full bg-[#0a0a0a] border border-white/5 p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors" />
        </div>
        <input type="text" placeholder="Subject" className="w-full bg-[#0a0a0a] border border-white/5 p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors" />
        <textarea placeholder="Message" rows={5} className="w-full bg-[#0a0a0a] border border-white/5 p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors"></textarea>
        <button className="w-full bg-[#d4af37] text-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-300">
          Send Message
        </button>
      </form>
    </div>
  );
}
