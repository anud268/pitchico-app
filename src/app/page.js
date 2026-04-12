"use client";

import React from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Values from '@/components/sections/Values';
import ProductsSection from '@/components/sections/ProductsSection';

export default function Home() {
  return (
    <>
      <Hero />
      <ProductsSection />
      <About />
      <Values />
    </>
  );
}
