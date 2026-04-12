"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
const logoUrl = '/assets/logo.png';
import { useCart } from '@/context/CartContext';

export default function Navbar({ isScrolled }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  useEffect(()=>{
    onscroll=()=>{
      setIsMobileMenuOpen(false);
    }
  },[])

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all bg-ivory ${isScrolled ? ' border-b border-gray-200 py-5 md:py-5 shadow-sm' : 'py-5 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 z-50 group">
          <img src={logoUrl} alt="Pitchico Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
          <span className="text-2xl md:text-3xl font-logo font-bold text-dark  mt-1">
            Pitchi<span className="text-gold group-hover:text-[#D4AF37] transition-colors">co</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 items-center">
          <a href="/" className="text-sm font-medium tracking-widest uppercase text-dark hover:text-gold transition-colors">Home</a>
          <a href="/#mission" className="text-sm font-medium tracking-widest uppercase text-dark hover:text-gold transition-colors">Our Mission</a>
          <Link href="/products" className="text-sm font-medium tracking-widest uppercase text-dark hover:text-gold transition-colors">All Products</Link>
          <a href="https://wa.me/919778167652?text=Hello%20Pitchico%20Team!%20I%20need%20some%20assistance%20with%20my%20shopping." target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-widest uppercase text-dark hover:text-gold transition-colors flex items-center gap-1.5">
            Help
          </a>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-dark hover:text-gold transition-colors group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {getCartCount() > 0 && (
              <span className="absolute 0 top-0 right-0 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-dark hover:text-gold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {getCartCount() > 0 && (
              <span className="absolute top-0 right-0 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Mobile Toggle Button */}
          <button 
            className="p-2 text-dark focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-ivory z-49 w-full h-full flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0 ' : 'translate-x-full'} md:hidden`}>
          <div className="flex flex-col items-center gap-10">
            <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold tracking-widest uppercase text-dark hover:text-gold transition-colors">Home</a>
            <a href="/#mission" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold tracking-widest uppercase text-dark hover:text-gold transition-colors">Our Mission</a>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold tracking-widest uppercase text-dark hover:text-gold transition-colors">All Products</Link>
            <a href="https://wa.me/919778167652?text=Hello%20Pitchico%20Team!%20I%20need%20some%20assistance%20with%20my%20shopping." target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold tracking-widest uppercase text-dark hover:text-gold transition-colors flex items-center gap-2">
              Help
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
