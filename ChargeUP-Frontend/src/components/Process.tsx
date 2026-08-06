// src/components/Process.tsx
import React from 'react';
import backgroundVideo from '../assets/ProcessBg.mp4';

const Process: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Find a station",
      description: "Open the app, locate nearby chargers, and filter by speed or connector type."
    },
    {
      number: "02",
      title: "Reserve & Arrive",
      description: "Book a charger in advance to guarantee availability and navigate effortlessly."
    },
    {
      number: "03",
      title: "Plug in & Charge",
      description: "Drive up, plug in, and monitor charging speed or battery status from anywhere."
    }
  ];

  return (
    <section id="process" className="relative py-28 text-slate-900 font-sans overflow-hidden">
      {/* Background Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Light semi-transparent overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-slate-100/70 z-10" />
      
      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        
        {/* Section Heading & Badge */}
        <div className="mb-16">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100/90 border border-emerald-200/80 px-3 py-1 rounded-md">
            PROCESS
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4 text-slate-900">
            Charging in three steps.
          </h2>
        </div>

        {/* 3 Steps Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="space-y-3">
              
              {/* Step Number */}
              <div className="text-4xl sm:text-5xl font-black text-emerald-500 tracking-tight">
                {step.number}
              </div>

              {/* Step Title */}
              <h3 className="text-lg font-bold text-slate-900 tracking-tight pt-1">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal max-w-sm">
                {step.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Process;