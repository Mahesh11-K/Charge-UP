// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import type { AccentColor } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  FaBolt,
  FaChargingStation,
  FaHouseSignal,
  FaBoxesPacking,
  FaTags,
  FaStar,
  FaPhone,
  FaCircleInfo,
  FaGaugeHigh,
  FaGear,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaXmark,
  FaBell,
  FaVolumeHigh,
  FaVolumeXmark,
  FaRightToBracket,
  FaCheck,
  FaBuildingUser
} from 'react-icons/fa6';

export const Sidebar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    accentColor,
    setAccentColor,
    settings,
    updateSettings,
  } = useTheme();

  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Dynamic accent style helper
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'cyan':
        return {
          bg: 'bg-cyan-500',
          text: 'text-cyan-500',
          border: 'border-cyan-500',
          activeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
          gradient: 'from-cyan-500 to-blue-600',
          ring: 'focus:ring-cyan-500',
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-500',
          border: 'border-purple-500',
          activeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
          gradient: 'from-purple-500 to-indigo-600',
          ring: 'focus:ring-purple-500',
        };
      case 'amber':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-500',
          border: 'border-amber-500',
          activeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
          gradient: 'from-amber-500 to-orange-600',
          ring: 'focus:ring-amber-500',
        };
      case 'emerald':
      default:
        return {
          bg: 'bg-[#00b976]',
          text: 'text-[#00b976]',
          border: 'border-[#00b976]',
          activeBg: 'bg-[#00b976]/10 text-[#00b976] dark:text-emerald-400',
          gradient: 'from-[#00b976] to-teal-600',
          ring: 'focus:ring-[#00b976]',
        };
    }
  };

  const accent = getAccentStyles();

  // Navigation Items
  const navItems = [
    { label: 'Home Overview', path: '/', icon: FaBolt, badge: null },
    { label: 'Public Stations', path: '/locations', icon: FaChargingStation, badge: 'Live' },
    { label: 'Home Charging', path: '/home-charging', icon: FaHouseSignal, badge: null },
    { label: 'Hospitality', path: '/hospitality', icon: FaBuildingUser, badge: 'Dublin' },
    { label: 'Products & Gear', path: '/products', icon: FaBoxesPacking, badge: null },
    { label: 'Plans & Pricing', path: '/prices', icon: FaTags, badge: null },
    { label: 'User Reviews', path: '/reviews', icon: FaStar, badge: '4.9★' },
    { label: 'Support & Contact', path: '/contact', icon: FaPhone, badge: null },
    { label: 'About Charge-UP', path: '/about', icon: FaCircleInfo, badge: null },
  ];

  if (isAuthenticated) {
    navItems.unshift({ label: 'My Dashboard', path: '/dashboard', icon: FaGaugeHigh, badge: 'PRO' });
  }

  const userAvatar =
    user?.profile?.avatarUrl ||
    user?.avatarUrl ||
    'https://api.dicebear.com/7.x/avataaars/svg?seed=ChargeUser1&eyes=default&mouth=smile&eyebrows=default';

  return (
    <>
      {/* 📱 Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* 🚀 Main Sidebar Container - Ultra-Transparent Frosted Glass UI */}
      <aside
        className={`fixed top-20 left-0 z-30 h-[calc(100vh-5rem)] bg-white/20 dark:bg-slate-950/30 backdrop-blur-2xl border-r border-white/30 dark:border-slate-800/30 shadow-2xl shadow-slate-900/10 transition-all duration-300 ease-in-out flex flex-col justify-between select-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
          w-72`}
      >
        {/* Sidebar Glowing Accent Top Border */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${accent.gradient} opacity-70 shrink-0`} />

        {/* 🔝 HEADER SECTION: ChargeUP Title & Logo + Minimise/Maximise Button */}
        <div className="p-3.5 flex items-center justify-between border-b border-white/20 dark:border-slate-800/30 shrink-0 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xs">
          {/* Brand Logo & Title (Replaces NAVIGATION text) */}
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-2.5 overflow-hidden group ${isSidebarCollapsed ? 'lg:hidden' : 'flex'}`}
          >
            <div className={`w-8 h-8 rounded-xl ${accent.bg} text-white flex items-center justify-center text-sm font-black shadow-xs group-hover:scale-105 transition-transform shrink-0`}>
              ⚡
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Charge<span className={accent.text}>-UP</span>
            </span>
          </Link>

          {/* Minimise / Maximise Button (Desktop) & Close Button (Mobile) */}
          <div className={`flex items-center gap-1 ${isSidebarCollapsed ? 'lg:w-full lg:justify-center' : ''}`}>
            {/* Desktop Minimise/Maximise Glass Button */}
            <button
              onClick={toggleSidebarCollapsed}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-2xl bg-white/30 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-100 border border-white/50 dark:border-slate-700/50 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group/btn"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Minimise Sidebar'}
              aria-label="Toggle Sidebar Collapse"
            >
              <FaChevronLeft
                className={`text-xs transition-transform duration-300 group-hover/btn:scale-110 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-2xl bg-white/30 dark:bg-slate-800/40 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
              aria-label="Close Sidebar"
            >
              <FaXmark className="text-base" />
            </button>
          </div>
        </div>

        {/* 👤 USER PROFILE QUICK CARD */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          {isAuthenticated && user ? (
            <Link
              to="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl bg-white/25 dark:bg-slate-800/25 backdrop-blur-md border border-white/40 dark:border-slate-700/30 hover:bg-white/50 dark:hover:bg-slate-800/50 shadow-xs hover:border-emerald-500/40 transition-all group overflow-hidden ${
                isSidebarCollapsed ? 'lg:justify-center lg:p-2' : ''
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={userAvatar}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-500 object-cover shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
              </div>

              <div className={`overflow-hidden transition-all duration-200 ${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                <div className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[150px]">
                  {user.fullName}
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>⚡ 88% Charged</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>Ready</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className={`p-3 rounded-2xl bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/40 dark:border-slate-700/30 text-center ${
              isSidebarCollapsed ? 'lg:hidden' : 'block'
            }`}>
              <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1">
                Welcome to Charge-UP
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
                Connect your EV to monitor charging status & find stations.
              </div>
              <div className="flex gap-2">
                <Link
                  to="/signin"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#00b976] hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1"
                >
                  <FaRightToBracket className="text-[10px]" />
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 🧭 NAVIGATION LINKS SECTION */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
          <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ${
            isSidebarCollapsed ? 'lg:hidden' : 'block'
          }`}>
            Menu Options
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 backdrop-blur-xs ${
                    isActive
                      ? `${accent.activeBg} font-black border border-[#00b976]/30 shadow-2xs`
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  } ${isSidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                >
                  <Icon className={`text-base shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? accent.text : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`} />

                  <span className={`truncate ${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                    {item.label}
                  </span>

                  {/* Badge Tag */}
                  {item.badge && (
                    <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.badge === 'PRO' || item.badge === 'Live'
                        ? `${accent.bg} text-white`
                        : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200'
                    } ${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Tooltip Popover (Visible in collapsed state on desktop hover) */}
                {isSidebarCollapsed && (
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white text-xs font-extrabold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                    {item.label}
                    {item.badge && <span className="ml-1.5 text-[10px] text-emerald-400">({item.badge})</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ⚙️ SETTINGS & DARK MODE CONTROLS SECTION */}
        <div className="p-3 border-t border-white/20 dark:border-slate-800/30 bg-white/15 dark:bg-slate-950/20 backdrop-blur-md shrink-0 space-y-2">
          
          {/* Quick Action Row: Dark Mode & Settings Trigger */}
          <div className={`flex items-center gap-2 ${isSidebarCollapsed ? 'lg:flex-col' : 'flex-row'}`}>
            
            {/* Dark Mode Quick Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-2xl border border-white/40 dark:border-slate-700/40 bg-white/25 dark:bg-slate-800/30 backdrop-blur-md text-slate-800 dark:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-700/60 font-bold text-xs transition-all cursor-pointer shadow-xs ${
                isSidebarCollapsed ? 'lg:w-full lg:p-2.5' : ''
              }`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'dark' ? (
                <FaSun className="text-amber-400 text-sm animate-spin-slow" />
              ) : (
                <FaMoon className="text-slate-700 text-sm" />
              )}
              
              <span className={isSidebarCollapsed ? 'lg:hidden' : 'block'}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {/* Detailed Settings Modal Open Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`p-2.5 rounded-2xl border border-white/40 dark:border-slate-700/40 bg-white/25 dark:bg-slate-800/30 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/60 font-bold text-xs transition-all cursor-pointer shadow-xs ${
                isSidebarCollapsed ? 'lg:w-full lg:flex lg:justify-center' : ''
              }`}
              title="Open Settings"
            >
              <FaGear className="text-sm hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Active Status & Range indicator in expanded mode */}
          <div className={`text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between px-1 pt-1 ${
            isSidebarCollapsed ? 'lg:hidden' : 'flex'
          }`}>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Network Active</span>
            </span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300">
              {settings.distanceUnit === 'km' ? '98.5 km/h' : '61.2 mph'}
            </span>
          </div>

        </div>
      </aside>

      {/* 🎛️ SETTINGS MODAL DIALOG */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white transition-all transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-5 bg-gradient-to-r ${accent.gradient} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <FaGear className="text-lg animate-spin-slow" />
                <h3 className="text-lg font-black tracking-tight">Charge-UP Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <FaXmark />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              
              {/* 1. Theme Mode Switcher */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 block">
                  Appearance Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleTheme()}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                      theme === 'light'
                        ? `${accent.border} ${accent.activeBg} ring-2 ${accent.ring}`
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FaSun className="text-amber-500 text-lg" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    onClick={() => toggleTheme()}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                      theme === 'dark'
                        ? `${accent.border} ${accent.activeBg} ring-2 ${accent.ring}`
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FaMoon className="text-indigo-400 text-lg" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* 2. Color Accent Picker */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 block">
                  Brand Color Accent
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: 'emerald', name: 'Emerald', bg: 'bg-[#00b976]' },
                      { id: 'cyan', name: 'Cyber Cyan', bg: 'bg-cyan-500' },
                      { id: 'purple', name: 'Neon Purple', bg: 'bg-purple-500' },
                      { id: 'amber', name: 'Amber Volt', bg: 'bg-amber-500' },
                    ] as { id: AccentColor; name: string; bg: string }[]
                  ).map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setAccentColor(col.id)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                        accentColor === col.id
                          ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full ${col.bg} flex items-center justify-center text-white text-xs shadow-xs`}>
                        {accentColor === col.id && <FaCheck className="text-[10px]" />}
                      </span>
                      <span className="text-[10px]">{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Distance Unit System */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 block">
                  Distance Measurement Unit
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateSettings({ distanceUnit: 'km' })}
                    className={`py-2.5 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      settings.distanceUnit === 'km'
                        ? `${accent.border} ${accent.activeBg} font-black`
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Kilometers (km)
                  </button>
                  <button
                    onClick={() => updateSettings({ distanceUnit: 'mi' })}
                    className={`py-2.5 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      settings.distanceUnit === 'mi'
                        ? `${accent.border} ${accent.activeBg} font-black`
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Miles (mi)
                  </button>
                </div>
              </div>

              {/* 4. Preferences Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FaBell className="text-slate-400" />
                    <div>
                      <div className="text-xs font-bold">Station Alerts</div>
                      <div className="text-[10px] text-slate-400">Notify when nearby fast charger opens</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.stationAlerts}
                    onChange={(e) => updateSettings({ stationAlerts: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {settings.soundEffects ? (
                      <FaVolumeHigh className="text-slate-400" />
                    ) : (
                      <FaVolumeXmark className="text-slate-400" />
                    )}
                    <div>
                      <div className="text-xs font-bold">Sound & Haptics</div>
                      <div className="text-[10px] text-slate-400">Audio feedback on charging events</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => updateSettings({ soundEffects: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className={`py-2 px-5 rounded-xl ${accent.bg} hover:opacity-90 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
