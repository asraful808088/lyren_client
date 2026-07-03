

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, RefreshCw, ArrowLeft } from 'lucide-react';

export default function AdminSystemPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cacheLoading, setCacheLoading] = useState(false);
  const [cacheResult, setCacheResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (!loggedIn) {
      router.push('/login');
      return;
    }

    setIsLoggedIn(true);
    setLoading(false);
  }, [mounted, router]);

  const handleLoadCache = async () => {
    setCacheLoading(true);
    setCacheResult(null);

    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch('http://localhost:5036/api/Product/load-cache', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setCacheResult({
        success: res.ok && data.success,
        message: data.message || (res.ok ? 'Cache loaded' : 'Failed to load cache'),
        count: data.data?.count,
      });
    } catch (err) {
      setCacheResult({ success: false, message: 'Network error while loading cache' });
    } finally {
      setCacheLoading(false);
    }
  };

  if (!mounted || loading || !isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[9999]">
        <div className="text-center text-[#f5f5f4]">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-lg font-semibold mb-2">Access Restricted</p>
          <p className="text-sm text-[#a8a29e]">Please login to access admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f4]">
      <div className="flex justify-between items-center mb-8 px-8 py-6 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm text-[#a8a29e] hover:text-[#d4af37] transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-semibold tracking-wide mb-1">System</h1>
          <p className="text-sm text-[#a8a29e] tracking-wide">
            Cache and maintenance tools
          </p>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 max-w-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-[rgba(212,175,55,0.1)] p-3 rounded-lg">
              <Database size={24} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">Redis Product Cache</h2>
              <p className="text-sm text-[#a8a29e]">
                Loads every product from the database into Redis. Run this after bulk
                imports, migrations, or if products aren&apos;t showing up correctly on
                the storefront.
              </p>
            </div>
          </div>

          <button
            onClick={handleLoadCache}
            disabled={cacheLoading}
            className="flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-[#0a0a0a] font-semibold rounded-lg tracking-wide hover:bg-[#c99f2d] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <RefreshCw size={18} className={cacheLoading ? 'animate-spin' : ''} />
            {cacheLoading ? 'Loading products…' : 'Load Products to Redis'}
          </button>

          {cacheResult && (
            <div
              className={`mt-4 px-4 py-3 rounded-lg text-sm ${
                cacheResult.success
                  ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[#10b981]'
                  : 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]'
              }`}
            >
              {cacheResult.message}
              {cacheResult.count !== undefined && ` (${cacheResult.count} products)`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}