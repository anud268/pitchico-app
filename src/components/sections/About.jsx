import React from 'react';
const getIKImage = (filename) => `https://ik.imagekit.io/xtsxmvsu4/Products/${filename}?tr=w-1200,q-80`;


export default function About() {
  return (
    <section id="mission" className="py-32 px-6 max-w-7xl mx-auto flex justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="rounded-xl overflow-hidden hidden lg:block shadow-2xl aspect-[4/5] w-full">
          <img src={getIKImage('ourmission.png')} alt="Innovation and Technology" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark mb-4">Design That Solves <br />Design That Wows</h2>
          <div className="w-16 h-1 bg-gold my-8"></div>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>We believe that the best products are the ones that fundamentally change how you experience the world. It’s not just about aesthetics; it’s about absolute utility effortlessly merged with jaw-dropping design.</p>
            <p>From alleviating common daily frustrations to introducing you to technology that feels like magic, our curated collection is built strictly for the modern lifestyle. Whether it's correcting your posture throughout the working day or placing a levitating light on your desk, we focus on impact.</p>
            <p>We meticulously test and source only the highest-rated problem-solving gadgets that bring an undeniable 'wow' factor straight to your doorstep. Experience the future of everyday living right now.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
