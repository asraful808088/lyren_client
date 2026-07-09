'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  Package,
  Settings,
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import MobileNav from './MobileNav';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

// Edit or remove this line freely — it's a placeholder for a shipping / promo message.
const UTILITY_MESSAGE = 'Complimentary shipping on all orders';

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
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favCount = favorites.length;
  const firstName = user?.name?.split(' ')[0] ?? '';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setScrolled(doc.scrollTop > 8);
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress hairline */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-transparent">
        <div
          className="h-full bg-[#d4af37] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="sticky top-0 z-40 bg-[#0a0a0a]">
        {/* Utility bar */}
        <div
          className={`overflow-hidden border-b border-white/5 transition-all duration-500 ${
            scrolled ? 'max-h-0 opacity-0' : 'max-h-9 opacity-100'
          }`}
        >
          <p className="text-center text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-500 py-2">
            {UTILITY_MESSAGE}
          </p>
        </div>

        {/* Main row */}
        <div className="relative">
          <nav
            className={`container mx-auto px-3 md:px-4 flex items-center justify-between transition-[padding] duration-500 ${
              scrolled ? 'py-3 md:py-3.5' : 'py-4 md:py-6'
            }`}
          >
            {/* Logo — left, with the flanking hairline lockup */}
            <Link href="/" className="group flex items-center gap-2.5 md:gap-3 flex-shrink-0">
              <span className="relative overflow-hidden rounded-full border border-white/10 group-hover:border-[#d4af37]/50 transition-colors duration-300 flex-shrink-0">
                <Image
                  src="/assets/logo/logo.jpg"
                  alt="LYREN Logo"
                  width={32}
                  height={32}
                  className={`object-contain transition-all duration-500 group-hover:scale-110 ${
                    scrolled ? 'w-6 h-6 md:w-7 md:h-7' : 'w-7 h-7 md:w-8 md:h-8'
                  }`}
                />
              </span>
              <span
                className={`font-serif uppercase text-white whitespace-nowrap transition-all duration-500 group-hover:text-[#d4af37] ${
                  scrolled
                    ? 'text-base md:text-xl tracking-[0.25em]'
                    : 'text-lg md:text-2xl tracking-[0.3em]'
                }`}
              >
                LYREN
              </span>
              <span
                className={`hidden sm:block h-px bg-gradient-to-r from-[#d4af37]/60 to-transparent transition-all duration-500 ${
                  scrolled ? 'w-4 md:w-6' : 'w-6 md:w-9'
                }`}
              />
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-7 text-xs tracking-[0.2em] uppercase text-gray-400">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative py-1 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                  <span className="pointer-events-none absolute left-1/2 -bottom-0.5 h-[1.5px] w-0 -translate-x-1/2 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-2 text-gray-400">
              <button
                onClick={() => setSearchOpen(true)}
                className="group relative p-2 rounded-full hover:bg-white/[0.06] hover:text-white transition-all duration-300"
                aria-label="Open search"
              >
                <Search size={16} className="transition-transform duration-300 group-hover:scale-110" />
              </button>

              <button
                onClick={() => setFavOpen(true)}
                className="group relative p-2 rounded-full hover:bg-white/[0.06] hover:text-white transition-all duration-300"
                aria-label="Saved items"
              >
                <Heart size={16} className="transition-transform duration-300 group-hover:scale-110" />
                {favCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#d4af37] text-black text-[8px] md:text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#0a0a0a]">
                    {favCount}
                  </span>
                )}
              </button>

              {/* --- Account item --- */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={`flex items-center gap-2 pl-1.5 pr-2.5 md:pl-2 md:pr-3 py-1.5 rounded-full border transition-all duration-300 ${
                      userMenuOpen
                        ? 'border-[#d4af37]/50 bg-white/[0.06]'
                        : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                    aria-label="Account menu"
                    aria-expanded={userMenuOpen}
                  >
                    <span className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[10px] md:text-[11px] font-semibold text-[#d4af37] uppercase">
                      {user.name.charAt(0)}
                      <span className="absolute inset-0 rounded-full ring-1 ring-[#d4af37]/20" />
                    </span>
                    <span className="hidden lg:block text-[10px] tracking-[0.15em] uppercase text-gray-300">
                      {firstName}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`text-gray-500 transition-transform duration-300 ${
                        userMenuOpen ? 'rotate-180 text-[#d4af37]' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 top-full mt-3 w-56 bg-[#0f0f0f] border border-white/10 shadow-2xl shadow-black/40 z-30 origin-top-right transition-all duration-200 ${
                      userMenuOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                    }`}
                  >
                    {/* Identity block */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-white/8 bg-gradient-to-b from-white/[0.02] to-transparent">
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-xs font-semibold text-[#d4af37] uppercase flex-shrink-0">
                        {user.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] text-white tracking-wide font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-gray-600 truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="#"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        <User size={13} className="text-gray-600" />
                        My Account
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        <Package size={13} className="text-gray-600" />
                        Orders
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        <Settings size={13} className="text-gray-600" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-white/8 py-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-gray-600 hover:text-red-400 hover:bg-white/[0.02] transition-colors duration-200"
                      >
                        <LogOut size={13} />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="group flex items-center gap-1.5 pl-2 pr-2.5 md:pr-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#d4af37]/40 hover:bg-white/[0.04] transition-all duration-300"
                  aria-label="Sign in"
                >
                  <User size={15} className="transition-transform duration-300 group-hover:scale-110 group-hover:text-[#d4af37]" />
                  <span className="hidden md:block text-[10px] tracking-[0.15em] uppercase text-gray-400 group-hover:text-white transition-colors duration-300">
                    Sign In
                  </span>
                </button>
              )}

              <span className="hidden md:block w-px h-4 bg-white/10 mx-1" />

              <button
                onClick={() => setIsOpen(true)}
                className="group relative p-2 rounded-full hover:bg-white/[0.06] hover:text-white transition-all duration-300"
                aria-label="Open cart"
              >
                <ShoppingBag size={16} className="transition-transform duration-300 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-white text-black text-[8px] md:text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#0a0a0a]">
                    {cartCount}
                  </span>
                )}
              </button>

              <MobileNav />
            </div>
          </nav>

          {/* Bottom hairline — gradient instead of a flat rule */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
