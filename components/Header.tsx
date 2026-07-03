'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, User, ShoppingBag, LogOut, ChevronDown } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import MobileNav from './MobileNav';

export default function Header() {
  const { cart = [], setIsOpen } = useCart();
  const favCtx = useFavorites();
  const favorites = favCtx?.favorites ?? [];
  const setFavOpen = favCtx?.setIsOpen ?? (() => {});
  const authCtx = useAuth();
  const user = authCtx?.user ?? null;
  const logout = authCtx?.logout ?? (() => {});
  const setIsLoginOpen = authCtx?.setIsLoginOpen ?? (() => {});

  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favCount = favorites.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className="py-4 md:py-6 border-b border-white/10 bg-[#0a0a0a]">
        <nav className="container mx-auto px-3 md:px-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-[#d4af37] transition flex-shrink-0"
          >
            <Image
              src="/assets/logo/logo.jpg"
              alt="LYREN Logo"
              width={32}
              height={32}
              className="object-contain rounded-full border border-white/10"
            />
            <span className="text-lg md:text-2xl font-serif tracking-widest uppercase text-white hover:text-[#d4af37] transition">
              LYREN
            </span>
          </Link>

          <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase text-gray-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/shop" className="hover:text-white transition">Shop</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/faq" className="hover:text-white transition">FAQ</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>

          <div className="flex items-center gap-3 md:gap-6 text-gray-400">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-white transition p-1.5 md:p-0"
              aria-label="Open search"
            >
              <Search size={16} />
            </button>

            <button
              onClick={() => setFavOpen(true)}
              className="hover:text-white transition relative p-1.5 md:p-0"
              aria-label="Saved items"
            >
              <Heart size={16} />
              {favCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[8px] md:text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {favCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 hover:text-white transition group p-1.5 md:p-0"
                  aria-label="User menu"
                >
                  <span className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[9px] md:text-[10px] font-semibold text-[#d4af37] uppercase">
                    {user.name.charAt(0)}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`hidden md:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-48 md:w-52 bg-[#0f0f0f] border border-white/10 shadow-2xl z-30">
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-[10px] md:text-[11px] text-white tracking-wide font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-gray-600 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="#"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white hover:bg-white/[0.03] transition"
                      >
                        My Account
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white hover:bg-white/[0.03] transition"
                      >
                        Orders
                      </Link>
                    </div>

                    <div className="border-t border-white/8 py-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-gray-600 hover:text-red-400 hover:bg-white/[0.02] transition"
                      >
                        <LogOut size={12} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="hover:text-white transition p-1.5 md:p-0"
                aria-label="Sign in"
              >
                <User size={16} />
              </button>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="hover:text-white transition relative p-1.5 md:p-0"
              aria-label="Open cart"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[8px] md:text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <MobileNav />
          </div>
        </nav>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}