

'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart3, Package, LogOut, User } from 'lucide-react';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const token = localStorage.getItem('accessToken');

    if (!loggedIn || !token) {
      router.replace('/login');
      return;
    }

    setAdminName(localStorage.getItem('adminName') || 'Admin');
    setAdminEmail(localStorage.getItem('adminEmail') || '');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.replace('/login');
  };

  const navItems = [
    { href: '/admin', icon: BarChart3, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
  ];

  return (
    <div className="admin-container">
      
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Admin</h1>
          <p className="sidebar-subtitle">LYREN</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-item ${pathname === href ? 'nav-item-active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <User size={16} />
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{adminName}</p>
              <p className="sidebar-user-email">{adminEmail}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="sidebar-logout">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}