// src/pages/Contact.tsx
import React, { useState } from 'react';
// Adjust the filename and extension below to match your asset file exactly
import backgroundImage from '../assets/ContactBg.png';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Add form processing logic here
  };

  return (
    <div 
      className="min-h-screen text-slate-900 font-sans pt-16 sm:pt-18 pb-12 selection:bg-emerald-100 selection:text-emerald-900 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Light semi-transparent overlay to ensure text remains clearly legible over the image */}
      <div className="absolute inset-0 bg-white/80 z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* ================= LEFT COLUMN: INFO ================= */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-3">
                Contact
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                Let's talk charging.
              </h1>
              <p className="text-slate-600 text-base leading-relaxed font-normal">
                Sales inquiries, fleet pricing, partnership opportunities — or just a question about connectors. We respond within one business day.
              </p>
            </div>

            {/* Direct Contact Metadata Rows */}
            <div className="space-y-6 pt-4">
              {/* Phone Row */}
              <div className="flex items-start gap-4">
                <div className="text-xl text-slate-400 mt-1">📞</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Phone</h4>
                  <p className="text-slate-800 font-medium mt-0.5">+353 (800) 868-5832</p>
                </div>
              </div>

              {/* Email Row */}
              <div className="flex items-start gap-4">
                <div className="text-xl text-slate-400 mt-1">✉️</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Email</h4>
                  <p className="text-slate-800 font-medium mt-0.5">hello@chargeup.io</p>
                </div>
              </div>

              {/* HQ Row */}
              <div className="flex items-start gap-4">
                <div className="text-xl text-slate-400 mt-1">📍</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">HQ</h4>
                  <p className="text-slate-800 font-medium mt-0.5">Dublin, Ireland - D02-9876</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-xs"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-xs"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us what you need..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none shadow-xs"
                />
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-md shadow-emerald-600/10 text-[15px] flex items-center justify-center gap-2 cursor-pointer"
              >
                Send Message &rarr;
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;