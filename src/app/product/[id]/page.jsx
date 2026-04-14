"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 200;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!id) return;
    
    window.scrollTo(0, 0);
    const fetchProductData = async () => {
      try {
        const [productRes, allRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products`)
        ]);

        let currentProduct = null;

        if (productRes.ok) {
          currentProduct = await productRes.json();
          setProduct(currentProduct);
          setMainImage(currentProduct.images?.[0] || "");
        } else {
          setProduct(null);
        }

        if (allRes.ok) {
          const allData = await allRes.json();
          // Only show products from the same category, excluding current product
          const sameCategory = allData.filter(
            p => p.category === currentProduct?.category && p.id !== id
          );
          setRelatedProducts(sameCategory);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push(`/checkout/cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ivory text-dark pt-32 pb-24 px-6">
        <h2 className="text-xl font-display font-bold">Loading Product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ivory text-dark pt-32 pb-24 px-6">
        <h2 className="text-3xl font-display font-bold mb-4">Product Not Found</h2>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-dark text-white text-sm font-medium tracking-widest uppercase rounded">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      <button onClick={() => router.back()} className="mb-4 md:mb-8 hidden lg:block text-gray-500 hover:text-gold flex items-center gap-2 transition-colors uppercase tracking-widest text-[10px] md:text-xs font-semibold">
        <span>&larr;</span> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          <div>
            <div className="w-full h-[320px] sm:h-[450px] md:h-[60vh] rounded-xl overflow-hidden bg-gray-50 mb-4 relative">              <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />
              {product.hasOffer && (
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-gold text-white text-[10px] md:text-sm font-black tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase shadow-xl z-10">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setMainImage(img)} className={`w-16 h-16 md:w-24 md:h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${mainImage === img ? 'border-gold opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-start md:justify-center">
            <div className="inline-block self-start px-3 py-1 md:px-4 md:py-1.5 bg-gold/10 text-gold border border-gold rounded-full text-[10px] md:text-xs font-semibold tracking-wider uppercase mb-3 md:mb-6">
              {product.category || 'Premium Utility'}
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-dark mb-2 md:mb-3 leading-tight">{product.name}</h1>
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-3 md:mb-5">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(star => {
                    const filled = star <= Math.floor(product.rating);
                    const half = !filled && star === Math.ceil(product.rating) && product.rating % 1 >= 0.5;
                    return (
                      <svg key={star} className={`w-4 h-4 md:w-5 md:h-5 fill-current ${filled ? 'text-yellow-400' : half ? 'text-yellow-300' : 'text-gray-200'}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    );
                  })}
                </div>
                <span className="text-sm md:text-base font-bold text-gray-700">{product.rating.toFixed(1)}</span>
                {product.ratingCount > 0 && (
                  <span className="text-xs md:text-sm text-gray-400">({product.ratingCount.toLocaleString()} ratings)</span>
                )}
              </div>
            )}
            <div className="text-2xl md:text-3xl font-medium text-[#25D366] md:text-gold mb-6 md:mb-8 flex items-center gap-3">
              {product.hasOffer && (
                <span className="text-gray-400 line-through text-lg md:text-2xl">{formatCurrency(product.originalPrice)}</span>
              )}
              <span className="font-bold">{formatCurrency(product.price)}</span>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col gap-4 mb-8 md:mb-10 w-full mt-2">
              <div className="flex items-center gap-5">
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-500">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-28 md:w-32 h-10 md:h-12 shadow-sm">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex-1 h-full text-gray-400 hover:text-dark hover:bg-gray-50 font-bold transition flex justify-center items-center text-lg"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-dark text-sm md:text-base">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="flex-1 h-full text-gray-400 hover:text-dark hover:bg-gray-50 font-bold transition flex justify-center items-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 pt-2 border-t border-gray-100 md:border-none md:pt-0">
                <button 
                  onClick={handleAddToCart}
                  className="w-full sm:w-1/2 py-3.5 md:py-4 bg-white border border-dark text-dark text-xs md:text-sm font-bold tracking-widest uppercase rounded shadow-sm hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Add To Cart
                </button>
                <button 
                  onClick={handleBuyNow} 
                  className="w-full sm:w-1/2 py-3.5 md:py-4 bg-dark border border-dark text-white text-xs md:text-sm font-bold tracking-widest uppercase rounded hover:bg-gold hover:border-gold transition-all duration-300 shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Buy Now &rarr;
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-8">{product.longDescription}</p>

            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-display font-bold text-dark border-b border-gray-200 pb-2 md:pb-3 mb-4 md:mb-6">Innovative Features</h3>
              <ul className="space-y-3">
                {product.features.map((f, i) => (
                  <li key={i} className="text-gray-600 text-sm md:text-base relative pl-6 md:pl-8 before:content-['✦'] before:absolute before:left-0 before:text-gold">{f}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg md:text-xl font-display font-bold text-dark border-b border-gray-200 pb-2 md:pb-3 mb-4 md:mb-6">Why You Need This</h3>
              <ul className="space-y-3">
                {product.advantages.map((a, i) => (
                  <li key={i} className="text-gray-600 text-sm md:text-base relative pl-6 md:pl-8 before:content-['✦'] before:absolute before:left-0 before:text-gold">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">You May Also Like</h2>
              {product.category && (
                <p className="text-xs md:text-sm text-gray-400 mt-1 tracking-widest uppercase">More from <span className="text-gold font-semibold">{product.category}</span></p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="p-2 md:p-3 rounded-full bg-white border border-gray-200 text-dark hover:bg-gold hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => scroll('right')} className="p-2 md:p-3 rounded-full bg-white border border-gray-200 text-dark hover:bg-gold hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {relatedProducts.map(p => (
              <div
                key={p.id}
                onClick={() => router.push(`/product/${p.id}`)}
                className="min-w-[160px] md:min-w-[240px] w-[160px] md:w-[240px] flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer snap-start flex flex-col"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-50 relative">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  {p.hasOffer && (
                    <div className="absolute top-2 right-2 bg-gold text-white text-[8px] md:text-[10px] font-black tracking-widest px-2 py-1 rounded-full uppercase shadow-lg z-10">
                      {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow text-center items-center">
                  <h3 className="text-sm md:text-lg font-display font-bold text-dark mb-1 line-clamp-2 min-h-[40px] md:min-h-[50px]">{p.name}</h3>
                  <div className="text-xs md:text-sm font-medium text-gold mb-3 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                    {p.hasOffer && (
                      <span className="text-gray-400 line-through text-[10px] md:text-xs">{formatCurrency(p.originalPrice)}</span>
                    )}
                    <span>{formatCurrency(p.price)}</span>
                  </div>
                  <button className="w-full mt-auto py-2 bg-dark text-white text-[10px] md:text-xs font-medium tracking-widest uppercase rounded hover:bg-gold transition-colors duration-300">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
