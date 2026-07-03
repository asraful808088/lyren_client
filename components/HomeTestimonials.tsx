import { Quote } from 'lucide-react';

export default function HomeTestimonials() {
    const testimonials = [
        { name: 'Elena R.', quote: 'The curation is impeccable. Every piece feels timeless.' },
        { name: 'Marcus V.', quote: 'Superior quality, truly minimalist luxury.' },
        { name: 'Sarah L.', quote: 'My go-to atelier for seasonal essentials.' },
    ];
    
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="container mx-auto px-6 max-w-7xl">
                <h3 className="text-center text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-16">Community Reflections</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-8 border border-white/5 bg-[#121212] rounded-2xl hover:border-[#d4af37]/30 transition-all duration-300 flex flex-col justify-between">
                            <Quote size={24} className="text-[#d4af37] mb-6 opacity-50" />
                            <p className="font-serif italic text-base text-gray-200 mb-8 leading-relaxed">"{t.quote}"</p>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af37] font-semibold">{t.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
