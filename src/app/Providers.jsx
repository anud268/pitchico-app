"use client";

import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Providers({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, [pathname]);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-ivory text-dark font-body select-none relative overflow-x-hidden">
        <Navbar isScrolled={isScrolled} />
        <CartDrawer />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
