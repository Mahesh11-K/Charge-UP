// src/pages/AboutUs.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/ImpactBG.png';
import { 
  FaBolt, 
  FaLeaf, 
  FaShieldAlt, 
  FaChargingStation, 
  FaUsers, 
  FaArrowRight, 
  FaGlobeEurope,
  FaAward,
  FaHandshake,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle
} from 'react-icons/fa';

interface PartnerBrand {
  id: string;
  name: string;
  category: 'EV Automaker' | 'Charger Hardware' | 'Grid & Energy' | 'Software & API';
  region: string;
  flag: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  highlight: string;
  logoUrl: string;
  logoSymbol: string;
}

const PARTNER_BRANDS: PartnerBrand[] = [
  {
    id: 'tesla',
    name: 'Tesla Motors',
    category: 'EV Automaker',
    region: 'EU / Global',
    flag: '🇪🇺',
    accentColor: 'border-red-200 hover:border-red-400',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    highlight: 'CCS / NACS Supercharger Interoperability',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    logoSymbol: '⚡ TESLA'
  },
  {
    id: 'bmw',
    name: 'BMW Group',
    category: 'EV Automaker',
    region: 'Germany / EU',
    flag: '🇩🇪',
    accentColor: 'border-blue-200 hover:border-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    highlight: 'Official i-Series Fleet & Charging Integration',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    logoSymbol: '🚙 BMW i'
  },
  {
    id: 'hyundai',
    name: 'Hyundai EV',
    category: 'EV Automaker',
    region: 'EU Region',
    flag: '🇪🇺',
    accentColor: 'border-cyan-200 hover:border-cyan-400',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    highlight: '800V Ultra-Fast Charging Ecosystem',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg',
    logoSymbol: '🏎️ HYUNDAI'
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen ID.',
    category: 'EV Automaker',
    region: 'Germany / EU',
    flag: '🇩🇪',
    accentColor: 'border-indigo-200 hover:border-indigo-400',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    highlight: 'MEB Platform Fleet & Plug&Charge Sync',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
    logoSymbol: '🚗 VW ID.'
  },
  {
    id: 'esb',
    name: 'ESB ecars',
    category: 'Grid & Energy',
    region: 'Ireland',
    flag: '🇮🇪',
    accentColor: 'border-emerald-200 hover:border-emerald-400',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    highlight: 'Ireland National Substation Grid Interconnect',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/ESB_Group_logo.svg/512px-ESB_Group_logo.svg.png',
    logoSymbol: '🇮🇪 ESB ecars'
  },
  {
    id: 'kempower',
    name: 'Kempower',
    category: 'Charger Hardware',
    region: 'Finland / EU',
    flag: '🇫🇮',
    accentColor: 'border-teal-200 hover:border-teal-400',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    highlight: 'Dynamic Power-Allocation DC Cabinets',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Kempower_logo.svg/512px-Kempower_logo.svg.png',
    logoSymbol: '🔌 KEMPOWER'
  },
  {
    id: 'abb',
    name: 'ABB E-mobility',
    category: 'Charger Hardware',
    region: 'Switzerland / EU',
    flag: '🇨🇭',
    accentColor: 'border-amber-200 hover:border-amber-400',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    highlight: '350 kW Heavy-Duty High-Power Charging',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/ABB_logo.svg',
    logoSymbol: '⚡ ABB EV'
  },
  {
    id: 'tritium',
    name: 'Tritium DC',
    category: 'Charger Hardware',
    region: 'Australia / EU',
    flag: '🇪🇺',
    accentColor: 'border-orange-200 hover:border-orange-400',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    highlight: 'PKM Liquid-Cooled Modular Ultra-Fast Hubs',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Tritium_Logo.svg/512px-Tritium_Logo.svg.png',
    logoSymbol: '🔋 TRITIUM'
  },
  {
    id: 'smartcar',
    name: 'Smartcar API',
    category: 'Software & API',
    region: 'USA / EU',
    flag: '🇺🇸',
    accentColor: 'border-emerald-200 hover:border-emerald-400',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    highlight: 'Live Vehicle Telemetry & SoC Sync API',
    logoUrl: 'https://smartcar.com/assets/smartcar-logo.svg',
    logoSymbol: '📲 SMARTCAR'
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    category: 'Grid & Energy',
    region: 'France / EU',
    flag: '🇫🇷',
    accentColor: 'border-green-200 hover:border-green-400',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-700',
    highlight: 'Smart Solar Microgrid & Dynamic Load Control',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_2007.svg',
    logoSymbol: '🌱 SCHNEIDER'
  },
  {
    id: 'chargepoint',
    name: 'ChargePoint EU',
    category: 'Software & API',
    region: 'EU Region',
    flag: '🇪🇺',
    accentColor: 'border-sky-200 hover:border-sky-400',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    highlight: 'Cross-Border OCPI Roaming Interoperability',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/ChargePoint_logo.svg',
    logoSymbol: '🌐 CHARGEPOINT'
  },
  {
    id: 'nissan',
    name: 'Nissan Energy',
    category: 'EV Automaker',
    region: 'Japan / EU',
    flag: '🇯🇵',
    accentColor: 'border-rose-200 hover:border-rose-400',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    highlight: 'Vehicle-to-Grid (V2G) Bi-Directional Charging',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Nissan_2020_logo.svg',
    logoSymbol: '🚘 NISSAN EV'
  }
];

