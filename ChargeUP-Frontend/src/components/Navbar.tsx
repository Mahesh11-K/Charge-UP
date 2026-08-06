// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaRightFromBracket, FaBars } from 'react-icons/fa6';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleSidebarOpen, toggleSidebarCollapsed } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const userAvatar = user?.profile?.avatarUrl || user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChargeUser1&eyes=default&mouth=smile&eyebrows=default';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-slate-200/30 dark:border-slate-800/30 shadow-xs w-full overflow-visible transition-all duration-300">
      
      {/* 🔮 ELEGANT ECO-GREEN & OCEAN BLUE BOTTOM BORDER ACCENT BAR */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-linear-to-r from-emerald-500 via-teal-400 to-sky-500 opacity-80 shadow-xs shadow-emerald-500/20 pointer-events-none z-20" />

      {/* 🚗 3 Animated EV Highway Vehicles INSIDE Navbar Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Highway Lane Markings */}
        <div className="absolute inset-x-0 bottom-2 border-b border-dashed border-emerald-500/25 opacity-60" />
        <div className="absolute inset-x-0 top-2.5 border-b border-dashed border-cyan-500/20 opacity-40" />

        {/* Lane Charging Waypoints */}
        <div className="absolute left-[12%] bottom-1.5 flex items-center gap-1 text-[9px] font-bold text-emerald-500/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="absolute right-[22%] top-1.5 flex items-center gap-1 text-[9px] font-bold text-teal-500/80">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
        </div>

        {/* 🏎️ Animated EV 1: Fast Sport EV (Lower Lane) */}
        <div className="absolute bottom-1.5 animate-drive-fast flex items-center z-0 opacity-85">
          <div className="flex items-center gap-1 mr-1">
            <span className="text-[9px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/90 px-1.5 py-0.5 rounded-full border border-emerald-300/80 dark:border-emerald-700/80 shadow-2xs">
              ⚡ 100%
            </span>
            <span className="w-12 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 rounded-full shadow-xs shadow-emerald-400/50" />
          </div>
          <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] scale-x-[-1] inline-block">
            🏎️
          </span>
        </div>

        {/* 🚗 Animated EV 2: Smart EV Cruiser (Upper Lane) */}
        <div className="absolute top-1 animate-drive-top-fast flex items-center z-0 opacity-80">
          <div className="flex items-center gap-1 mr-1">
            <span className="text-[9px] font-black text-teal-800 dark:text-teal-300 bg-teal-100/90 dark:bg-teal-950/90 px-1.5 py-0.5 rounded-full border border-teal-300/80 dark:border-teal-700/80 shadow-2xs">
              🔋 95%
            </span>
            <span className="w-10 h-1 bg-gradient-to-r from-transparent via-teal-400 to-cyan-400 rounded-full shadow-xs shadow-teal-400/50" />
          </div>
          <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(20,184,166,0.7)] scale-x-[-1] inline-block">
            🚗
          </span>
        </div>

        {/* 🚙 Animated EV 3: Cyber EV SUV (Lower Lane Offset) */}
        <div className="absolute bottom-1.5 animate-drive-medium flex items-center z-0 opacity-80">
          <div className="flex items-center gap-1 mr-1">
            <span className="text-[9px] font-black text-cyan-900 dark:text-cyan-300 bg-cyan-100/90 dark:bg-cyan-950/90 px-1.5 py-0.5 rounded-full border border-cyan-300/80 dark:border-cyan-700/80 shadow-2xs">
              🌱 ECO
            </span>
            <span className="w-10 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-emerald-400 rounded-full shadow-xs shadow-cyan-400/50" />
          </div>
          <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] scale-x-[-1] inline-block">
            🚙
          </span>
        </div>
      </div>

      {/* Main Spacious Foreground Navbar Header Items */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-20 flex items-center justify-between gap-4 relative z-10">
        
        {/* Left Side: Sidebar Toggle Button + Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile & Desktop Sidebar Trigger Button */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                toggleSidebarOpen();
              } else {
                toggleSidebarCollapsed();
              }
            }}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
            title="Toggle Menu Sidebar"
            aria-label="Toggle Sidebar"
          >
            <FaBars className="text-base text-slate-700 dark:text-slate-200" />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group pr-2">
            <div className="w-10 h-10 rounded-2xl bg-[#00b976] flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
              ⚡
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Charge<span className="text-[#00b976]">-UP</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links - Spacious Center Area */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-6 gap-4 xl:gap-7 2xl:gap-9 text-sm font-extrabold text-slate-800 dark:text-slate-100 whitespace-nowrap">
          <Link to="/about" className="hover:text-[#00b976] dark:hover:text-emerald-400 transition-all hover:scale-105 py-1">
            About-Us
          </Link>
          
          {/* Find EV Stations Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1.5 hover:text-[#00b976] dark:hover:text-emerald-400 transition-all hover:scale-105 cursor-pointer py-1 font-extrabold">
              <span>Find EV Stations</span>
              <span className="text-[10px] text-slate-400 transition-transform duration-200 group-hover:rotate-180">▼</span>
            </button>

            {/* Dropdown Menu Box */}
            <div className="absolute top-full left-0 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl p-2.5 hidden group-hover:block transition-all animate-fadeIn z-50">
              <Link 
                to="/locations" 
                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:text-[#00b976] dark:hover:text-emerald-400 transition-all group/item"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base shrink-0 group-hover/item:scale-110 transition-transform">
                  📍
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">EV Charging Stations</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Public Fast & Supercharger Hubs</div>
                </div>
              </Link>

              <Link 
                to="/home-charging" 
                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:text-[#00b976] dark:hover:text-emerald-400 transition-all group/item"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-100/80 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-base shrink-0 group-hover/item:scale-110 transition-transform">
                  🏠
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Home EV Charging Stations</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Smart Home Chargers & Tariffs</div>
                </div>
              </Link>

              <Link 
                to="/hospitality" 
                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:text-[#00b976] dark:hover:text-emerald-400 transition-all group/item"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base shrink-0 group-hover/item:scale-110 transition-transform">
                  🏬
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Retail & Hospitality</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Hotels, Cafes & Dining Near Chargers</div>
                </div>
              </Link>
            </div>
          </div>

          <Link to="/products" className="hover:text-[#00b976] dark:hover:text-emerald-400 transition-all hover:scale-105 py-1">Products</Link>
          <Link to="/prices" className="hover:text-[#00b976] dark:hover:text-emerald-400 transition-all hover:scale-105 py-1">Pricing</Link>
          <Link to="/reviews" className="hover:text-[#00b976] dark:hover:text-emerald-400 transition-all hover:scale-105 py-1">Reviews</Link>
          <Link to="/contact" className="hover:text-[#00b976] dark:hover:text-emerald-400 transition-all hover:scale-105 py-1">Contact-Us</Link>
        </div>

        {/* Right Actions: Search Bar & Auth Actions */}
        <div className="flex items-center gap-3 xl:gap-4 shrink-0">
          
          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden md:flex items-center shrink-0">
            <SearchBar />
          </div>

          {/* User Auth Buttons or Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Profile Avatar & Name Link */}
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                title="View Profile Dashboard"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-slate-800 border-2 border-[#00b976] p-0.5 shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src={userAvatar}
                    alt={user.fullName}
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="hidden xl:inline-block text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {user.fullName}
                </span>
              </Link>
              
              {/* Log-Out Button */}
              <button
                onClick={handleLogout}
                className="relative overflow-hidden group px-4 py-2 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white font-extrabold text-xs transition-all duration-300 shadow-2xs hover:shadow-md hover:shadow-red-500/20 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Sign out of ChargeUP"
              >
                <FaRightFromBracket className="text-xs transition-transform duration-300 group-hover:translate-x-0.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Sign In Button */}
              <Link 
                to="/signin" 
                className="relative overflow-hidden group px-5 sm:px-6 py-2.5 rounded-2xl bg-linear-to-r from-emerald-600 via-[#00b976] to-teal-600 hover:from-emerald-500 hover:to-[#00c981] text-white font-black text-sm tracking-wide shadow-md shadow-[#00b976]/25 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                <span>Sign In</span>
              </Link>

              {/* Sign Up Button */}
              <Link 
                to="/signup" 
                className="hidden sm:flex relative overflow-hidden group px-6 py-2.5 rounded-2xl bg-linear-to-r from-[#00b976] via-emerald-600 to-[#009e64] hover:from-[#00c981] hover:to-[#00b976] text-white font-black text-sm tracking-wide shadow-md shadow-[#00b976]/25 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer flex items-center justify-center"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;