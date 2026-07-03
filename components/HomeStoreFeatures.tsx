import { Truck, ShieldCheck, RefreshCw, CreditCard, Headphones, Gift } from 'lucide-react';

export default function HomeStoreFeatures() {
    const features = [
        { icon: Truck, title: "Free Shipping", desc: "On domestic orders" },
        { icon: ShieldCheck, title: "Quality Assured", desc: "Premium craftsmanship" },
        { icon: RefreshCw, title: "Easy Returns", desc: "30-day policy" },
        { icon: CreditCard, title: "Secure Payment", desc: "Encrypted transactions" },
        { icon: Headphones, title: "24/7 Support", desc: "Expert guidance" },
        { icon: Gift, title: "Gift Wrapping", desc: "Elegant presentation" },
    ];

    return (
        <section className="py-24 bg-[#050505]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="p-6 border border-white/5 bg-[#0a0a0a] rounded-xl hover:border-[#d4af37]/30 transition-all duration-300 flex items-start gap-4">
                            <feature.icon size={24} className="text-[#d4af37] shrink-0" />
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-white mb-1">{feature.title}</h4>
                                <p className="text-[9px] text-gray-500">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
