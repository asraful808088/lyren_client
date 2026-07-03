import { Quote } from 'lucide-react';

export default function AboutTestimonials() {
    const testimonials = [
        { name: 'Elena R.', quote: 'The curation is impeccable. Every piece feels timeless.' },
        { name: 'Marcus V.', quote: 'Superior quality, truly minimalist luxury.' },
        { name: 'Sarah L.', quote: 'My go-to atelier for seasonal essentials.' },
        { name: 'David P.', quote: 'Exquisite attention to detail, a joy to wear.' },
        { name: 'Chloe M.', quote: 'Quiet luxury expressed perfectly. Absolutely love the aesthetic.' },
    ];
    
    return (
        <section className="py-24 bg-[#050505]">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col items-center mb-24">
                    <h3 className="text-center text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-6">Client Notes</h3>
                    <p className="text-center text-xl font-serif italic text-white max-w-2xl">
                        Thoughtful reflections from our global community. Discover how our pieces find their place in the lives of those who value quiet luxury and artisanal craftsmanship.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-8 border border-white/5 bg-[#0d0d0d] hover:border-white/10 transition-colors flex flex-col justify-between">
                            <Quote size={20} className="text-[#d4af37] mb-6" />
                            <p className="font-serif italic text-base opacity-90 mb-8 leading-relaxed">"{t.quote}"</p>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af37]">{t.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
