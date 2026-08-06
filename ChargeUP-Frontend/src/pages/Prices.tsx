// src/pages/Pricing.tsx
import React from 'react';
// Adjust the filename and extension below to match your asset file exactly
import backgroundImage from '../assets/Prices.png';

interface PricePlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  buttonText: string;
}

const Pricing: React.FC = () => {
  const plans: PricePlan[] = [
    {
      name: "Pay As You Go",
      price: "$0",
      period: "/month",
      description: "Perfect for occasional EV drivers who just need a reliable backup charger.",
      features: [
        "Access to all 15,000+ public networks",
        "Standard charging rates per kWh",
        "Real-time station status updates",
        "Basic app customer support"
      ],
      isPopular: false,
      buttonText: "Get Started"
    },
    {
      name: "Charge Plus",
      price: "$9.99",
      period: "/month",
      description: "Designed for daily commuters looking to minimize charging costs.",
      features: [
        "15% discount on all public DC fast charging",
        "Advanced reservation window (up to 2 hours)",
        "Priority charging queue access",
        "24/7 Premium customer support",
        "Quarterly vehicle battery health reports"
      ],
      isPopular: true,
      buttonText: "Upgrade to Plus"
    },
    {
      name: "Fleet Pro",
      price: "$49.99",
      period: "/month per vehicle",
      description: "Custom management controls tailored for commercial delivery & logistics fleets.",
      features: [
        "Maximum discounted commercial kWh rates",
        "Automated multi-vehicle booking dashboard",
        "Monthly unified tax & expense reporting",
        "API access for fleet telematics software",
        "Dedicated account operations manager"
      ],
      isPopular: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <div 
      className="min-h-screen text-slate-900 font-sans pt-16 sm:pt-18 pb-12 selection:bg-emerald-100 selection:text-emerald-900 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Light semi-transparent overlay to ensure text remains clearly legible over the image */}
      <div className="absolute inset-0 bg-slate-50/85 z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100/80 px-3 py-1 rounded-md border border-emerald-200">
            Plans & Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mt-4 mb-6">
            Transparent pricing for every journey.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed font-normal">
            Choose a plan that fits your driving habits. No hidden transaction fees, cancel or change configurations at any time.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white/95 backdrop-blur-xs border rounded-3xl p-8 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 ${
                plan.isPopular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                {/* Plan Header */}
                <h3 className="text-xl font-bold text-slate-990 tracking-tight mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-6 font-normal min-h-[40px]">{plan.description}</p>
                
                {/* Price Label */}
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                  <span className="text-slate-400 text-sm font-medium ml-1">{plan.period}</span>
                </div>

                {/* Divider Line */}
                <div className="border-t border-slate-100 my-6" />

                {/* Features Checklist */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm sm:text-[15px] text-slate-600">
                      <span className="text-emerald-500 font-bold mr-3 shrink-0 select-none">✓</span>
                      <span className="font-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button 
                className={`w-full h-12 font-bold rounded-xl transition-all text-sm tracking-wide cursor-pointer ${
                  plan.isPopular 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Pricing;