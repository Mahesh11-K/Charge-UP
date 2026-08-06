// src/components/BrandTrusted.tsx
import React, { useState, useMemo } from 'react';
import {
  SiTesla,
  SiBmw,
  SiPorsche,
  SiAudi,
  SiFord,
  SiHyundai,
  SiKia,
  SiVolvo,
  SiVolkswagen,
  SiLucid
} from 'react-icons/si';
import { 
  FaPlug, 
  FaShieldHalved, 
  FaCheck, 
  FaChevronRight, 
  FaXmark,
  FaGaugeHigh,
  FaMicrochip
} from 'react-icons/fa6';

export interface CarBrandItem {
  id: string;
  name: string;
  category: 'nacs' | 'fast800v' | 'luxury' | 'popular';
  categoryLabel: string;
  icon: React.ReactNode;
  brandColor: string;
  badge: string;
  badgeBg: string;
  maxSpeed: string;
  avgChargeTime: string;
  chargingStandard: string;
  connectorType: string;
  supportedModels: string[];
  autochargeReady: boolean;
  description: string;
  recommendedKw: string;
}

// Custom crisp SVG for Mercedes-Benz
const MercedesIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zm0 2.2a.75.75 0 0 1 .73.575l1.62 6.48 6.353 1.954a.75.75 0 0 1-.225 1.442l-6.528-.43-3.95 5.267a.75.75 0 0 1-1.2 0l-3.95-5.267-6.528.43a.75.75 0 0 1-.225-1.442l6.353-1.954 1.62-6.48A.75.75 0 0 1 12 5.7z"/>
  </svg>
);

// Custom crisp SVG for Rivian
const RivianIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.5 3.6-6.5 3.6-6.5-3.6L12 4.3zM5 9.1l6 3.3v6.6l-6-3.3V9.1zm14 6.6l-6 3.3v-6.6l6-3.3v6.6z"/>
  </svg>
);

