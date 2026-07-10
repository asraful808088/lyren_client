'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PriceTag } from '@/components/PriceTag';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services/paymentService';
import { ChainHookLoadingOverlay } from '@/components/ChainHookLoadingOverlay';
import Image from 'next/image';

type Step = 'summary' | 'platform' | 'credentials' | 'processing' | 'result';

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [step, setStep] = useState<Step>('summary');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState<'success' | 'failure' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isChainHookLoading, setIsChainHookLoading] = useState(false);
    const [chainHookMessage, setChainHookMessage] = useState('Redirecting to Chain Hook Wallet...');

    // Redirect to home if not logged in (wait for session restore first)
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    const subtotal = cart.reduce(
        (sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity,
        0
    );
    const shipping = subtotal > 0 ? 12 : 0;
    const total = subtotal + shipping;

    const handlePay = async () => {
        setIsProcessing(true);
        setStep('processing');
        setErrorMessage('');

        try {
            const paymentData = {
                email: email,
                password: password,
                amount: total,
                platform: 'nextrade'
            };

            const response = await paymentService.processPayment(paymentData);

            if (response.success || response.data) {
                setResult('success');
                clearCart();
            } else {
                setResult('failure');
                setErrorMessage(response.message || 'Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setResult('failure');
            setErrorMessage(paymentService.getErrorMessage(error));
        } finally {
            setIsProcessing(false);
            setStep('result');
        }
    };

    const handleChainHookPayment = async () => {
        try {
            // Show loading overlay
            setIsChainHookLoading(true);
            setChainHookMessage('Initiating Chain Hook Wallet connection...');

            // Get the authorize URL
            const { authorizeUrl, clientId } = await paymentService.initiateChainHookPayment(total);
            
            console.log('Redirecting to:', authorizeUrl);
            console.log('Client ID:', clientId);

            setChainHookMessage('Redirecting to Chain Hook Wallet...');
            
            // Small delay to show the loading state before redirecting
            setTimeout(() => {
                // Open in new tab
                const newWindow = window.open(authorizeUrl, '_blank');
                
                // Check if popup was blocked
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // If popup was blocked, redirect in the same window
                    window.location.href = authorizeUrl;
                }
                
                // Close loading overlay
                setIsChainHookLoading(false);
                
                // Navigate to a processing/confirmation page or back to home
                setStep('result');
                setResult('success');
                clearCart();
            }, 1500);

        } catch (error) {
            console.error('Chain Hook payment error:', error);
            setIsChainHookLoading(false);
            setStep('result');
            setResult('failure');
            const errorMsg = paymentService.getErrorMessage(error);
            setErrorMessage(
                errorMsg.includes('Failed to fetch') 
                    ? 'Unable to connect to payment server. Please check your connection and try again.'
                    : errorMsg
            );
        }
    };

    // Block rendering while auth is resolving or user is about to be redirected
    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-[#d4af37]" />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#0c0c0c] text-white flex justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    {/* Back button */}
                    {step !== 'processing' && step !== 'result' && (
                        <button
                            onClick={() => {
                                if (step === 'summary') router.push('/');
                                else if (step === 'platform') setStep('summary');
                                else if (step === 'credentials') setStep('platform');
                            }}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 mb-10"
                            disabled={isProcessing}
                        >
                            <ChevronLeft size={14} /> Back
                        </button>
                    )}

                    {/* STEP 1 — Order Summary */}
                    {step === 'summary' && (
                        <div>
                            <h1 className="text-sm uppercase tracking-widest text-[#d4af37] mb-8">
                                Order Summary
                            </h1>
                            <div className="space-y-5 mb-8">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div>
                                            <div className="text-xs uppercase tracking-widest">{item.name}</div>
                                            <div className="text-[10px] opacity-50">Qty {item.quantity}</div>
                                        </div>
                                        <PriceTag
                                            price={item.price}
                                            discountPrice={item.discountPrice}
                                            quantity={item.quantity}
                                            className="flex-col items-end gap-0.5"
                                            originalClassName="text-[10px] text-gray-500 line-through"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-6 space-y-3 text-xs uppercase tracking-widest">
                                <div className="flex justify-between opacity-60">
                                    <span>Subtotal</span>
                                    <span className="font-serif italic normal-case text-sm">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between opacity-60">
                                    <span>Shipping</span>
                                    <span className="font-serif italic normal-case text-sm">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="font-serif italic normal-case text-lg text-[#d4af37]">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep('platform')}
                                disabled={cart.length === 0}
                                className="w-full mt-10 bg-[#f5f5f4] text-black py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    )}

                    {/* STEP 2 — Choose Platform */}
                    {step === 'platform' && (
                        <div>
                            <h1 className="text-sm uppercase tracking-widest text-[#d4af37] mb-8">
                                Choose Payment Method
                            </h1>

                            <button
                                onClick={() => setStep('credentials')}
                                className="w-full flex items-center gap-4 border border-white/10 bg-[#151515] p-5 hover:border-[#d4af37]/50 transition-colors group"
                            >
                                <div className="w-12 h-12 relative shrink-0">
                                    <Image
                                        src="https://res.cloudinary.com/none909099/image/upload/v1781595618/Group_12_de6nlw.png"
                                        alt="NexTrade"
                                        fill
                                        sizes="48px"
                                        className="object-contain rounded-sm"
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs uppercase tracking-widest">NexTrade</div>
                                    <div className="text-[10px] opacity-50 mt-1">Pay securely with NexTrade</div>
                                </div>
                            </button>

                            {/* Chain Hook Wallet Button */}
                            <button
                                onClick={handleChainHookPayment}
                                className="w-full flex items-center gap-4 border border-white/10 bg-[#151515] p-5 hover:border-[#d4af37]/50 transition-colors mt-2"
                            >
                                <div className="w-12 h-12 relative shrink-0">
                                    <Image
                                        src="https://res.cloudinary.com/ecxs6pgw/image/upload/v1783354359/logo_acvlmj.png"
                                        alt="Chain Hook Wallet"
                                        fill
                                        sizes="48px"
                                        className="object-contain rounded-sm"
                                    />
                                </div>

                                <div className="text-left">
                                    <div className="text-xs uppercase tracking-widest">
                                        Chain Hook Wallet
                                    </div>

                                    <div className="text-[10px] opacity-50 mt-1">
                                        Secure OAuth Wallet Login
                                    </div>
                                </div>
                            </button>

                            <p className="text-[10px] opacity-40 mt-6 leading-relaxed">
                                Secure payment powered by NexTrade and Chain Hook Wallet.
                            </p>
                        </div>
                    )}

                    {/* STEP 3 — NexTrade Credentials */}
                    {step === 'credentials' && (
                        <form onSubmit={(e) => { e.preventDefault(); handlePay(); }}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 relative">
                                    <Image
                                        src="https://res.cloudinary.com/none909099/image/upload/v1781595618/Group_12_de6nlw.png"
                                        alt="NexTrade"
                                        fill
                                        sizes="40px"
                                        className="object-contain"
                                    />
                                </div>
                                <h1 className="text-sm uppercase tracking-widest text-[#d4af37]">
                                    NexTrade Payment
                                </h1>
                            </div>

                            {errorMessage && (
                                <div className="mb-6 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-[#151515] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                                        disabled={isProcessing}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#151515] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                                        disabled={isProcessing}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between mb-8 text-xs uppercase tracking-widest">
                                <span>Total due</span>
                                <span className="font-serif italic normal-case text-lg text-[#d4af37]">
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={!email || !password || isProcessing}
                                className="w-full flex items-center justify-center gap-2 bg-[#f5f5f4] text-black py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={12} /> Pay ${total.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* STEP 4 — Processing */}
                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Loader2 size={28} className="animate-spin text-[#d4af37] mb-6" />
                            <div className="text-xs uppercase tracking-widest opacity-70">
                                Processing Payment
                            </div>
                            <div className="text-[10px] opacity-40 mt-2">
                                Please wait while we process your payment...
                            </div>
                        </div>
                    )}

                    {/* STEP 5 — Result */}
                    {step === 'result' && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            {result === 'success' ? (
                                <>
                                    <CheckCircle2 size={40} className="text-[#d4af37] mb-6" />
                                    <h1 className="text-sm uppercase tracking-widest mb-2">Payment Initiated</h1>
                                    <p className="text-[10px] opacity-50 mb-4">
                                        You have been redirected to Chain Hook Wallet to complete the payment.
                                    </p>
                                    <p className="text-[10px] opacity-40 mb-10">
                                        Please complete the authorization in the new tab to finalize your order.
                                    </p>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="w-full bg-[#f5f5f4] text-black py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Return to Shopping
                                    </button>
                                </>
                            ) : (
                                <>
                                    <XCircle size={40} className="text-red-400 mb-6" />
                                    <h1 className="text-sm uppercase tracking-widest mb-2">Payment Failed</h1>
                                    <p className="text-[10px] opacity-50 mb-10">
                                        {errorMessage || "Transaction failed. No charge was made."}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setStep('platform');
                                            setErrorMessage('');
                                            setResult(null);
                                        }}
                                        className="w-full bg-[#f5f5f4] text-black py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ChainHookLoadingOverlay 
                isOpen={isChainHookLoading}
                message={chainHookMessage}
            />
        </>
    );
}
