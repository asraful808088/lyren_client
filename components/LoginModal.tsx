'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal() {
  const { isLoginOpen, setIsLoginOpen, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoginOpen) {
      setTimeout(() => emailRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setError('');
      setForm({ name: '', email: '', password: '' });
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLoginOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLoginOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setIsLoginOpen]);

  if (!isLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !form.name) { setError('Please enter your name.'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleOAuthLogin = (provider: 'google' | 'facebook' | 'instagram') => {
    setOauthLoading(provider);
    window.location.href = `/api/auth/${provider}`;
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
  };

  return (
    <>
      
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[90]"
        onClick={() => setIsLoginOpen(false)}
      />

      
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div
          className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

          
          <button
            onClick={() => setIsLoginOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-white transition"
          >
            <X size={15} />
          </button>

          <div className="px-8 pt-10 pb-10">
            
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#d4af37] mb-1">
              LYREN
            </p>

            
            <h2 className="font-serif text-2xl tracking-wide text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[11px] text-gray-600 tracking-wide mb-8">
              {mode === 'login'
                ? 'Sign in to access your saved items and orders'
                : 'Join to save favourites and track your orders'}
            </p>

            
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-[#d4af37]/40 transition placeholder-gray-700 tracking-wide"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1.5">
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-[#d4af37]/40 transition placeholder-gray-700 tracking-wide"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-3 pr-11 outline-none focus:border-[#d4af37]/40 transition placeholder-gray-700 tracking-wide"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-[10px] tracking-[0.15em] uppercase text-gray-600 hover:text-[#d4af37] transition"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              
              {error && (
                <p className="text-[11px] text-red-400 tracking-wide">{error}</p>
              )}

              
              <button
                type="submit"
                disabled={loading || oauthLoading !== null}
                className="w-full mt-2 bg-white text-black text-[11px] tracking-[0.25em] uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-[#d4af37] transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>

            
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-700">or continue with</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            
            <div className="grid grid-cols-3 gap-3 mb-6">
              
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                disabled={oauthLoading !== null}
                className="relative flex items-center justify-center h-12 bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with Google"
              >
                {oauthLoading === 'google' ? (
                  <Loader2 size={16} className="animate-spin text-[#d4af37]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" color="white">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
              </button>

              
              <button
                type="button"
                onClick={() => handleOAuthLogin('facebook')}
                disabled={oauthLoading !== null}
                className="relative flex items-center justify-center h-12 bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with Facebook"
              >
                {oauthLoading === 'facebook' ? (
                  <Loader2 size={16} className="animate-spin text-[#d4af37]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
              </button>

              
              <button
                type="button"
                onClick={() => handleOAuthLogin('instagram')}
                disabled={oauthLoading !== null}
                className="relative flex items-center justify-center h-12 bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with Instagram"
              >
                {oauthLoading === 'instagram' ? (
                  <Loader2 size={16} className="animate-spin text-[#d4af37]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37Z" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                  </svg>
                )}
              </button>
            </div>

            
            <p className="text-center text-[11px] text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-white hover:text-[#d4af37] transition underline underline-offset-2"
              >
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}