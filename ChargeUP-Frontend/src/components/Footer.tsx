// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-50/70 text-slate-600 py-16 px-4 sm:px-6 lg:px-8 border-t border-emerald-100/80 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-16">
          
          {/* Brand Identity Block */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                ⚡
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Charge<span className="text-emerald-600">-UP</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-normal max-w-xs">
              The country's most reliable EV charging network. Built for drivers, fleets, and the future.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1: Services */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">Services</h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><Link to="/locations" className="hover:text-emerald-600 transition-colors">Find a Station</Link></li>
                <li><Link to="/hospitality" className="hover:text-emerald-600 transition-colors font-bold text-emerald-700">Retail & Hospitality</Link></li>
                <li><Link to="/home-charging" className="hover:text-emerald-600 transition-colors">Home Charging</Link></li>
                <li><Link to="/products" className="hover:text-emerald-600 transition-colors">Fleet Charging</Link></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">Company</h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Careers</Link></li>
                <li><Link to="/reviews" className="hover:text-emerald-600 transition-colors">Press</Link></li>
                <li><Link to="/prices" className="hover:text-emerald-600 transition-colors">Investors</Link></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">Support</h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact Us</Link></li>
                <li><Link to="/dashboard" className="hover:text-emerald-600 transition-colors">Status Page</Link></li>
                <li><Link to="/dashboard" className="hover:text-emerald-600 transition-colors">App Download</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Charge-UP Charging Inc. All rights reserved.
          </div>
          
          {/* Social Icons Row with Authentic Brand Colors on Hover */}
          <div className="flex items-center gap-3 text-slate-600">
            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 hover:shadow-lg hover:shadow-[#E4405F]/25" 
              aria-label="Instagram"
              title="Follow us on Instagram"
            >
              <FaInstagram className="text-base" />
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/25" 
              aria-label="YouTube"
              title="Subscribe on YouTube"
            >
              <FaYoutube className="text-base" />
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/25" 
              aria-label="Facebook"
              title="Follow us on Facebook"
            >
              <FaFacebookF className="text-sm" />
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 hover:shadow-lg hover:shadow-[#0A66C2]/25" 
              aria-label="LinkedIn"
              title="Connect on LinkedIn"
            >
              <FaLinkedinIn className="text-sm" />
            </a>

            {/* Twitter X */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 hover:shadow-lg hover:shadow-slate-900/25" 
              aria-label="Twitter X"
              title="Follow us on Twitter X"
            >
              <FaTwitter className="text-sm" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;