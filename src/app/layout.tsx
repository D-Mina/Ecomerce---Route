import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'FreshCart | Route E-Commerce',
  description: 'FreshCart - The leading e-commerce store in Egypt with Route APIs',
  icons: {
    icon: 'https://ecommerce.routemisr.com/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#1e293b',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '13px',
                    maxWidth: '90vw',
                  },
                  success: {
                    iconTheme: {
                      primary: '#0aad0a',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
                {children}
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