// 12 POPULAR & ICONIC GLOBAL EV CAR BRANDS
const CAR_BRANDS: CarBrandItem[] = [
  {
    id: 'tesla',
    name: 'Tesla',
    category: 'nacs',
    categoryLabel: 'NACS Native',
    icon: <SiTesla className="w-8 h-8" />,
    brandColor: 'text-red-500',
    badge: 'NACS Native',
    badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    maxSpeed: '250 - 350 kW',
    avgChargeTime: '15 - 20 min',
    chargingStandard: 'NACS (Supercharger v3/v4 compatible)',
    connectorType: 'NACS / Tesla Direct',
    supportedModels: ['Model Y', 'Model 3', 'Model S', 'Model X', 'Cybertruck'],
    autochargeReady: true,
    recommendedKw: '250kW DC Fast',
    description: 'Full automated handshake and NACS native plug-and-charge compatibility on all ChargeUP stations.'
  },
  {
    id: 'porsche',
    name: 'Porsche',
    category: 'fast800v',
    categoryLabel: '800V Ultra-Fast',
    icon: <SiPorsche className="w-9 h-9" />,
    brandColor: 'text-amber-500',
    badge: '800V Tech',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    maxSpeed: '320 kW',
    avgChargeTime: '18 min',
    chargingStandard: 'CCS Combo 1 / NACS Adapter',
    connectorType: 'CCS Combo & NACS',
    supportedModels: ['Taycan', 'Taycan Cross Turismo', 'Macan Electric'],
    autochargeReady: true,
    recommendedKw: '350kW High Voltage',
    description: 'High-voltage 800V architecture capable of taking full advantage of ChargeUP 350kW liquid-cooled dispensers.'
  },
  {
    id: 'bmw',
    name: 'BMW i',
    category: 'luxury',
    categoryLabel: 'Luxury & Sport',
    icon: <SiBmw className="w-8 h-8" />,
    brandColor: 'text-sky-500',
    badge: 'Plug & Charge',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    maxSpeed: '205 kW',
    avgChargeTime: '26 min',
    chargingStandard: 'CCS Combo / ISO 15118',
    connectorType: 'CCS Combo & NACS Adapter',
    supportedModels: ['i4 Gran Coupe', 'i7 Sedan', 'iX SUV', 'i5 Sedan'],
    autochargeReady: true,
    recommendedKw: '200kW DC',
    description: 'Integrated ISO 15118 Plug & Charge protocol support with automatic billing for BMW accounts.'
  },
  {
    id: 'mercedes',
    name: 'Mercedes-EQ',
    category: 'luxury',
    categoryLabel: 'Luxury & Sport',
    icon: <MercedesIcon className="w-8 h-8" />,
    brandColor: 'text-slate-800 dark:text-slate-200',
    badge: 'Luxury EV',
    badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    maxSpeed: '200 kW',
    avgChargeTime: '30 min',
    chargingStandard: 'CCS Combo / NACS Ready',
    connectorType: 'CCS & NACS Adapter',
    supportedModels: ['EQS Sedan', 'EQE SUV', 'EQB Compact', 'G 580 EV'],
    autochargeReady: true,
    recommendedKw: '200kW DC',
    description: 'Automatic Mercedes me Charge roaming handshake for frictionless charging.'
  },
  {
    id: 'audi',
    name: 'Audi e-tron',
    category: 'fast800v',
    categoryLabel: '800V Ultra-Fast',
    icon: <SiAudi className="w-9 h-9" />,
    brandColor: 'text-indigo-600 dark:text-indigo-400',
    badge: '800V Tech',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    maxSpeed: '270 kW',
    avgChargeTime: '21 min',
    chargingStandard: 'CCS Combo / NACS Ready',
    connectorType: 'CCS Combo 1 & 2',
    supportedModels: ['e-tron GT', 'RS e-tron GT', 'Q4 e-tron', 'Q8 e-tron'],
    autochargeReady: true,
    recommendedKw: '300kW Ultra',
    description: 'Flat charging curve compatibility up to 270kW for rapid long-distance highway top-ups.'
  },
  {
    id: 'ford',
    name: 'Ford EV',
    category: 'popular',
    categoryLabel: 'Mass Market',
    icon: <SiFord className="w-9 h-9" />,
    brandColor: 'text-blue-600',
    badge: 'BlueOval',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    maxSpeed: '150 - 200 kW',
    avgChargeTime: '30 min',
    chargingStandard: 'NACS / CCS Combo 1',
    connectorType: 'NACS & CCS Combo',
    supportedModels: ['Mustang Mach-E', 'F-150 Lightning', 'E-Transit'],
    autochargeReady: true,
    recommendedKw: '150kW DC Fast',
    description: 'Seamless integration with FordPass app and automatic charger reservation via ChargeUP API.'
  },
  {
    id: 'hyundai',
    name: 'Hyundai EV',
    category: 'fast800v',
    categoryLabel: '800V Ultra-Fast',
    icon: <SiHyundai className="w-8 h-8" />,
    brandColor: 'text-cyan-500',
    badge: 'E-GMP 800V',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    maxSpeed: '240 kW',
    avgChargeTime: '18 min',
    chargingStandard: 'CCS Combo / NACS Ready',
    connectorType: 'CCS Combo & NACS',
    supportedModels: ['IONIQ 5', 'IONIQ 6', 'IONIQ 9', 'Kona EV'],
    autochargeReady: true,
    recommendedKw: '350kW DC',
    description: '18-minute 10-to-80% rapid charging capability verified on E-GMP 800V vehicle hardware.'
  },
  {
    id: 'kia',
    name: 'Kia EV',
    category: 'fast800v',
    categoryLabel: '800V Ultra-Fast',
    icon: <SiKia className="w-8 h-8" />,
    brandColor: 'text-purple-500',
    badge: 'E-GMP 800V',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    maxSpeed: '240 kW',
    avgChargeTime: '18 min',
    chargingStandard: 'CCS Combo / NACS Ready',
    connectorType: 'CCS Combo & NACS',
    supportedModels: ['EV6', 'EV6 GT', 'EV9 SUV', 'EV3'],
    autochargeReady: true,
    recommendedKw: '350kW DC',
    description: 'Ultra-fast battery pre-conditioning support synced automatically via ChargeUP station routing.'
  },
  {
    id: 'rivian',
    name: 'Rivian',
    category: 'luxury',
    categoryLabel: 'Luxury & Sport',
    icon: <RivianIcon className="w-8 h-8" />,
    brandColor: 'text-emerald-500',
    badge: 'Adventure EV',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    maxSpeed: '220 kW',
    avgChargeTime: '25 min',
    chargingStandard: 'NACS / CCS Combo 1',
    connectorType: 'NACS & CCS',
    supportedModels: ['R1T Truck', 'R1S SUV', 'R2 SUV', 'R3X Crossover'],
    autochargeReady: true,
    recommendedKw: '250kW DC',
    description: 'Native NACS port compatibility and automated charge session initiation for Rivian owners.'
  },
  {
    id: 'lucid',
    name: 'Lucid',
    category: 'fast800v',
    categoryLabel: '800V Ultra-Fast',
    icon: <SiLucid className="w-8 h-8" />,
    brandColor: 'text-teal-500',
    badge: '900V Tech',
    badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    maxSpeed: '300+ kW',
    avgChargeTime: '15 min',
    chargingStandard: 'CCS Combo / NACS',
    connectorType: 'CCS Combo & NACS',
    supportedModels: ['Lucid Air Pure', 'Lucid Air Grand Touring', 'Gravity SUV'],
    autochargeReady: true,
    recommendedKw: '350kW Ultra',
    description: 'Industry-leading 900V charging efficiency delivering up to 200 miles of range in 12 minutes.'
  },
  {
    id: 'volvo',
    name: 'Volvo',
    category: 'luxury',
    categoryLabel: 'Luxury & Sport',
    icon: <SiVolvo className="w-8 h-8" />,
    brandColor: 'text-sky-600',
    badge: 'Safety EV',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    maxSpeed: '200 kW',
    avgChargeTime: '26 min',
    chargingStandard: 'CCS Combo 1 / NACS',
    connectorType: 'CCS & NACS',
    supportedModels: ['EX30 Compact', 'EX90 Flagship', 'XC40 Recharge'],
    autochargeReady: true,
    recommendedKw: '175kW DC',
    description: 'Advanced thermal health safety protocols during rapid charging sessions.'
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    category: 'popular',
    categoryLabel: 'Mass Market',
    icon: <SiVolkswagen className="w-8 h-8" />,
    brandColor: 'text-blue-700 dark:text-blue-400',
    badge: 'MEB Platform',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    maxSpeed: '175 kW',
    avgChargeTime: '29 min',
    chargingStandard: 'CCS Combo / NACS Ready',
    connectorType: 'CCS & NACS',
    supportedModels: ['ID.4', 'ID.7 Sedan', 'ID. Buzz Electric Bus'],
    autochargeReady: true,
    recommendedKw: '150kW DC',
    description: 'Full compatibility with VW We Charge ecosystem and ChargeUP roaming network.'
  }
];

