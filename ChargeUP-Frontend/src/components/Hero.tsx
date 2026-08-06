// src/components/Hero.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import hero from '../assets/Hero.png'; 

const Hero: React.FC = () => {
  const handleHowItWorksClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const processSection = document.getElementById('process');
      if (processSection) {
        processSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      className="relative pt-24 pb-16 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${hero})` }}
    >
      {/* Subtle overlay to keep text readable against background */}
      <div className="absolute inset-0 bg-linear-to-b from-white/70 via-white/85 to-white pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 mb-6 shadow-2xs">
          <span>⚡</span>
          <span>Next-Gen EV Charging Network</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Powering your journey, <br />
          <span className="text-emerald-500">
            anywhere, anytime.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Next-gen EV charging infrastructure powered by clean energy for seamless, reliable, and sustainable mobility. Charge UP on your terms.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/locations" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-emerald-600/20 transition-all cursor-pointer">
              Find Stations Near Me
            </button>
          </Link>

          <Link 
            to="/#process" 
            onClick={handleHowItWorksClick} 
            className="w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-full shadow-md transition-all cursor-pointer">
              How It Works
            </button>
          </Link>
        </div>

        {/* Key Stats Row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto pt-8">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">15,000+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Active Chargers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">99.9%</p>
            <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Uptime Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">&lt; 25 min</p>
            <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Avg. Fast Charge Time</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;