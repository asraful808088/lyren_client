'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [isOpen]);

  
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden relative">
      
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="p-2 text-gray-400 hover:text-white transition"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      
      {isOpen && (
        <>
          
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          
          <div
            ref={menuRef}
            className="absolute top-full right-0 mt-1 w-56 bg-[#0f0f0f] border border-white/10 shadow-xl z-40 rounded"
          >
            <nav className="flex flex-col divide-y divide-white/5 py-2">
              <Link
                href="/"
                onClick={closeMenu}
                className="px-4 py-3 text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={closeMenu}
                className="px-4 py-3 text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="px-4 py-3 text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                About
              </Link>
              <Link
                href="/faq"
                onClick={closeMenu}
                className="px-4 py-3 text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="px-4 py-3 text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Contact
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