const AboutUs: React.FC = () => {
  // Manual Slider Controls State
  const [partnerIndex, setPartnerIndex] = useState<number>(0);
  const [cardsPerView, setCardsPerView] = useState<number>(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxPartnerIndex = Math.max(0, PARTNER_BRANDS.length - cardsPerView);

  const nextPartners = useCallback(() => {
    setPartnerIndex((prev) => (prev >= maxPartnerIndex ? 0 : prev + 1));
  }, [maxPartnerIndex]);

  const prevPartners = useCallback(() => {
    setPartnerIndex((prev) => (prev <= 0 ? maxPartnerIndex : prev - 1));
  }, [maxPartnerIndex]);

  return (
    <div 
      className="min-h-screen text-slate-900 font-sans pt-16 sm:pt-20 pb-16 selection:bg-emerald-100 selection:text-emerald-900 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Light semi-transparent overlay to ensure text legibility over background image */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-xs z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 space-y-16">
        
        {/* ================= 1. HERO MISSION HEADER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-200/80 pb-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/90 px-3.5 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
              <FaGlobeEurope className="text-emerald-600" />
              <span>Our Mission & Vision</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Powering Ireland's Next-Generation EV Infrastructure
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Charge-UP was founded with a singular purpose: to make electric vehicle charging faster, cleaner, and completely effortless across Ireland. We connect drivers, fleet operators, and businesses with 100% renewable energy hubs.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/locations"
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>Find Charging Hubs</span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                to="/contact"
                className="bg-white/90 hover:bg-white text-slate-800 border border-slate-200 font-bold px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 text-sm sm:text-base cursor-pointer"
              >
                Partner With Us
              </Link>
            </div>
          </div>

          {/* Quick Impact Highlight Matrix */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-3">
                <FaChargingStation />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">250+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Rapid Charging Points</div>
            </div>

            <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-lg mb-3">
                <FaShieldAlt />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">99.9%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Network Uptime</div>
            </div>

            <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-3">
                <FaLeaf />
              </div>
              <div className="text-3xl font-black text-emerald-600 tracking-tight">100%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Green Renewable Energy</div>
            </div>

            <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-lg mb-3">
                <FaUsers />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">18,500+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active EV Drivers</div>
            </div>
          </div>
        </div>

        {/* ================= 2. CORE PILLARS ================= */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Why Charge-UP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built On Four Uncompromising Pillars
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              We operate Ireland's cleanest and most dependable ultra-fast charging corridor network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white/95 border border-slate-200 p-6 rounded-3xl shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl font-bold">
                <FaBolt />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Ultra-Fast 350 kW Speeds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-power DC fast chargers capable of adding up to 300 km of range in under 15 minutes for modern electric vehicles.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/95 border border-slate-200 p-6 rounded-3xl shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl font-bold">
                <FaLeaf />
              </div>
              <h3 className="text-lg font-bold text-slate-900">100% Certified Green Power</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every kilowatt-hour delivered through Charge-UP hubs is backed by origin guarantees from Irish wind and solar farms.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/95 border border-slate-200 p-6 rounded-3xl shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl font-bold">
                <FaShieldAlt />
              </div>
              <h3 className="text-lg font-bold text-slate-900">99.9% Reliable Uptime</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cloud-managed hardware telemetry detects and resolves potential connector faults before you even pull up to charge.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white/95 border border-slate-200 p-6 rounded-3xl shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl font-bold">
                <FaAward />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smartcar Telemetry Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time vehicle battery state sync, charge limit management, and contactless automatic session starting.
              </p>
            </div>
          </div>
        </div>

        {/* ================= 3. OUR PARTNERSHIPS WITH (SLIDER & MARQUEE UI) ================= */}
        <div className="space-y-8 bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-md border border-emerald-200 mb-2">
                <FaHandshake className="text-emerald-600" />
                <span>OUR PARTNERSHIPS WITH</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Collaborating With Industry Pioneers
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                We partner with world-class EV automakers, charging hardware engineers, grid utilities, and software networks across Ireland and Europe.
              </p>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={prevPartners}
                aria-label="Previous Partners"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white border border-slate-200 flex items-center justify-center text-slate-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={nextPartners}
                aria-label="Next Partners"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white border border-slate-200 flex items-center justify-center text-slate-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>

          {/* Interactive Responsive Slider Track */}
          <div className="overflow-hidden rounded-2xl py-2">
            <div 
              className="flex transition-transform duration-500 ease-out gap-5"
              style={{
                transform: `translateX(-${partnerIndex * (100 / cardsPerView + (cardsPerView === 1 ? 0 : 1))}%)`
              }}
            >
              {PARTNER_BRANDS.map((partner) => (
                <div
                  key={partner.id}
                  style={{ flex: `0 0 calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 20 / cardsPerView}px)` }}
                  className={`bg-white border p-5 rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer ${partner.accentColor}`}
                >
                  <div>
                    {/* Top Row: Category Badge & Region Flag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${partner.badgeBg} ${partner.badgeText}`}>
                        {partner.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {partner.flag} {partner.region}
                      </span>
                    </div>

                    {/* Authentic Brand Company Logo Image Container */}
                    <div className="my-3 py-3.5 px-4 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-center h-16 group-hover:bg-white group-hover:border-emerald-200 transition-all shadow-2xs">
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name}
                        loading="lazy"
                        className="h-8 max-w-[130px] object-contain group-hover:scale-105 transition-all duration-300"
                        onError={(e) => {
                          // Fallback to stylized logo text badge if image fails to load
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'block';
                          }
                        }}
                      />
                      <span className="hidden font-black text-xs text-slate-800 tracking-wider">
                        {partner.logoSymbol}
                      </span>
                    </div>

                    {/* Brand Name */}
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition-colors mt-2">
                      {partner.name}
                    </h3>

                    {/* Partnership Highlight */}
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                      {partner.highlight}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
                    <span className="flex items-center gap-1">
                      <FaCheckCircle className="text-emerald-500 text-xs" /> Official Partner
                    </span>
                    <span className="text-slate-400 group-hover:text-emerald-600 transition-colors">➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webflow Style Continuous Auto-Scrolling Marquee Strip */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 overflow-hidden relative">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-600 text-center mb-4">
              Continuous Partner Ecosystem
            </div>
            
            <div className="overflow-hidden w-full relative py-2">
              <div className="animate-marquee flex gap-6 items-center">
                {[...PARTNER_BRANDS, ...PARTNER_BRANDS].map((partner, idx) => (
                  <div
                    key={`${partner.id}-marquee-${idx}`}
                    className="bg-white border border-slate-200 hover:border-emerald-400 px-5 py-3 rounded-2xl shadow-2xs flex items-center gap-3 shrink-0 cursor-pointer hover:shadow-md transition-all group"
                  >
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name}
                      loading="lazy"
                      className="h-6 max-w-[85px] object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'inline-block';
                        }
                      }}
                    />
                    <span className="hidden font-bold text-xs text-slate-800 tracking-tight">
                      {partner.name}
                    </span>
                    <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                      {partner.name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                      {partner.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ================= 4. TEAM / VALUES ================= */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Our Leadership
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Driven By Clean Energy Pioneers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-3 shadow-xs">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelExecutive&eyes=default&mouth=smile&eyebrows=default"
                alt="CEO"
                className="w-20 h-20 rounded-full mx-auto bg-emerald-50 border-2 border-emerald-400 p-1"
              />
              <h3 className="font-extrabold text-slate-900 text-base">Ciarán Macarthy</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Chief Executive Officer</p>
              <p className="text-xs text-slate-500">Ex-Grid Infrastructure Engineer with 14+ years in clean energy deployment.</p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-3 shadow-xs">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=SarahExecutive&eyes=default&mouth=smile&eyebrows=default"
                alt="CTO"
                className="w-20 h-20 rounded-full mx-auto bg-emerald-50 border-2 border-emerald-400 p-1"
              />
              <h3 className="font-extrabold text-slate-900 text-base">Siobhán O'Reilly</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Chief Technology Officer</p>
              <p className="text-xs text-slate-500">Specialist in IoT telemetry, cloud scaling, and real-time station orchestration.</p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-3 shadow-xs">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=DavidExecutive&eyes=default&mouth=smile&eyebrows=default"
                alt="Head of Operations"
                className="w-20 h-20 rounded-full mx-auto bg-emerald-50 border-2 border-emerald-400 p-1"
              />
              <h3 className="font-extrabold text-slate-900 text-base">Liam Gallagher</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Head of Operations</p>
              <p className="text-xs text-slate-500">Overseeing physical site expansion, CPO partnerships, and 24/7 maintenance.</p>
            </div>
          </div>
        </div>

        {/* ================= 5. FOOTER CALL TO ACTION ================= */}
        <div className="bg-gradient-to-r from-emerald-600 via-[#00b976] to-teal-600 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Charge With Charge-UP?
            </h2>
            <p className="text-emerald-100 text-sm max-w-xl font-medium">
              Join thousands of drivers across Ireland. Download the app or locate your nearest ultra-fast station today.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/signup"
              className="bg-white text-slate-900 font-extrabold px-6 py-3 rounded-xl shadow-md hover:bg-slate-100 transition-all text-sm cursor-pointer"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="bg-emerald-800/40 hover:bg-emerald-800/60 text-white font-extrabold border border-white/20 px-6 py-3 rounded-xl transition-all text-sm cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
