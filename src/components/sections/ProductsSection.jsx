"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';

export default function ProductsSection() {
  const router = useRouter();
  const { addToCart } = useCart();
  const scrollRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const reqRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const baseProducts = products.filter(product => product.showOnFrontPage);
  // Duplicate array 3 times for a seamless infinite scroll loop
  const displayProducts = [...baseProducts, ...baseProducts, ...baseProducts];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (!isHovered && !isDown && !userInteracted) {
        const child = el.firstElementChild;
        if (child) {
          const gap = window.innerWidth >= 768 ? 24 : 16;
          const scrollAmount = child.offsetWidth + gap;
          const jumpPoint = scrollAmount * baseProducts.length;

          if (el.scrollLeft >= jumpPoint - 5) {
            // Instantly jump backward by exactly one original set length
            el.classList.remove('snap-mandatory');
            el.scrollTo({ left: el.scrollLeft - jumpPoint, behavior: 'instant' });

            // Allow DOM to process the jump, then smoothly slide to next item
            setTimeout(() => {
              el.classList.add('snap-mandatory');
              el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }, 30);
          } else {
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }
    }, 2500); // 2.5s hold gives better reading time

    return () => clearInterval(interval);
  }, [isHovered, isDown]);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setUserInteracted(true);
    
    const el = scrollRef.current;
    if (el) {
      el.classList.remove('snap-mandatory');
      setStartX(e.pageX - el.offsetLeft);
      setScrollLeftState(el.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsHovered(false);
    if(scrollRef.current) scrollRef.current.classList.add('snap-mandatory');
  };

  const handleMouseUp = () => {
    setIsDown(false);
    if(scrollRef.current) scrollRef.current.classList.add('snap-mandatory');
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleTouchStart = () => {
    setUserInteracted(true);
  };

  // Products are defined above to be used inside useEffect

  return (
    <section id="products" className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-12 md:mb-20">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-dark mb-4">Trending Innovations</h2>
        {/* <div className="w-16 h-1 bg-gold mx-auto my-6 md:my-8"></div> */}
        <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto">Smart gadgets designed to instantly upgrade your lifestyle.</p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto cursor-grab active:cursor-grabbing pb-8 select-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onTouchStart={handleTouchStart}
      >
        {displayProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            onClick={() => {
              // Prevent navigation if we are dragging
              if (isDown) return;
              router.push(`/product/${product.id}`);
            }}
            className="w-[calc(50%-8px)] md:w-[calc(25%-18px)] shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col snap-start"
          >
            <div className="w-full aspect-square overflow-hidden bg-gray-50 relative pointer-events-none">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" draggable="false" />
              {product.hasOffer && (
                <div className="absolute top-2 right-2 bg-gold text-white text-[9px] md:text-[10px] font-black tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase z-10 shadow-lg">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            <div className="p-3 md:p-5 flex flex-col flex-grow items-center text-center">
              <h3 className="text-sm md:text-lg leading-tight font-display font-bold text-dark mb-2 line-clamp-2 min-h-[40px] md:min-h-[48px]">{product.name}</h3>
              <div className="text-xs md:text-sm font-medium text-gold mb-2 flex flex-col md:flex-row items-center gap-1 md:gap-2">
                {product.hasOffer && (
                  <span className="text-gray-400 line-through text-[10px] md:text-xs">{formatCurrency(product.originalPrice)}</span>
                )}
                <span>{formatCurrency(product.price)}</span>
              </div>
              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => {
                    const val = Number(product.rating || 0);
                    const filled = star <= Math.floor(val);
                    const half = !filled && star === Math.ceil(val) && val % 1 >= 0.5;
                    return (
                      <svg key={star} className={`w-2.5 h-2.5 md:w-3 md:h-3 fill-current ${filled ? 'text-yellow-400' : half ? 'text-yellow-300' : 'text-gray-200'}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    );
                  })}
                </div>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-600">
                  {Number(product.rating || 0).toFixed(1)}
                </span>
                <span className="text-[8px] md:text-[9px] text-gray-400">
                  ({Number(product.ratingCount || 0).toLocaleString()})
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="w-full mt-auto py-2 md:py-3 bg-dark text-white font-medium tracking-wider uppercase text-[10px] md:text-xs rounded hover:bg-gold transition-colors duration-300 pointer-events-auto"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => router.push('/products')} className="w-full mt-auto py-2 md:py-3 bg-dark text-white font-medium tracking-wider uppercase text-[10px] md:text-xs rounded hover:bg-gold transition-colors duration-300 pointer-events-auto">View All Products</button>
    </section>
  );
}
