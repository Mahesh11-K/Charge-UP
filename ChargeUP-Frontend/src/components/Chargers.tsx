// src/components/Chargers.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import acChargerImg from '../assets/ACC.png';
import dcChargerImg from '../assets/DCC.png';

const DiscoverOurChargers: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section id="pricing" className="py-24 bg-linear-to-br from-emerald-50/60 via-slate-50 to-sky-50/60 text-slate-900 font-sans relative overflow-hidden">
      
      {/* Mixed Eco-Green & Ocean Blue Ambient Glows */}
      <div className="absolute top-[-10%] left-[15%] w-[450px] h-[450px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
            Hardware Engineering
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mt-3">
            Discover Our <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600">Chargers</span>
          </h2>
        </div>

        {/* Dual-Column Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* COLUMN 1: AC CHARGERS */}
          <div className="flex flex-col justify-between space-y-8 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-emerald-700 tracking-tight flex items-center gap-2">
                  <span>AC Chargers</span>
                </h3>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
                  7.4 kW – 22 kW
                </span>
              </div>
              
              <ul className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2.5 mt-1.5 shrink-0 block w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                  <span>
                    <strong className="text-slate-900 font-semibold">Nectar Home EV Chargers</strong> - Smart home EV chargers in 7.4 kW, 11 kW, and 22 kW variants.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2.5 mt-1.5 shrink-0 block w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                  <span>
                    <strong className="text-slate-900 font-semibold">Portable EV Charger</strong> - Available in 3.3 kW and 7.4 kW variants with standard 3-pin plug support.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2.5 mt-1.5 shrink-0 block w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                  <span>
                    <strong className="text-slate-900 font-semibold">AdWall AC Charger</strong> - AC charger with a built-in digital advertising display.
                  </span>
                </li>
              </ul>
            </div>

            {/* Showcase Image Card */}
            <div className="relative group overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 aspect-4/3 w-full shadow-sm flex flex-col justify-end p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 opacity-90" 
                style={{ backgroundImage: `linear-gradient(to top, #020617, rgba(2, 6, 23, 0.3), rgba(15, 23, 42, 0.1)), url(${acChargerImg})` }}
              />
              
              <div className="absolute top-6 left-6 z-10 text-emerald-400 font-black tracking-wider text-xs uppercase bg-slate-950/80 px-2.5 py-1 rounded-md border border-emerald-500/30">
                CHARGE-UP AC
              </div>

              <button 
                onClick={() => handleNavigation('/products')}
                className="relative z-10 w-fit bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all text-xs cursor-pointer"
              >
                See AC Chargers ➔
              </button>
            </div>
          </div>

          {/* COLUMN 2: DC FAST CHARGERS */}
          <div className="flex flex-col justify-between space-y-8 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-sky-700 tracking-tight flex items-center gap-2">
                  <span>DC Fast Chargers</span>
                </h3>
                <span className="text-[10px] font-black uppercase bg-sky-100 text-sky-800 px-2.5 py-1 rounded-md border border-sky-200">
                  60 kW – 360 kW
                </span>
              </div>
              
              <ul className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
                <li className="flex items-start">
                  <span className="text-sky-500 mr-2.5 mt-1.5 shrink-0 block w-2 h-2 rounded-full bg-sky-500 shadow-sm" />
                  <span>
                    <strong className="text-slate-900 font-semibold">Configurable DC Fast Chargers</strong> - DC fast chargers available from 60 kW to 360 kW for different site requirements.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-500 mr-2.5 mt-1.5 shrink-0 block w-2 h-2 rounded-full bg-sky-500 shadow-sm" />
                  <span>
                    <strong className="text-slate-900 font-semibold">60 kW Mini DC Fast Charger</strong> - Compact DC fast charger designed for flexible installation.
                  </span>
                </li>
              </ul>
            </div>

            {/* Showcase Image Card */}
            <div className="relative group overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 aspect-4/3 w-full shadow-sm flex flex-col justify-end p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 opacity-90" 
                style={{ backgroundImage: `linear-gradient(to top, #020617, rgba(2, 6, 23, 0.3), rgba(15, 23, 42, 0.1)), url(${dcChargerImg})` }}
              />
              
              <div className="absolute top-6 left-6 z-10 text-sky-400 font-black tracking-wider text-xs uppercase bg-slate-950/80 px-2.5 py-1 rounded-md border border-sky-500/30">
                CHARGE-UP DC
              </div>

              <button 
                onClick={() => handleNavigation('/products')}
                className="relative z-10 w-fit bg-linear-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all text-xs cursor-pointer"
              >
                See DC Chargers ➔
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DiscoverOurChargers;