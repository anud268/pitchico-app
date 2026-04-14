"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';

export default function AllProductsPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return <div className="pt-25 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  return (
    <div className="pt-25 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-dark mb-4">All Innovations</h1>
        <div className="w-16 h-1 bg-gold mx-auto my-8"></div>
        <p className="text-xl text-gray-500 font-light">Explore our complete collection of smart gadgets.</p>
      </div> */}

      <div className="flex overflow-x-auto gap-2 md:gap-3 mb-6 md:mb-10 pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:justify-center snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-shrink-0 whitespace-nowrap snap-start px-3 py-1.5 md:py-2 md:px-6 rounded-full text-[9px] md:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-sm ${
              selectedCategory === category 
                ? 'bg-dark text-white shadow-lg scale-105' 
                : 'bg-white text-gray-500 hover:text-dark hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
        {filteredProducts.map(product => (
          <div key={product.id} onClick={() => router.push(`/product/${product.id}`)} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group flex flex-col">
            <div className="w-full aspect-[4/5] md:aspect-square overflow-hidden bg-gray-50 relative">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {product.hasOffer && (
                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-gold text-white text-[8px] md:text-[10px] font-black tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase z-10 shadow-lg">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            <div className="p-3 md:p-8 flex flex-col flex-grow items-center text-center">
              {product.category && (
                <span className="text-[9px] md:text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded uppercase tracking-wider mb-2 md:mb-3">
                  {product.category}
                </span>
              )}
              <h3 className="text-[13px] md:text-xl md:leading-tight font-display font-bold text-dark mb-1 md:mb-3 line-clamp-2 md:line-clamp-none min-h-[30px] md:min-h-0">{product.name}</h3>
              <div className="text-xs md:text-lg font-medium text-gold mb-2 md:mb-3 flex flex-col md:flex-row items-center gap-1 md:gap-2">
                {product.hasOffer && (
                  <span className="text-gray-400 line-through text-[10px] md:text-xs">{formatCurrency(product.originalPrice)}</span>
                )}
                <span>{formatCurrency(product.price)}</span>
              </div>
              {/* Star Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-1 mb-3 md:mb-5">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(star => {
                      const filled = star <= Math.floor(product.rating);
                      const half = !filled && star === Math.ceil(product.rating) && product.rating % 1 >= 0.5;
                      return (
                        <svg key={star} className={`w-3 h-3 md:w-3.5 md:h-3.5 fill-current ${filled ? 'text-yellow-400' : half ? 'text-yellow-300' : 'text-gray-200'}`} viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      );
                    })}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-gray-700">{product.rating.toFixed(1)}</span>
                  {product.ratingCount > 0 && (
                    <span className="text-[9px] md:text-[10px] text-gray-400">({product.ratingCount.toLocaleString()})</span>
                  )}
                </div>
              )}
              <p className="text-[11px] md:text-sm text-gray-500 mb-3 md:mb-6 line-clamp-2 hidden md:-webkit-box flex-grow">{product.description}</p>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  addToCart(product, 1); 
                }}
                className="w-full mt-auto py-2.5 md:py-3 bg-dark text-white font-medium tracking-wider md:tracking-widest uppercase text-[10px] md:text-xs rounded hover:bg-gold transition-colors duration-300 pointer-events-auto"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
