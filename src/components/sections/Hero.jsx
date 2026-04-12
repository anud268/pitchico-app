"use client";

import React from 'react';
import Link from 'next/link';
import SummerOfferCard from './SummerOfferCard';
import WhatsAppWidget from './WhatsAppWidget';

export default function Hero() {
  return (
    <header className="relative min-h-screen flex items-center pt-32 pb-24 lg:py-0 px-6 overflow-hidden">
      <div className="fixed top-[75px] left-0 w-full h-[25px] bg-dark/95 border-b border-gold/30 flex items-center overflow-hidden z-50">
        <div className="w-[200%] flex items-center animate-marquee whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="mx-6 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white inline-flex items-center">
              Pitchi<span className="text-gold">co</span> <span className="mx-6 text-gold/40">✦</span> SUMMER EXCLUSIVE : UP TO <span className="text-gold ml-1 animate-blink-gold-white">50% OFF</span> <span className="mx-6 text-gold/40">✦</span>
            </span>
          ))}
        </div>
      </div>
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-ivory bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-ivory/20 lg:to-ivory/50" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 lg:gap-12 animate-[fadeIn_1.5s_ease-out] mt-10 md:mt-0">

        {/* Right Content : Offer Card */}
        <div className="w-full mt-4 lg:mt-0 lg:w-auto flex justify-center lg:justify-end animate-[fadeInRight_1.5s_ease-out] relative z-20 perspective-1000 order-1 lg:order-2">
          <SummerOfferCard />
        </div>

        {/* Left Content */}
        <div className="w-full max-w-2xl text-center lg:text-left mt-4 lg:mt-0 order-2 lg:order-1">
          <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 bg-gold/10 text-gold border border-gold rounded-full text-[10px] md:text-sm font-semibold tracking-wider uppercase mb-5 md:mb-0">
            Curated in Kerala for Modern Living
          </div>
          <h1 className="flex flex-col text-center lg:text-left text-dark mb-4 md:mb-6 mt-5">
            <span className="font-hero-script text-6xl md:text-7xl lg:text-8xl text-gold font-normal leading-none -mb-3 md:-mb-5 z-10 drop-shadow-sm">
              Elevate Your
            </span>
            <span className="font-hero-serif text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-dark leading-none">
              Reality
            </span>
            <span className="font-body text-sm md:text-lg text-gray-500 tracking-widest uppercase mt-4 md:mt-6 font-semibold">
              With Smart Innovations
            </span>
          </h1>
          <p className="text-sm md:text-xl text-gray-600 mb-6 md:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 lg:px-0">
            Inspired by innovation, rooted in Kerala. We bring you thoughtfully curated smart products designed to simplify and elevate your everyday lifestyle.
          </p>
          <div className="flex  sm:flex-row justify-center lg:justify-start gap-3 md:gap-6">
            <Link href="/products" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 md:px-10 md:py-4 bg-dark text-white font-medium tracking-widest uppercase text-xs md:text-sm rounded hover:bg-gold hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              All Products
            </Link>
            <a href="/#mission" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 md:px-10 md:py-4 border border-dark text-dark font-medium tracking-widest uppercase text-xs md:text-sm rounded hover:bg-dark hover:text-white transition-all duration-300">
              Our Mission
            </a>
          </div>
        </div>
      </div>

      <WhatsAppWidget />
    </header>
  );
}
