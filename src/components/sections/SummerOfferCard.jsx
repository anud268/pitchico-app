"use client";

import React from 'react';
import Link from 'next/link';
const getIKImage = (filename) => `https://ik.imagekit.io/xtsxmvsu4/Products/${filename}?tr=w-1200,q-80`;


export default function SummerOfferCard() {
  return (
    <React.Fragment>
      <div className="relative w-full lg:max-w-[380px] max-w-[680px] rounded-[2.5rem]  p-0 md:p-0 bg-gold/70 backdrop-blur-xl shadow-[0px_0px_40px_10px_rgba(0,0,0,0.15)] group transition-all duration-[800ms] hover:shadow-[0_40px_80px_-20px_rgba(184,134,11,0.25)] hover:-translate-y-2 mt-0 md:mt-4">
        <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden bg-white/95 flex flex-row lg:flex-col shadow-[0_4px_20px_rgba(0,0,0,0.05)] lg:shadow-none h-[140px] sm:h-[160px] lg:h-auto items-stretch group-hover:bg-white transition-colors duration-300">
          
          {/* Luxury Banner Image */}
          <div className="relative w-[35%] sm:w-[40%] lg:w-full h-full lg:h-64 overflow-hidden shrink-0 border-r border-gray-100 lg:border-r-0">
            {/* Aesthetic Palm Shadow Image */}
            <img src={getIKImage('summerofferbg.png')} alt="" className='w-full h-full object-cover' />
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gold/95 via-yellow-500/40 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
            
            {/* Floating Badge */}
            <div className="absolute top-5 sm:right-5 right-2  backdrop-blur-md border border-black text-black text-[6px] lg:text-[9px] font-bold tracking-[0.3em] uppercase px-2 lg:px-4 py-1 lg:py-1.5 rounded-full overflow-hidden">
              <span className="relative z-10 text-black ">Limited Edition</span>
            </div>

            {/* Typography */}
            <div className="absolute bottom-2 md:bottom-6 left-0 w-full px-2 md:px-8 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl md:text-5xl !font-bold font-display font-medium text-white tracking-widest leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform duration-700 group-hover:-translate-y-1">SUMMER</h3>
              <p className="text-base sm:text-xl md:text-4xl font-bold text-black -mt-1 md:-mt-2 lg:ml-4 transition-transform duration-700 delay-75 group-hover:-translate-y-1" style={{ fontFamily: "'Great Vibes', cursive", textShadow: "0 2px 8px rgba(255,255,255,0.4)" }}>Special Collection</p>
            </div>
          </div>
          
          {/* Content Bottom */}
          {/* Content Bottom */}
          <div className="w-[65%] sm:w-[60%] lg:w-full px-3 sm:px-5 py-3 sm:py-4 md:px-8 md:pb-8 md:pt-7 relative z-20 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 md:pb-6 md:border-b border-gray-100 gap-1 sm:gap-2">
              <div>
                <p className="text-[7.5px] sm:text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.35em] mb-0.5">Exclusive Access</p>
                <h4 className=" text-3xl sm:text-2xl md:text-4xl font-display font-bold animate-blink-gold-white leading-tight">Up to 50% Off</h4>
              </div>
              <div className="hidden sm:flex w-8 h-8 md:w-12 md:h-12 rounded-full bg-gold/10 items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            </div>
            
            <p className="text-[10px] sm:text-xs md:text-[13px] text-gray-500 leading-relaxed font-light hidden lg:block">
              Elevate your surroundings with our meticulously curated summer innovations. Discover premium craftsmanship and timeless design.
            </p>
            
            <Link href="/products" className="relative flex items-center justify-center w-full py-2.5 sm:py-3 md:py-4 text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase text-dark border border-dark/60 rounded-lg md:rounded-xl overflow-hidden group/btn transition-colors hover:border-gold mt-auto">
              <div className="absolute inset-0 w-0 bg-gold transition-all duration-[400ms] ease-out group-hover/btn:w-full" />
              <span className="relative transition-colors duration-300 group-hover/btn:text-white flex items-center gap-1.5 md:gap-2">
                Unlock Offers <span className="text-sm sm:text-base md:text-lg leading-none transform group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