export const BrandTrusted: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<CarBrandItem | null>(null);

  // Split 12 brands into 2 clean equal rows (6 per row)
  const row1Brands = useMemo(() => {
    const half = Math.ceil(CAR_BRANDS.length / 2);
    return CAR_BRANDS.slice(0, half);
  }, []);

  const row2Brands = useMemo(() => {
    const half = Math.ceil(CAR_BRANDS.length / 2);
    return CAR_BRANDS.slice(half);
  }, []);

  // Duplicate 3x for seamless infinite marquee loop
  const row1Duplicated = useMemo(() => [...row1Brands, ...row1Brands, ...row1Brands], [row1Brands]);
  const row2Duplicated = useMemo(() => [...row2Brands, ...row2Brands, ...row2Brands], [row2Brands]);

  // Helper for speed classes
  const getMarqueeClass = (direction: 'forward' | 'reverse') => {
    return direction === 'forward' ? 'animate-marquee' : 'animate-marquee-reverse';
  };

  return (
    <section 
      id="brandTrusted"
      className="relative py-16 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/80 dark:border-slate-800/60 overflow-hidden transition-colors duration-300"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-3 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider uppercase text-[10px]">Universal OEM Compatibility</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Compatible With All <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Top EV Manufacturers
            </span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Plug-and-charge interoperability supporting NACS, CCS, & 800V ultra-fast charging across 12 leading electric vehicle brands.
          </p>
        </div>

      </div>

      {/* AUTOMATIC CONTINUOUS MARQUEE SLIDERS (12 POPULAR BRANDS) */}
      <div className="relative w-full py-2 space-y-4">
        
        {/* Left & Right Smooth Overlay Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-linear-to-r from-slate-50 dark:from-slate-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-linear-to-l from-slate-50 dark:from-slate-950 to-transparent z-20 pointer-events-none" />

        {/* ROW 1: Auto-Slides Left */}
        <div className="overflow-hidden w-full flex">
          <div className={`${getMarqueeClass('forward')} gap-4 px-4`}>
            {row1Duplicated.map((brand, idx) => (
              <div
                key={`r1-${brand.id}-${idx}`}
                onClick={() => setSelectedBrand(brand)}
                className="group relative flex-shrink-0 flex items-center gap-3.5 bg-white dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl px-5 py-3.5 shadow-xs hover:shadow-lg hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 min-w-[200px]"
              >
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 ${brand.brandColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  {brand.icon}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span>{brand.name}</span>
                    <FaChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-500" />
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase mt-0.5">
                    {brand.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Auto-Slides Right */}
        <div className="overflow-hidden w-full flex">
          <div className={`${getMarqueeClass('reverse')} gap-4 px-4`}>
            {row2Duplicated.map((brand, idx) => (
              <div
                key={`r2-${brand.id}-${idx}`}
                onClick={() => setSelectedBrand(brand)}
                className="group relative flex-shrink-0 flex items-center gap-3.5 bg-white dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl px-5 py-3.5 shadow-xs hover:shadow-lg hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 min-w-[200px]"
              >
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 ${brand.brandColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  {brand.icon}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span>{brand.name}</span>
                    <FaChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-500" />
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase mt-0.5">
                    {brand.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* COMPACT TRUST STATS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-left">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <FaPlug className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Dual NACS & CCS</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Native cables & adapters at every stall</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <FaMicrochip className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">ISO 15118 Autocharge</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Digital handshake in under 3 seconds</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <FaGaugeHigh className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Liquid-Cooled 350kW</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Optimized for 400V & 800V architecture</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <FaShieldHalved className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">100% OEM Battery Safe</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">AI dynamic voltage & thermal control</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BRAND MODAL */}
      {selectedBrand && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedBrand(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 ${selectedBrand.brandColor}`}>
                  {selectedBrand.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedBrand.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${selectedBrand.badgeBg}`}>
                      {selectedBrand.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {selectedBrand.categoryLabel}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBrand(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {selectedBrand.description}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Max Speed</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">{selectedBrand.maxSpeed}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">10-80% Charge</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white block">{selectedBrand.avgChargeTime}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Connector</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{selectedBrand.connectorType}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Autocharge</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FaCheck className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Recommended: <strong className="text-slate-800 dark:text-slate-200">{selectedBrand.recommendedKw}</strong>
              </span>
              <button
                onClick={() => setSelectedBrand(null)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-emerald-600/20"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default BrandTrusted;
