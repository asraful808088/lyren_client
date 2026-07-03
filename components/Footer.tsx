import { Instagram, MapPin, Mail, MessageCircle, Facebook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const SOCIAL_LINKS = [
  {
    title: 'WhatsApp',
    href: 'https://wa.me/8801970791655',
    icon: <MessageCircle size={15} />,
  },
  {
    title: 'Facebook / Messenger',
    href: 'https://www.facebook.com/messages/t/910500272155554',
    icon: <Facebook size={15} />,
  },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/lyrenofficial1?igsh=ZnZzdGV6Y2gzenAx',
    icon: <Instagram size={15} />,
  },
  {
    title: 'TikTok',
    href: 'https://www.tiktok.com/@lyrenofficial121?_r=1&_t=ZS-97dgXFdHqnH',
    icon: (
      <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97.94 2.29 1.48 3.64 1.51v3.28a9.122 9.122 0 0 1-5.18-1.52c-.08 3.52-.02 7.03-.05 10.54-.08 1.58-.6 3.16-1.56 4.38-1.12 1.34-2.82 2.21-4.57 2.37-2 .16-4.08-.43-5.59-1.77A9.18 9.18 0 0 1 1.86 16c-.34-2.11.23-4.32 1.56-6 1.15-1.42 2.91-2.31 4.73-2.45v3.31c-1.15.15-2.22.75-2.88 1.7-.68.99-.86 2.27-.47 3.42.36 1.09 1.25 1.94 2.35 2.24 1.19.34 2.54.04 3.48-.77.77-.66 1.22-1.66 1.24-2.67.04-4.59.01-9.18.03-13.77.01-.27.08-.55.19-.8a3.167 3.167 0 0 1 .49-.76Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#060606] text-gray-400 border-t border-white/10">

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-white/5">

          <div className="md:col-span-4 space-y-7">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10 group-hover:ring-[#d4af37]/40 transition-all duration-300">
                <Image
                  src="/assets/logo/logo.jpg"
                  alt="LYREN Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-serif italic tracking-[0.25em] text-white group-hover:text-[#d4af37] transition-colors duration-300">
                LYREN
              </span>
            </Link>

            <p className="text-[11px] leading-[1.9] text-gray-500 max-w-xs">
              Refining the art of modern luxury through conscious craftsmanship and artisanal detail. Each piece is a testament to timeless design and quality.
            </p>

            <div className="space-y-3">
              <a
                href="https://maps.google.com/?q=Narayanganj,Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-[11px] text-gray-500 hover:text-[#d4af37] transition-colors group"
              >
                <MapPin size={13} className="mt-0.5 shrink-0 text-[#d4af37]/60 group-hover:text-[#d4af37]" />
                <span>Narayanganj, Dhaka, Bangladesh — 1432</span>
              </a>
              <a
                href="mailto:lyrenofficial121@gmail.com"
                className="flex items-center gap-3 text-[11px] text-gray-500 hover:text-[#d4af37] transition-colors group"
              >
                <Mail size={13} className="shrink-0 text-[#d4af37]/60 group-hover:text-[#d4af37]" />
                <span>lyrenofficial121@gmail.com</span>
              </a>
              <a
                href="https://www.facebook.com/messages/t/910500272155554"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[11px] text-gray-500 hover:text-[#d4af37] transition-colors group"
              >
                <MessageCircle size={13} className="shrink-0 text-[#d4af37]/60 group-hover:text-[#d4af37]" />
                <span>Message us on Messenger</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#d4af37]/50 hover:text-[#d4af37] hover:bg-[#d4af37]/5 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <h5 className="text-[9px] tracking-[0.35em] uppercase text-white/90 mb-7 font-medium">The Atelier</h5>
            <ul className="space-y-4">
              {[
                { label: 'Our Story', href: '/about' },
                { label: 'Sustainability', href: '/about' },
                { label: 'Craftsmanship', href: '/about' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[11px] tracking-[0.15em] uppercase text-gray-500 hover:text-[#d4af37] transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-[9px] tracking-[0.35em] uppercase text-white/90 mb-7 font-medium">Shop</h5>
            <ul className="space-y-4">
              {[
                { label: 'All Pieces', href: '/shop' },
                { label: 'New Arrivals', href: '/shop' },
                { label: 'Best Sellers', href: '/shop' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[11px] tracking-[0.15em] uppercase text-gray-500 hover:text-[#d4af37] transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-[9px] tracking-[0.35em] uppercase text-white/90 mb-7 font-medium">Support</h5>
            <ul className="space-y-4">
              {[
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Shipping & Returns', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[11px] tracking-[0.15em] uppercase text-gray-500 hover:text-[#d4af37] transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] tracking-[0.25em] uppercase text-gray-600">
            &copy; {new Date().getFullYear()} LYREN. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[9px] tracking-[0.2em] uppercase text-gray-600 hover:text-[#d4af37] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[9px] tracking-[0.2em] uppercase text-gray-600 hover:text-[#d4af37] transition-colors">
              Terms of Service
            </a>
            <div className="flex items-center gap-1.5">
              {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((p) => (
                <span
                  key={p}
                  className="text-[8px] tracking-widest px-1.5 py-0.5 border border-white/10 text-gray-600 rounded-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
