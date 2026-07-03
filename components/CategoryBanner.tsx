'use client';

import Link from 'next/link';

export default function CategoryBanner() {
    return (
        <section className="border-b border-white/10">
            <div className="grid md:grid-cols-2">
               
                <div className="relative h-[50vh] bg-[#1a1a1a] bg-[url('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center flex flex-col justify-center items-center gap-6 border-r border-white/5 overflow-hidden group">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500" />
                    <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                        <span className="text-xs tracking-[0.4em] uppercase opacity-60">Collection</span>
                        <h2 className="text-5xl font-serif italic">For Him</h2>
                        <Link
                            href="/shop?category=For+Him"
                            className="border border-white/60 px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 hover:border-white"
                        >
                            Explore
                        </Link>
                    </div>
                </div>
             
                <div className="relative h-[50vh] bg-[#1a1a1a] bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center flex flex-col justify-center items-center gap-6 overflow-hidden group">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500" />
                    <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                        <span className="text-xs tracking-[0.4em] uppercase opacity-60">Collection</span>
                        <h2 className="text-5xl font-serif italic">For Her</h2>
                        <Link
                            href="/shop?category=For+Her"
                            className="border border-white/60 px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 hover:border-white"
                        >
                            Explore
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
