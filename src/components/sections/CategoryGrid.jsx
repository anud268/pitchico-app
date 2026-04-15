"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryGrid() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const products = await res.json();
        
        // Group by category
        const grouped = products.reduce((acc, product) => {
          if (!product.category) return acc;
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});

        // Map to category objects with latest 4 images (only from showOnFrontPage products)
        const categoryList = Object.keys(grouped)
          .map(name => {
            const catProducts = grouped[name];
            
            // Check if this category should be shown on home page
            // (If any product in this category has showCategoryOnHomePage === true)
            const shouldShow = catProducts.some(p => p.showCategoryOnHomePage === true);
            
            // Get latest 4 product images ONLY where showOnFrontPage is true
            const images = catProducts
              .filter(p => p.showOnFrontPage === true)
              .slice(0, 4)
              .map(p => p.images[0])
              .filter(Boolean);
            
            return {
              name,
              images,
              count: catProducts.length,
              shouldShow
            };
          })
          .filter(cat => cat.shouldShow);

        setCategories(categoryList);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <div className="h-10 md:h-12 w-64 bg-gray-100 mx-auto rounded-lg animate-pulse mb-4"></div>
          <div className="w-12 h-1 bg-gray-100 mx-auto mb-6"></div>
          <div className="h-4 w-48 bg-gray-100 mx-auto rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-1">
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="bg-gray-50 animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 md:mb-20">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-dark mb-4 uppercase tracking-tight">Explore Collections</h2>
        <div className="w-12 h-1 bg-gold mx-auto mb-6"></div>
        <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto italic font-serif">Curated innovations sorted by your lifestyle needs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}`)}
            className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
          >
            {/* 4-Square Image Collage */}
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5 bg-gray-100 group-hover:scale-105 transition-transform duration-700">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative w-full h-full overflow-hidden bg-white">
                  {category.images[i] ? (
                    <img 
                      src={category.images[i]} 
                      alt="" 
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Premium Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-display font-bold mb-1 tracking-wide group-hover:text-gold transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                    {category.count} {category.count === 1 ? 'Innovation' : 'Innovations'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-gold group-hover:border-gold transition-all duration-300 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Subtle border overlay on hover */}
            <div className="absolute inset-0 border-0 group-hover:border-[8px] border-white/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
