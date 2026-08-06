// src/components/Impact.tsx
import React from 'react';
import ImpactBgImg from '../assets/ImpactBG.png';

const OurImpact: React.FC = () => {
  return (
    <section className="py-24 bg-slate-950 text-white font-sans overflow-hidden relative">
      
      {/* Background Globe Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 pointer-events-none"
        style={{ backgroundImage: `url(${ImpactBgImg})` }}
      />
      
      {/* Lite Black Shadow / Subtle Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/40 via-slate-950/25 to-slate-950/50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-16">
          <div className="lg:col-span-7">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Our Impact in Every Charge
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal drop-shadow-xs">
              What if every charge made a difference? We exist to make cities cleaner and more connected through accessible EV charging — creating impact both environmentally and socially.
            </p>
          </div>
        </div>

        {/* Dual Impact Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CARD 1: ENVIRONMENTAL IMPACT */}
          <div className="bg-cyan-600/80 hover:bg-cyan-600/90 border border-cyan-400/40 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between transition-colors backdrop-blur-md">
            <div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs mb-6 border border-white/30">
                i
              </div>

              <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">
                Environmental Impact
              </h3>

              <div className="space-y-5 text-white/95 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Reduced Emissions</h4>
                  <p className="font-normal text-cyan-50">
                    More EVs on the road &rarr; lower greenhouse gases & air pollutants &rarr; cleaner air & better public health.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Renewable Integration</h4>
                  <p className="font-normal text-cyan-50">
                    Charging stations powered by solar & clean energy reduce carbon footprint.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Quieter Cities</h4>
                  <p className="font-normal text-cyan-50">
                    EV adoption lowers urban noise compared to traditional vehicles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: SOCIAL IMPACT */}
          <div className="bg-sky-600/80 hover:bg-sky-600/90 border border-sky-400/40 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between transition-colors backdrop-blur-md">
            <div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs mb-6 border border-white/30">
                i
              </div>

              <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">
                Social Impact
              </h3>

              <div className="space-y-5 text-white/95 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Higher EV Adoption</h4>
                  <p className="font-normal text-sky-50">
                    Accessible network reduces range anxiety &rarr; EVs become practical for daily life.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Job Creation</h4>
                  <p className="font-normal text-sky-50">
                    Skilled roles in operations, maintenance, and green economy growth.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Economic Boost</h4>
                  <p className="font-normal text-sky-50">
                    Stations attract footfall, increase property value, and support local businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default OurImpact;