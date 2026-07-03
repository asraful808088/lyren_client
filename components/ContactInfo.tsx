'use client';

import { Mail, MapPin, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const CONTACT_CARDS = [
  {
    icon: <MapPin size={18} />,
    title: 'Our Location',
    value: 'Narayanganj, Dhaka, Bangladesh — 1432',
    href: 'https://maps.google.com/?q=Narayanganj,Bangladesh',
  },
  {
    icon: <Mail size={18} />,
    title: 'Email Us',
    value: 'lyrenofficial121@gmail.com',
    href: 'mailto:lyrenofficial121@gmail.com',
  },
  {
    icon: <MessageCircle size={18} />,
    title: 'Facebook Messenger',
    value: 'Message us directly',
    href: 'https://www.facebook.com/messages/t/910500272155554',
  },
  {
    icon: <Clock size={18} />,
    title: 'Opening Hours',
    value: 'Mon – Sat: 10:00 – 19:00',
    href: null,
  },
];

const SOCIAL_LINKS = [
  {
    title: 'WhatsApp +8801970791655',
    href: 'https://wa.me/8801970791655',
    label: 'WhatsApp',
    icon: <MessageCircle size={14} />,
  },
  {
    title: 'Facebook / Messenger',
    href: 'https://www.facebook.com/messages/t/910500272155554',
    label: 'Facebook',
    icon: <Facebook size={14} />,
  },
  {
    title: 'Instagram @lyrenofficial1',
    href: 'https://www.instagram.com/lyrenofficial1?igsh=ZnZzdGV6Y2gzenAx',
    label: 'Instagram',
    icon: <Instagram size={14} />,
  },
  {
    title: 'TikTok @lyrenofficial121',
    href: 'https://www.tiktok.com/@lyrenofficial121?_r=1&_t=ZS-97dgXFdHqnH',
    label: 'TikTok',
    icon: (
      <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97.94 2.29 1.48 3.64 1.51v3.28a9.122 9.122 0 0 1-5.18-1.52c-.08 3.52-.02 7.03-.05 10.54-.08 1.58-.6 3.16-1.56 4.38-1.12 1.34-2.82 2.21-4.57 2.37-2 .16-4.08-.43-5.59-1.77A9.18 9.18 0 0 1 1.86 16c-.34-2.11.23-4.32 1.56-6 1.15-1.42 2.91-2.31 4.73-2.45v3.31c-1.15.15-2.22.75-2.88 1.7-.68.99-.86 2.27-.47 3.42.36 1.09 1.25 1.94 2.35 2.24 1.19.34 2.54.04 3.48-.77.77-.66 1.22-1.66 1.24-2.67.04-4.59.01-9.18.03-13.77.01-.27.08-.55.19-.8a3.167 3.167 0 0 1 .49-.76Z" />
      </svg>
    ),
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-12">

      <div className="space-y-2">
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]">Get In Touch</h3>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          We&apos;d love to hear from you. Reach out through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONTACT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {card.href ? (
              <a
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex gap-4 p-5 border border-white/5 bg-[#0d0d0d] hover:border-[#d4af37]/30 hover:bg-[#d4af37]/[0.03] transition-all duration-300 rounded-sm group h-full"
              >
                <div className="text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors shrink-0 mt-0.5">
                  {card.icon}
                </div>
                <div>
                  <h4 className="text-[10px] text-white/70 font-medium uppercase tracking-[0.2em] group-hover:text-white transition-colors">{card.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed group-hover:text-gray-300 transition-colors">{card.value}</p>
                </div>
              </a>
            ) : (
              <div className="flex gap-4 p-5 border border-white/5 bg-[#0d0d0d] rounded-sm h-full">
                <div className="text-[#d4af37]/60 shrink-0 mt-0.5">{card.icon}</div>
                <div>
                  <h4 className="text-[10px] text-white/70 font-medium uppercase tracking-[0.2em]">{card.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">{card.value}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="space-y-5 pt-2">
        <h4 className="text-[9px] uppercase tracking-[0.4em] text-white/50">Follow Us</h4>
        <div className="flex items-center gap-3 flex-wrap">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.title}
              className="flex items-center gap-2 px-3 py-2 border border-white/8 bg-[#0d0d0d] rounded-sm text-gray-500 hover:border-[#d4af37]/40 hover:text-[#d4af37] hover:bg-[#d4af37]/[0.04] transition-all duration-300 text-[10px] tracking-widest uppercase"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
