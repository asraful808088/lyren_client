

'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ChainHookLoadingOverlayProps {
    isOpen: boolean;
    message?: string;
}

export function ChainHookLoadingOverlay({ 
    isOpen, 
    message = 'Redirecting to Chain Hook Wallet...' 
}: ChainHookLoadingOverlayProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#151515] border border-white/10 rounded-lg p-8 max-w-sm w-full mx-4">
                <div className="flex flex-col items-center text-center">
                    {/* Chain Hook Logo */}
                    <div className="w-16 h-16 relative mb-4">
                        <Image
                            src="https://res.cloudinary.com/ecxs6pgw/image/upload/v1783354359/logo_acvlmj.png"
                            alt="Chain Hook Wallet"
                            fill
                            sizes="64px"
                            className="object-contain"
                        />
                    </div>

                    {/* Loading Spinner */}
                    <Loader2 size={32} className="animate-spin text-[#d4af37] mb-4" />

                    {/* Message */}
                    <p className="text-sm text-white/80">{message}</p>
                    <p className="text-[10px] text-white/40 mt-2">
                        Please wait while we connect to your wallet
                    </p>
                </div>
            </div>
        </div>
    );
}
