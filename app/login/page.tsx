'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5036/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed');
        return;
      }

      
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', data.email || email);
      localStorage.setItem('adminName', data.name || '');
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      router.push('/admin');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      
      <div className="fixed top-[-50%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-b from-[rgba(212,175,55,0.08)] to-transparent rounded-full pointer-events-none z-0" />

      
      <div className="relative z-10 w-full max-w-[420px] mx-4 bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 shadow-2xl">

        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-wide text-[#f5f5f4] mb-2">
            Admin Panel
          </h1>
          <p className="text-sm text-[#a8a29e] tracking-wide">
            Restricted access — admins only
          </p>
        </div>

        
        {error && (
          <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg px-4 py-3 mb-6 text-center">
            <p className="text-sm text-[#ef4444]">{error}</p>
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">

          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium tracking-wide text-[#f5f5f4]">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a29e] pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#f5f5f4] text-sm placeholder-[#a8a29e] focus:outline-none focus:border-[#d4af37] focus:bg-[rgba(212,175,55,0.05)] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium tracking-wide text-[#f5f5f4]">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a29e] pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-11 pr-12 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#f5f5f4] text-sm placeholder-[#a8a29e] focus:outline-none focus:border-[#d4af37] focus:bg-[rgba(212,175,55,0.05)] transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#d4af37] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[#d4af37] text-[#0a0a0a] font-semibold rounded-lg tracking-wide flex items-center justify-center gap-2 hover:bg-[#c99f2d] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[rgba(10,10,10,0.3)] border-t-[#0a0a0a] rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        
        <p className="text-center text-xs text-[#a8a29e] tracking-wide">
          Regular users cannot access this panel.
        </p>
      </div>
    </div>
  );
}