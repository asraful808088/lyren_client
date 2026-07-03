'use client';

import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PriceTag } from './PriceTag';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
    const { cart, removeFromCart, isOpen, setIsOpen } = useCart();
    const { user, setIsLoginOpen } = useAuth();
    const router = useRouter();

    const total = cart.reduce(
        (sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity,
        0
    );

    if (!isOpen) return null;

    const handleCheckout = () => {
        setIsOpen(false); // always close the cart sidebar first

        if (!user) {
            setIsLoginOpen(true); // not logged in -> show login modal instead
            return;
        }

        router.push('/checkout');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay: only this closes the sidebar */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setIsOpen(false)}
            />

            {/* Panel: stop clicks here from reaching the overlay */}
            <div
                className="relative w-full max-w-sm bg-[#121212] border-l border-white/10 h-full p-8 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm uppercase tracking-widest text-[#d4af37]">Shopping Cart</h2>
                    <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <div className="w-16 h-20 bg-[#1a1a1a]" />
                            <div className="flex-1">
                                <h3 className="text-xs uppercase tracking-widest">{item.name}</h3>
                                <div className="text-[10px] opacity-50">Quantity: {item.quantity}</div>
                            </div>
                            <div className="font-serif italic text-right">
                                <PriceTag
                                    price={item.price}
                                    discountPrice={item.discountPrice}
                                    quantity={item.quantity}
                                    className="flex-col items-end gap-0.5"
                                    originalClassName="text-[10px] text-gray-500 line-through"
                                />
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {cart.length === 0 && <div className="text-center text-xs opacity-50 mt-12">Your cart is empty.</div>}
                </div>
                <div className="pt-8 border-t border-white/10">
                    <div className="flex justify-between mb-6">
                        <span className="text-xs uppercase tracking-widest">Total</span>
                        <span className="font-serif italic text-lg">${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-[#f5f5f4] text-black py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}