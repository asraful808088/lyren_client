'use client';

import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedCollection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 overflow-hidden border border-white/5 group">
            <Image
              src="/assets/shop/keagan-henman-Won79_9oUEk-unsplash.jpg"
              alt="Curated Essentials"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="space-y-6">
            <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em]">The Winter Edit</span>
            <h2 className="text-4xl font-serif italic">Curated Essentials</h2>
            <p className="text-sm opacity-50 leading-relaxed">
              Discover our new seasonal favorites, meticulously designed for longevity and style. Each piece tells a story of thoughtful design and artisanal precision.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-3 border border-white/20 px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              Explore Edit
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 bg-[#0a0a0a] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-sm">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors z-20 p-1.5 hover:bg-white/5 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="relative h-72 md:h-96 overflow-hidden">
              <Image
                src="/assets/shop/keagan-henman-Won79_9oUEk-unsplash.jpg"
                alt="The Winter Edit"
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-[#d4af37] text-[9px] uppercase tracking-[0.5em] block mb-3">The Winter Edit</span>
                <h2 className="text-4xl md:text-5xl font-serif italic text-white leading-tight">Curated Essentials</h2>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-16">
              <div className="grid md:grid-cols-2 gap-10 items-center border-b border-white/5 pb-16">
                <div className="relative h-72 overflow-hidden border border-white/5">
                  <Image
                    src="/assets/shop/anya-richter-Rtxpbrf6mpw-unsplash.jpg"
                    alt="Conscious Craftsmanship"
                    fill
                    className="object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="space-y-5">
                  <span className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em]">Our Commitment</span>
                  <h3 className="text-3xl font-serif italic text-white">Conscious Craftsmanship</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    We believe that true luxury lies in responsibility. From sourcing organic fibers to ensuring fair labor practices in our partner ateliers, we strive to build items that respect both the wearer and the planet.
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    Every piece in our collection is crafted with longevity in mind, using low-impact materials that minimize our ecological footprint.
                  </p>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 border border-white/20 px-6 py-2.5 text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Read Our Story
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-5 order-2 md:order-1">
                  <span className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em]">Experience The Craft</span>
                  <h3 className="text-3xl font-serif italic text-white">Visit Our Atelier</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    Step behind the scenes and witness the meticulous artistry that defines our collection. Join us in our workshop for a curated look at our process, materials, and the passion that brings each piece to life.
                  </p>
                  <div className="text-[11px] text-gray-500 space-y-1">
                    <p>📍 Narayanganj, Dhaka, Bangladesh — 1432</p>
                    <p>🕐 Mon – Sat: 10:00 – 19:00</p>
                  </div>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2.5 text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-white transition-all duration-300"
                  >
                    Book a Visit
                    <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="relative h-72 overflow-hidden border border-white/5 order-1 md:order-2">
                  <Image
                    src="/assets/about/lighten-up-DcFJuWICOSY-unsplash.jpg"
                    alt="Visit Our Atelier"
                    fill
                    className="object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
