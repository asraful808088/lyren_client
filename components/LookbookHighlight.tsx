'use client';

import Link from 'next/link';

export default function LookbookHighlight() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center space-y-6">
            <span className="text-white/60 text-[10px] uppercase tracking-[0.4em]">Lookbook 2026</span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-white">Seasonal Narratives</h2>
            <Link
              href="/shop?category=Seasonal"
              className="inline-block border border-white text-white px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition"
            >
              View Collections
            </Link>
        </div>
    </section>
  );
}
