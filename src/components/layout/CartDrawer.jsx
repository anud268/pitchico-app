"use client";

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [isCartOpen]);

  if (!isCartOpen && cart.length === 0) return null; // Don't even render if closed and empty? Wait, better to keep it conditionally rendered for animations.

  const checkoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout/cart'); // Handle cart specifically
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-ivory z-[250] shadow-2xl transform transition-transform duration-500 flex flex-col ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-display font-bold text-dark">Your Selection ({cart.length})</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-dark transition-colors rounded-full hover:bg-gray-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="text-lg">Your collection is empty.</p>
              <button 
                onClick={() => { setIsCartOpen(false); router.push('/products'); }}
                className="mt-4 px-6 py-2 bg-dark text-white rounded text-xs uppercase tracking-widest font-semibold hover:bg-gold transition"
              >
                Discover Pieces
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 relative group">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0 relative">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div className="pr-4">
                    <h3 className="text-sm font-bold text-dark leading-snug line-clamp-2">{item.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {item.product.hasOffer && (
                        <span className="text-gray-400 line-through text-xs">{formatCurrency(item.product.originalPrice)}</span>
                      )}
                      <span className="text-gold font-bold text-sm">{formatCurrency(item.product.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-[100px]">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="flex-1 py-1.5 text-gray-500 hover:text-dark hover:bg-gray-50 font-bold transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="flex-1 py-1.5 text-gray-500 hover:text-dark hover:bg-gray-50 font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 text-sm font-semibold tracking-widest uppercase">Subtotal</span>
              <span className="text-2xl font-bold text-dark">{formatCurrency(getCartTotal())}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">Shipping and taxes calculated at checkout.</p>
            <button 
              onClick={checkoutClick}
              className="w-full py-4 bg-dark text-white font-bold tracking-widest uppercase rounded shadow-lg hover:bg-gold transition-colors hover:-translate-y-1"
            >
              Order Now
            </button>
          </div>
        )}
      </div>
    </>
  );
}
