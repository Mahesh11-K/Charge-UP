// src/components/Operations.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type TabType = 'drivers' | 'commercial' | 'fleets';

interface CardData {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  linkText: string;
}

interface TabContent {
  subHeadline: string;
  cards: CardData[];
}

const WhatWeOffer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('drivers');

  const contentData: Record<TabType, TabContent> = {
    drivers: {
      subHeadline: "Charge where you live, drive, and explore.",
      cards: [
        {
          icon: "📍",
          iconBg: "bg-sky-50 text-sky-600 border border-sky-200",
          title: "Public Charging",
          description: "Find EV chargers instantly, view live status, start charging in seconds, and pay with ease through the Charge-UP App.",
          linkText: "Explore"
        },
        {
          icon: "🏠",
          iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
          title: "Home Charging",
          description: "Smart home EV chargers available in 7.4 kW and 22 kW models for convenient, safe charging at home or work.",
          linkText: "Explore"
        },
        {
          icon: "🏬",
          iconBg: "bg-teal-50 text-teal-600 border border-teal-200",
          title: "Retail & Hospitality",
          description: "Turn customer dwell time into secondary revenue by offering EV charging at your hotel, cafe, mall, or venue.",
          linkText: "Explore"
        }
      ]
    },
    commercial: {
      subHeadline: "Electrify your commercial properties and retail hubs.",
      cards: [
        {
          icon: "🏢",
          iconBg: "bg-cyan-50 text-cyan-600 border border-cyan-200",
          title: "Commercial Spaces",
          description: "Attract premium EV drivers to your malls and retail hubs by hosting high-speed Charge-UP stations.",
          linkText: "Learn More"
        },
        {
          icon: "🏷️",
          iconBg: "bg-sky-50 text-sky-600 border border-sky-200",
          title: "White-Label Solutions",
          description: "Build your branded EV charging network powered seamlessly by our scalable cloud software.",
          linkText: "Learn More"
        },
        {
          icon: "⚡",
          iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
          title: "Revenue Share Model",
          description: "Earn passive income per kWh charged at your commercial site with full turn-key installation.",
          linkText: "Learn More"
        }
      ]
    },
    fleets: {
      subHeadline: "Keep your commercial fleets charged and operational 24/7.",
      cards: [
        {
          icon: "🚚",
          iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
          title: "Fleet Electrification",
          description: "Custom multi-port depot hubs and dynamic energy management systems engineered for commercial fleets.",
          linkText: "Partner with Us"
        },
        {
          icon: "💼",
          iconBg: "bg-sky-50 text-sky-600 border border-sky-200",
          title: "Depot Charging Hubs",
          description: "High-speed 150kW-350kW DC fast charging depots for rapid overnight fleet battery replenishment.",
          linkText: "Partner with Us"
        },
        {
          icon: "📊",
          iconBg: "bg-teal-50 text-teal-600 border border-teal-200",
          title: "Telematics & Billing",
          description: "Consolidated fleet billing, driver RFID authentication, and Smartcar real-time API integrations.",
          linkText: "Partner with Us"
        }
      ]
    }
  };

  const currentContent = contentData[activeTab];

  return (
    <section className="py-24 bg-linear-to-br from-emerald-50/50 via-slate-50 to-sky-50/60 text-slate-900 font-sans relative overflow-hidden">
      
      {/* Mixed Eco-Green & Ocean Blue Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-6">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
            Operational Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mt-3">
            What We <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600">Offer</span>
          </h2>
        </div>

        {/* Category Filter Tabs (Mixed Eco-Green & Ocean Blue Theme) */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-6">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'drivers'
                ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white/90 text-slate-700 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            For Drivers
          </button>
          
          <button
            onClick={() => setActiveTab('commercial')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'commercial'
                ? 'bg-linear-to-r from-teal-600 to-sky-600 text-white shadow-md shadow-sky-500/20'
                : 'bg-white/90 text-slate-700 border border-slate-200 hover:border-sky-300'
            }`}
          >
            For Commercial & Businesses
          </button>
          
          <button
            onClick={() => setActiveTab('fleets')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'fleets'
                ? 'bg-linear-to-r from-sky-600 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white/90 text-slate-700 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            For Fleets
          </button>
        </div>

        {/* Sub-Headline */}
        <p className="text-slate-600 text-sm sm:text-base mb-10 font-medium">
          {currentContent.subHeadline}
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentContent.cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-md border border-slate-200/80 p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl mb-6 shadow-2xs group-hover:scale-105 transition-transform`}>
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {card.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>
              </div>

              <div>
                <Link 
                  to={
                    card.title === "Home Charging" ? "/home-charging" :
                    card.title === "Retail & Hospitality" ? "/hospitality" :
                    "/locations"
                  } 
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-sky-600 transition-colors"
                >
                  <span>{card.linkText}</span>
                  <span className="transition-transform group-hover:translate-x-1">➔</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhatWeOffer;