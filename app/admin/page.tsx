'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, TrendingUp, AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import { getProducts, type Product } from '@/lib/mockData';

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    discountedItems: 0,
  });

  const [cacheLoading, setCacheLoading] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);
  const [cacheSuccess, setCacheSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loggedIn = localStorage.getItem('adminLoggedIn');
    const email = localStorage.getItem('adminEmail');

    if (!loggedIn) {
      router.push('/login');
      return;
    }

    setIsLoggedIn(true);
    setUserEmail(email || '');
    setLoading(false);

    const products = getProducts();
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.count, 0);
    const lowStock = products.filter((p) => p.count < 10).length;
    const discountedItems = products.filter((p) => p.discount > 0).length;

    setStats({ totalProducts, totalValue, lowStock, discountedItems });
  }, [mounted, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const handleLoadCache = async () => {
    setCacheLoading(true);
    setCacheMessage(null);

    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch('http://localhost:5036/api/Product/load-cache', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCacheSuccess(true);
        setCacheMessage(`Success: ${data.message}`);
      } else {
        setCacheSuccess(false);
        setCacheMessage(`Error: ${data.message || 'Failed to load cache'}`);
      }
    } catch (err) {
      setCacheSuccess(false);
      setCacheMessage('Network error while loading cache');
    } finally {
      setCacheLoading(false);
    }
  };

  if (!mounted || loading || !isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[9999]">
        <div className="text-center text-[#f5f5f4]">
          <div className="text-4xl mb-4">Locked</div>
          <p className="text-lg font-semibold mb-2">Access Restricted</p>
          <p className="text-sm text-[#a8a29e]">Please login to access admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f4]">
      <div className="flex justify-between items-start mb-8 px-8 py-6 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <h1 className="text-4xl font-semibold tracking-wide mb-1">Dashboard</h1>
          <p className="text-sm text-[#a8a29e] tracking-wide">Welcome to your admin panel</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right text-sm">
            <p className="text-[#a8a29e] mb-1">Logged in as</p>
            <p className="text-[#f5f5f4] font-medium">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 bg-transparent border border-[rgba(239,68,68,0.3)] text-[#ef4444] rounded-lg text-sm font-medium hover:bg-[rgba(239,68,68,0.1)] hover:border-[#ef4444] transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-xl p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-[#a8a29e] tracking-wide mb-2">Total Products</p>
                <h3 className="text-4xl font-semibold">{stats.totalProducts}</h3>
              </div>
              <div className="bg-[rgba(212,175,55,0.1)] p-3 rounded-lg">
                <Package size={24} className="text-[#d4af37]" />
              </div>
            </div>
            <Link href="/admin/products" className="text-sm text-[#d4af37] hover:text-[#c99f2d] transition-colors">
              View all
            </Link>
          </div>

          <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-xl p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-[#a8a29e] tracking-wide mb-2">Inventory Value</p>
                <h3 className="text-4xl font-semibold">${stats.totalValue.toFixed(2)}</h3>
              </div>
              <div className="bg-[rgba(16,185,129,0.1)] p-3 rounded-lg">
                <TrendingUp size={24} className="text-[#10b981]" />
              </div>
            </div>
            <p className="text-xs text-[#a8a29e]">Based on current stock</p>
          </div>

          <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-xl p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-[#a8a29e] tracking-wide mb-2">Low Stock Items</p>
                <h3 className="text-4xl font-semibold">{stats.lowStock}</h3>
              </div>
              <div className="bg-[rgba(245,158,11,0.1)] p-3 rounded-lg">
                <AlertCircle size={24} className="text-[#f59e0b]" />
              </div>
            </div>
            <p className="text-xs text-[#a8a29e]">Items with less than 10 units</p>
          </div>

          <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-xl p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-[#a8a29e] tracking-wide mb-2">On Sale</p>
                <h3 className="text-4xl font-semibold">{stats.discountedItems}</h3>
              </div>
              <div className="bg-[rgba(239,68,68,0.1)] p-3 rounded-lg">
                <TrendingUp size={24} className="text-[#ef4444]" />
              </div>
            </div>
            <p className="text-xs text-[#a8a29e]">Products with active discounts</p>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-xl p-8">
          <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <Link
              href="/admin/products/new"
              className="px-6 py-3 bg-[#d4af37] text-[#0a0a0a] font-semibold rounded-lg tracking-wide hover:bg-[#c99f2d] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Add New Product
            </Link>

            <Link
              href="/admin/products"
              className="px-6 py-3 bg-transparent border border-[rgba(255,255,255,0.08)] text-[#f5f5f4] font-semibold rounded-lg tracking-wide hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
            >
              Manage Products
            </Link>

            <Link
              href="/admin/system"
              className="px-6 py-3 bg-transparent border border-[rgba(255,255,255,0.08)] text-[#f5f5f4] font-semibold rounded-lg tracking-wide hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
            >
              System and Cache
            </Link>

            <Link
              href="/"
              className="px-6 py-3 bg-transparent border border-[rgba(255,255,255,0.08)] text-[#f5f5f4] font-semibold rounded-lg tracking-wide hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
            >
              View Store
            </Link>

            <button
              onClick={handleLoadCache}
              disabled={cacheLoading}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border border-[rgba(212,175,55,0.4)] text-[#d4af37] font-semibold rounded-lg tracking-wide hover:bg-[rgba(212,175,55,0.1)] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <RefreshCw size={18} className={cacheLoading ? 'animate-spin' : ''} />
              {cacheLoading ? 'Loading...' : 'Load Products to Redis'}
            </button>
          </div>

          {cacheMessage && (
            <div
              className={`px-4 py-3 rounded-lg text-sm inline-block ${
                cacheSuccess
                  ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[#10b981]'
                  : 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]'
              }`}
            >
              {cacheMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}