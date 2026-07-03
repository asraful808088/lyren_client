export default function AboutAtelier() {
    return (
        <section className="py-24 border-b border-white/10 bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
            <div className="container mx-auto px-4 max-w-2xl text-center relative z-10">
                <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] mb-6 block">Our Philosophy</span>
                <h3 className="text-4xl md:text-5xl font-serif italic mb-8">Crafting Timeless Elegance</h3>
                <p className="text-sm opacity-60 leading-relaxed font-light">
                    Founded in 2024, FashionStore Atelier bridges the gap between structured minimalism and luxurious comfort. We prioritize ethically sourced materials, honoring the craft of garment construction for those who value authenticity above all.
                </p>
            </div>
        </section>
    );
}
