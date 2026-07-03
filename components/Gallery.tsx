
export default function Gallery() {
    const images = [
        'https://images.unsplash.com/photo-1598775378121-e24f7062c151?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop',
    ];
    return (
        <section className="py-20 border-b border-white/10">
            <div className="container mx-auto px-4">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-12">Artistry in Motion</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="h-64 bg-[#1a1a1a] bg-cover bg-center hover:opacity-80 transition cursor-pointer" style={{backgroundImage: `url(${img})`}} />
                    ))}
                </div>
            </div>
        </section>
    );
}
