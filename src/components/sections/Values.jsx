"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Values() {
  const router = useRouter();
  const values = [
    { title: "Absolute Utility", desc: "Every item in our store must solve a real-world problem or make your life exponentially easier." },
    { title: "The 'Wow' Factor", desc: "We prioritize products that inspire awe. If it doesn't make you say 'wow', it doesn't belong here." },
    { title: "Premium Quality", desc: "We heavily vet our innovations for durability, superior performance, and premium build quality." }
  ];

  return (
    <section id="values" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark mb-4">Our Philosophy</h2>
          <p className="text-xl text-gray-500 font-light">The standards that guide our curation process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((v, i) => (
            <div key={i} onClick={()=>router.push('/products')} className="bg-ivory p-12 rounded-xl text-center shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-5xl text-gold mb-6">✧</div>
              <h3 className="text-2xl font-display font-bold text-dark mb-4">{v.title}</h3>
              <p className="text-gray-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
