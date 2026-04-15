"use client";

import React from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Values from '@/components/sections/Values';
import CategoryGrid from '@/components/sections/CategoryGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <About />
      <Values />
    </>
  );
}
