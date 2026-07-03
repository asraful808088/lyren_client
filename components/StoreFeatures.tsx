import { Truck, ShieldCheck, RefreshCw, CreditCard, Headphones, Gift } from 'lucide-react';

export default function StoreFeatures() {
    const features = [
        { icon: Truck, title: "Free Shipping" },
        { icon: ShieldCheck, title: "Quality Assured" },
        { icon: RefreshCw, title: "Easy Returns" },
        { icon: CreditCard, title: "Secure Payment" },
        { icon: Headphones, title: "24/7 Support" },
        { icon: Gift, title: "Gift Wrapping" },
    ];

    return (
        <div className="grid grid-cols-2 gap-8 text-center text-gray-400">
            {features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                    <feature.icon size={20} className="text-[#d4af37]" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white">{feature.title}</span>
                </div>
            ))}
        </div>
    );
}
