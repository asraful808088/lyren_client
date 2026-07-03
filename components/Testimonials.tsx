import { Quote } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        { name: 'Elena R.', quote: 'The curation is impeccable. Every piece feels timeless.' },
        { name: 'Marcus V.', quote: 'Superior quality, truly minimalist luxury.' },
        { name: 'Sarah L.', quote: 'My go-to atelier for seasonal essentials.' },
    ];
    
    return (
        <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
                <div key={i} className="p-6 border border-white/5 bg-[#0a0a0a] flex flex-col justify-between">
                    <Quote size={20} className="text-[#d4af37] mb-4" />
                    <p className="font-serif italic text-sm opacity-90 mb-6 leading-relaxed">"{t.quote}"</p>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af37]">{t.name}</span>
                </div>
            ))}
        </div>
    );
}
