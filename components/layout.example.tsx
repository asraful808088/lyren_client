

import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AuthProvider } from '../context/AuthContext';
import Header from './Header';
import FavoritesSidebar from './FavoritesSidebar';
import LoginModal from './LoginModal';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white">
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>

              
              <FavoritesSidebar />
              <LoginModal />
              
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
