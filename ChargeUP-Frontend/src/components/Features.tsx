// src/components/Features.tsx
import React from 'react';

interface FeatureCardProps {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, iconBg, title, description }) => (
  <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center text-xl mb-6 shadow-2xs group-hover:scale-105 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed font-normal">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const featuresData = [
    {
      icon: "📍",
      iconBg: "bg-sky-50 text-sky-600 border border-sky-200",
      title: "Real-Time Tracking",
      description: "Live availability, charging speeds, and connector type navigation right in the app."
    },
    {
      icon: "⚡",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      title: "Ultra-Fast Charging",
      description: "High-performance 150kW-350kW DC fast charging speed for rapid energy delivery."
    },
    {
      icon: "💳",
      iconBg: "bg-teal-50 text-teal-600 border border-teal-200",
      title: "One-Click Payment",
      description: "Tap & pay effortlessly via RFID card or seamless contactless in-app billing."
    }
  ];

  return (
    <section id="features" className="py-20 bg-linear-to-br from-sky-50/50 via-slate-50 to-emerald-50/60 relative overflow-hidden">
      
      {/* Mixed Eco-Green & Ocean Blue Ambient Glows */}
      <div className="absolute top-[20%] left-[-5%] w-[380px] h-[380px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-sky-800 bg-sky-100/90 px-3.5 py-1 rounded-full border border-sky-200/80 shadow-2xs">
            Next-Gen Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mt-3">
            Everything you need for <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600">seamless transit</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-medium">
            Next-gen EV charging infrastructure powered by clean energy for seamless, reliable, and sustainable mobility.
          </p>
        </div>

        {/* 3 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;