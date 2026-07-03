import { Truck, ShieldCheck, RefreshCw, CreditCard, Headphones, Gift } from 'lucide-react';

export default function AboutStoreFeatures() {
    const features = [
        { icon: Truck, title: "Free Shipping", desc: "Complimentary on domestic orders." },
        { icon: ShieldCheck, title: "Quality Assured", desc: "Crafted to last a lifetime." },
        { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free policy." },
        { icon: CreditCard, title: "Secure Payment", desc: "Safe, encrypted transactions." },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature, i) => (
                <div key={i} className="p-6 border border-white/5 bg-[#0d0d0d] flex items-start gap-4">
                    <feature.icon size={24} className="text-[#d4af37] shrink-0" />
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-white mb-1">{feature.title}</h4>
                        <p className="text-[10px] text-gray-400">{feature.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
