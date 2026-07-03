import type { Metadata } from 'next';
import Image from 'next/image';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import FavoritesSidebar from '@/components/FavoritesSidebar';
import LoginModal from '@/components/LoginModal';
import './globals.css';

export const metadata: Metadata = {
  title: 'LYREN | Luxury Conscious Craftsmanship',
  description: 'Refining the art of modern luxury through conscious craftsmanship and artisanal detail.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-[#0a0a0a] text-[#f5f5f4] relative overflow-x-hidden antialiased"
  suppressHydrationWarning
  >
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <div className="fixed inset-0 -z-10">
                <Image 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
                  alt="Background" 
                  fill
                  priority
                  className="w-full h-full object-cover blur-3xl opacity-20"
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/60" />
              </div>
              
              <Header />
              {children}
              <Footer />
              <CartSidebar />
              <FavoritesSidebar />
              <LoginModal />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}