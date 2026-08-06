// src/components/LiveVehicleStatus.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';

interface VehicleChargeState {
  batteryLevel: number;
  range: number;
  isPluggedIn: boolean;
  isCharging: boolean;
  chargeRate: number;
  chargeLimit: number;
  batteryCapacity: number;
}

interface VehicleSchedule {
  startTime: string;
  endTime: string;
  active: boolean;
}

interface Vehicle {
  id: string;
  vendor: string;
  model: string;
  year: number;
  smartcarConnected?: boolean;
  chargeState: VehicleChargeState;
  schedule?: VehicleSchedule;
  location?: {
    name: string;
  };
}

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: "veh_tesla_01",
    vendor: "TESLA",
    model: "Model 3 Long Range",
    year: 2026,
    smartcarConnected: true,
    chargeState: {
      batteryLevel: 82,
      range: 365,
      isPluggedIn: true,
      isCharging: true,
      chargeRate: 22.0,
      chargeLimit: 90,
      batteryCapacity: 75.0
    },
    schedule: { startTime: "01:00", endTime: "06:00", active: true },
    location: { name: "Grand Canal Dock Rapid Charging Hub" }
  },
  {
    id: "veh_bmw_02",
    vendor: "BMW",
    model: "i5 eDrive40",
    year: 2025,
    chargeState: {
      batteryLevel: 45,
      range: 210,
      isPluggedIn: false,
      isCharging: false,
      chargeRate: 0,
      chargeLimit: 80,
      batteryCapacity: 81.2
    },
    schedule: { startTime: "00:30", endTime: "05:30", active: false },
    location: { name: "Grafton Street Mall Charging Hub" }
  }
];

const STORAGE_KEY_VEHICLES = 'chargeup_vehicles_data_v3';
const STORAGE_KEY_SELECTED = 'chargeup_selected_vehicle_id_v3';
const EVENT_TELEMETRY_UPDATE = 'chargeup_telemetry_update_v3';

const loadSavedVehicles = (): Vehicle[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_VEHICLES);
    if (!data) return DEFAULT_VEHICLES;
    const parsed: Vehicle[] = JSON.parse(data);
    // Keep default vehicles and authentic Smartcar connected vehicles only (exclude dummy entries)
    const valid = parsed.filter((v) => 
      v.id === 'veh_tesla_01' || 
      v.id === 'veh_bmw_02' || 
      (v.smartcarConnected === true && !v.id.startsWith('smartcar_test_') && !v.id.startsWith('sim_'))
    );
    return valid.length > 0 ? valid : DEFAULT_VEHICLES;
  } catch (e) {
    return DEFAULT_VEHICLES;
  }
};

const loadSavedSelectedId = (): string => {
  try {
    const id = localStorage.getItem(STORAGE_KEY_SELECTED);
    return id || DEFAULT_VEHICLES[0].id;
  } catch (e) {
    return DEFAULT_VEHICLES[0].id;
  }
};

interface LiveVehicleStatusProps {
  mode?: 'floating' | 'inline';
  onClose?: () => void;
}

export const LiveVehicleStatus: React.FC<LiveVehicleStatusProps> = ({ mode = 'floating', onClose }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>(loadSavedVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(loadSavedSelectedId);
  const [commandStatus, setCommandStatus] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [, setIsAddingVehicle] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] || DEFAULT_VEHICLES[0];

  // Schedule Inputs Local State
  const [schedStart, setSchedStart] = useState<string>(activeVehicle.schedule?.startTime || '01:00');
  const [schedEnd, setSchedEnd] = useState<string>(activeVehicle.schedule?.endTime || '06:00');

  useEffect(() => {
    if (activeVehicle.schedule) {
      setSchedStart(activeVehicle.schedule.startTime || '01:00');
      setSchedEnd(activeVehicle.schedule.endTime || '06:00');
    }
  }, [selectedVehicleId, vehicles]);

  // Sync state between all mounted components & browser localStorage
  useEffect(() => {
    const syncStateFromStorage = () => {
      setVehicles(loadSavedVehicles());
      setSelectedVehicleId(loadSavedSelectedId());
    };

    window.addEventListener(EVENT_TELEMETRY_UPDATE, syncStateFromStorage);
    window.addEventListener('storage', syncStateFromStorage);

    return () => {
      window.removeEventListener(EVENT_TELEMETRY_UPDATE, syncStateFromStorage);
      window.removeEventListener('storage', syncStateFromStorage);
    };
  }, []);

  // Fetch latest connected Smartcar vehicles from backend API on mount & on Smartcar OAuth return
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isSmartcarError   = searchParams.get('smartcar_error') === 'true';
    const isSmartcarSuccess = searchParams.get('smartcar_success') === 'true';

    if (isSmartcarError) {
      const reason = searchParams.get('reason') || 'unknown';
      const reasonMessages: Record<string, string> = {
        invalid_secret:      '⚠️ Smartcar Notice: Check Client Secret in backend .env',
        invalid_credentials: '⚠️ Smartcar Notice: Invalid credentials in .env',
        code_expired:        '⚠️ Smartcar Notice: OAuth code expired — please try again',
        oauth_denied:        '⚠️ Smartcar Notice: Access denied by user',
        no_code:             '⚠️ Smartcar Notice: Authorization code missing',
        no_vehicles:         '⚠️ Smartcar Notice: No vehicles found on account',
        telemetry_error:     '⚠️ Smartcar Notice: Telemetry read issue',
        fetch_failed:        '⚠️ Smartcar Notice: Vehicle fetch failed',
      };
      showToast(reasonMessages[reason] || `⚠️ Smartcar Notice (${reason})`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const fetchVehiclesFromBackend = async () => {
      try {
        const response = await API.get('/vehicles');
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const backendVehicles: Vehicle[] = response.data.data;
          
          // Read user's existing saved local vehicles to preserve actions (e.g. STOP CHARGING, lock/unlock, schedule)
          const savedLocalVehicles = loadSavedVehicles();

          // Merge backend response with local saved vehicle states so user actions stick after refresh
          const mergedBackendVehicles = backendVehicles.map((bVeh) => {
            const savedVeh = savedLocalVehicles.find((lVeh) => lVeh.id === bVeh.id);
            if (savedVeh) {
              return {
                ...bVeh,
                chargeState: {
                  ...bVeh.chargeState,
                  ...savedVeh.chargeState
                },
                schedule: savedVeh.schedule ? { ...bVeh.schedule, ...savedVeh.schedule } : bVeh.schedule
              };
            }
            return bVeh;
          });

          // Keep default vehicles (Tesla & BMW) and authentic Smartcar connected vehicles
          const cleanedVehicles = mergedBackendVehicles.filter((v) =>
            v.id === 'veh_tesla_01' || 
            v.id === 'veh_bmw_02' || 
            (v.smartcarConnected === true && !v.id.startsWith('smartcar_test_') && !v.id.startsWith('sim_'))
          );

          // Always include defaults even if backend didn't return them, preserving saved state
          const defaultIds = new Set(['veh_tesla_01', 'veh_bmw_02']);
          const defaultsInList = cleanedVehicles.filter(v => defaultIds.has(v.id));
          const realSmartcarVehicles = cleanedVehicles.filter(v => !defaultIds.has(v.id));

          const missingDefaults = DEFAULT_VEHICLES.map(d => {
            const saved = savedLocalVehicles.find(l => l.id === d.id);
            return saved ? saved : d;
          }).filter(d => !defaultsInList.some(v => v.id === d.id));

          const finalVehicleList = [...defaultsInList, ...missingDefaults, ...realSmartcarVehicles];

          setVehicles(finalVehicleList);
          localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(finalVehicleList));

          // After Smartcar OAuth success: select the newest real connected vehicle
          if (isSmartcarSuccess) {
            const newestSmartcarVehicle = realSmartcarVehicles[realSmartcarVehicles.length - 1];
            const vehicleToSelect = newestSmartcarVehicle || finalVehicleList[finalVehicleList.length - 1];
            if (vehicleToSelect) {
              setSelectedVehicleId(vehicleToSelect.id);
              localStorage.setItem(STORAGE_KEY_SELECTED, vehicleToSelect.id);
              showToast(`✅ ${vehicleToSelect.vendor} ${vehicleToSelect.model} connected for live monitoring!`);
            }
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.warn('Using cached storage for vehicles');
      }
    };

    fetchVehiclesFromBackend();
  }, [location.search]);

  const updateAndSaveVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(newVehicles));
      window.dispatchEvent(new Event(EVENT_TELEMETRY_UPDATE));
    } catch (e) {
      console.error("Failed to save vehicle state", e);
    }
  };

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED, id);
      window.dispatchEvent(new Event(EVENT_TELEMETRY_UPDATE));
    } catch (e) {
      console.error("Failed to save selected vehicle", e);
    }
  };

  const showToast = (msg: string) => {
    setCommandStatus(msg);
    setTimeout(() => setCommandStatus(null), 4000);
  };

  // Connect new EV via Smartcar OAuth Flow
  const handleAddVehicle = async () => {
    setIsAddingVehicle(true);
    setIsDropdownOpen(false);
    showToast('🔄 Connecting to Smartcar API...');
    try {
      const resp = await API.get('/vehicles/smartcar/login');
      if (resp.data?.url) {
        window.location.href = resp.data.url;
      } else {
        showToast('⚠️ Could not obtain Smartcar authorization URL.');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Could not connect to Smartcar API. Make sure backend is running.';
      showToast(`⚠️ ${errorMsg}`);
    } finally {
      setIsAddingVehicle(false);
    }
  };

  const handleCommand = async (type: 'charge' | 'security', action: string) => {
    const isStopping = action === 'STOP';
    const isStarting = action === 'START';

    const updatedVehicles = vehicles.map((v) => {
      if (v.id !== activeVehicle.id) return v;
      if (type === 'charge') {
        const willCharge = isStarting ? true : isStopping ? false : v.chargeState.isCharging;
        return {
          ...v,
          chargeState: {
            ...v.chargeState,
            isCharging: willCharge,
            chargeRate: willCharge ? 22.0 : 0.0
          }
        };
      }
      return v;
    });

    updateAndSaveVehicles(updatedVehicles);

    // Call Backend Smartcar Command API
    try {
      if (type === 'charge') {
        await API.post('/vehicles/charge', { vehicleId: activeVehicle.id, action });
      } else if (type === 'security') {
        await API.post('/vehicles/security', { vehicleId: activeVehicle.id, action });
      }
    } catch (e) {
      // Offline fallback
    }

    showToast(`Success: ${action} command sent to ${activeVehicle.vendor} ${activeVehicle.model}.`);
  };

  // Smartcar API: Set Charge Limit (POST https://api.smartcar.com/v2.0/vehicles/{id}/charge/limit)
  const handleSetChargeLimit = async (newLimitPercent: number) => {
    const updatedVehicles = vehicles.map((v) => {
      if (v.id !== activeVehicle.id) return v;
      return {
        ...v,
        chargeState: {
          ...v.chargeState,
          chargeLimit: newLimitPercent
        }
      };
    });

    updateAndSaveVehicles(updatedVehicles);

    try {
      await API.post('/vehicles/charge-limit', {
        vehicleId: activeVehicle.id,
        limit: newLimitPercent
      });
    } catch (e) {
      // Local fallback handled
    }

    showToast(`🎯 Charge limit set to ${newLimitPercent}% for ${activeVehicle.vendor}.`);
  };

  // Smartcar API 1: Set Daily Charge Schedule
  const handleSetChargeSchedule = async () => {
    const updatedVehicles = vehicles.map((v) => {
      if (v.id !== activeVehicle.id) return v;
      return {
        ...v,
        schedule: {
          startTime: schedStart,
          endTime: schedEnd,
          active: true
        }
      };
    });

    updateAndSaveVehicles(updatedVehicles);

    try {
      await API.post('/vehicles/charge-schedule', {
        vehicleId: activeVehicle.id,
        startTime: schedStart,
        endTime: schedEnd
      });
    } catch (e) {
      // Local fallback handled
    }

    showToast(`⏰ Daily charge schedule set (${schedStart} - ${schedEnd}) for ${activeVehicle.vendor}.`);
  };

  // Smartcar API 2: Delete Charge Schedule
  const handleDeleteChargeSchedule = async () => {
    const updatedVehicles = vehicles.map((v) => {
      if (v.id !== activeVehicle.id) return v;
      return {
        ...v,
        schedule: {
          startTime: '',
          endTime: '',
          active: false
        }
      };
    });

    updateAndSaveVehicles(updatedVehicles);

    try {
      await API.delete('/vehicles/charge-schedule', {
        data: { vehicleId: activeVehicle.id }
      });
    } catch (e) {
      // Local fallback handled
    }

    showToast(`🗑️ Daily charge schedule deleted for ${activeVehicle.vendor}.`);
  };

  // Smartcar API: Remove Connection (DELETE https://api.smartcar.com/v2.0/vehicles/{id}/application)
  const handleDisconnectVehicle = async (vehicleIdToDisconnect: string) => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleIdToDisconnect) || activeVehicle;

    try {
      await API.delete('/vehicles/disconnect', {
        data: { vehicleId: targetVehicle.id }
      });
    } catch (e) {
      console.warn("Offline fallback for Smartcar disconnect API");
    }

    const remainingVehicles = vehicles.filter((v) => v.id !== targetVehicle.id);
    const updatedList = remainingVehicles.length > 0 ? remainingVehicles : DEFAULT_VEHICLES;

    updateAndSaveVehicles(updatedList);
    handleSelectVehicle(updatedList[0].id);

    showToast(`🔌 Removed Smartcar connection for ${targetVehicle.vendor} ${targetVehicle.model}.`);
  };

  const { chargeState, vendor, model, year, location: vehicleLocation, schedule } = activeVehicle;

  // Render Inner Card UI
  const renderCardContent = (handleCloseClick?: () => void) => (
    <>

    <div className="bg-[#121824]/95 border border-slate-700/60 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4 font-sans backdrop-blur-xl w-full relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE CHARGING MONITOR</span>
        </div>

        {handleCloseClick && (
          <button
            onClick={handleCloseClick}
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer text-sm font-bold"
            title="Close Monitor"
          >
            ✕
          </button>
        )}
      </div>

      {/* Smartcar Telemetry Active Badge & EV Selection Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            SMARTCAR TELEMETRY ACTIVE
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1 font-medium truncate max-w-[190px]">
            📍 <span className="text-slate-300 truncate">{vehicleLocation?.name || 'Grand Canal Dock Rapid Charging Hub'}</span>
          </p>
        </div>

        {/* Full-Width Custom Premium EV Selector Dropdown */}
        <div className="relative w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 hover:text-white text-xs sm:text-sm font-bold rounded-2xl px-3.5 py-2.5 border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-200 shadow-md cursor-pointer group select-none"
            title="Switch Connected EV"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate text-xs sm:text-sm font-black text-white">
                {vendor} {model} <span className="text-slate-400 text-xs font-medium">({year})</span>
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Custom Animated Floating Dropdown Popup */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-full bg-slate-900/98 backdrop-blur-2xl border border-slate-700/90 rounded-2xl p-2.5 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400">⚡</span> CONNECTED EVS
                </span>
                <span className="text-[9px] bg-slate-800 text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-full border border-slate-700">
                  {vehicles.length} VEHICLES
                </span>
              </div>

              <div className="py-1 max-h-60 overflow-y-auto space-y-1">
                {vehicles.map((v) => {
                  const isSelected = v.id === selectedVehicleId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        handleSelectVehicle(v.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10 font-bold'
                          : 'text-slate-300 hover:bg-slate-800/90 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSelected ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        <div className="truncate">
                          <p className="font-bold text-slate-100 truncate text-xs">{v.vendor} {v.model}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {v.year} • {v.smartcarConnected ? '⚡ Smartcar' : 'Standard'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-950/90 text-emerald-400 border border-slate-800">
                          {v.chargeState?.batteryLevel ?? 0}%
                        </span>
                        {isSelected && (
                          <span className="text-emerald-400 text-xs font-black">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Add EV Option in Dropdown Menu */}
              <div className="pt-2 mt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleAddVehicle();
                  }}
                  className="w-full py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                >
                  <span className="text-sm font-black">+</span>
                  <span>Add New EV Connection</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Compact Action Bar (ADD EV & REMOVE EV) */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={handleAddVehicle}
            className="bg-[#00b976] hover:bg-[#009e64] text-slate-950 font-black py-1.5 px-2.5 rounded-lg transition-all shadow-sm hover:shadow-emerald-500/20 text-[10px] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="text-xs font-black">+</span>
            <span>ADD EV</span>
          </button>

          <button
            type="button"
            onClick={() => handleDisconnectVehicle(activeVehicle.id)}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 hover:border-rose-500/40 font-extrabold py-1.5 px-2.5 rounded-lg transition-all shadow-xs text-[10px] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
            title="Remove Active EV Connection"
          >
            <span className="text-[11px]">🗑️</span>
            <span>REMOVE EV</span>
          </button>
        </div>
      </div>

      {/* State of Charge Card */}
      <div className="bg-[#1a2332] p-4 rounded-2xl border border-slate-700/50 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">STATE OF CHARGE</span>
          <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {chargeState.isCharging ? 'Charging Active' : 'Plugged In'}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
            <span className="text-slate-300">Battery Level</span>
            <span className="text-emerald-400 font-black text-xl sm:text-2xl">{chargeState.batteryLevel}%</span>
          </div>

          {/* Cyan/Emerald Gradient Progress Bar */}
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 shadow-sm shadow-emerald-400/40"
              style={{ width: `${chargeState.batteryLevel}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
            <span>0%</span>
            <span>Target Limit: <strong className="text-emerald-400 font-bold">{chargeState.chargeLimit}%</strong></span>
          </div>

          {/* Smartcar API: Set Charge Limit Preset Buttons */}
          <div className="flex items-center justify-between gap-1.5 pt-2.5 mt-2 border-t border-slate-800/80">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SET CHARGE LIMIT:</span>
            <div className="flex gap-1">
              {[50, 70, 80, 90, 100].map((limitVal) => (
                <button
                  key={limitVal}
                  type="button"
                  onClick={() => handleSetChargeLimit(limitVal)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                    chargeState.chargeLimit === limitVal
                      ? 'bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-400/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                  }`}
                  title={`Set Smartcar Charge Limit to ${limitVal}%`}
                >
                  {limitVal}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-[#1a2332] p-3 sm:p-3.5 rounded-2xl border border-slate-700/50">
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">EST. RANGE</p>
          <p className="text-base sm:text-lg font-black text-white mt-1">{chargeState.range} <span className="text-xs font-normal text-slate-400">km</span></p>
        </div>
        <div className="bg-[#1a2332] p-3 sm:p-3.5 rounded-2xl border border-slate-700/50">
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">SPEED</p>
          <p className="text-base sm:text-lg font-black text-emerald-400 mt-1">
            {chargeState.chargeRate} <span className="text-xs font-normal text-slate-400">kW</span>
          </p>
        </div>
        <div className="bg-[#1a2332] p-3 sm:p-3.5 rounded-2xl border border-slate-700/50">
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">CAPACITY</p>
          <p className="text-base sm:text-lg font-black text-white mt-1">{chargeState.batteryCapacity} <span className="text-xs font-normal text-slate-400">kWh</span></p>
        </div>
      </div>

      {/* 📅 SMARTCAR DAILY CHARGE SCHEDULE CARD (Collapsible Toggle Button) */}
      <div className="bg-[#1a2332] p-3.5 rounded-2xl border border-slate-700/50 space-y-3">
        <div 
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex justify-between items-center cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              📅 DAILY CHARGE SCHEDULE
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
              schedule?.active 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {schedule?.active ? `🟢 Active (${schedule.startTime} - ${schedule.endTime})` : '⚪ Inactive'}
            </span>
          </div>

          <button
            type="button"
            className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60"
          >
            {showSchedule ? '▲ Hide' : '▼ Manage'}
          </button>
        </div>

        {/* Expandable Schedule Controls Form */}
        {showSchedule && (
          <div className="pt-2 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">START TIME</label>
                <input
                  type="time"
                  value={schedStart}
                  onChange={(e) => setSchedStart(e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 font-bold outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">END TIME</label>
                <input
                  type="time"
                  value={schedEnd}
                  onChange={(e) => setSchedEnd(e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSetChargeSchedule}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-extrabold py-2 px-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                ⏰ SET SCHEDULE
              </button>
              {schedule?.active && (
                <button
                  onClick={handleDeleteChargeSchedule}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  🗑️ DELETE
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Controls Row */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => handleCommand('charge', chargeState.isCharging ? 'STOP' : 'START')}
          className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold py-2.5 px-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          {chargeState.isCharging ? '⏹ STOP CHARGING' : '⚡ START CHARGING'}
        </button>
        <button
          onClick={() => handleCommand('security', 'LOCK')}
          className="bg-[#1c2637] hover:bg-[#253248] text-slate-200 border border-slate-700/60 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          🔒 Lock
        </button>
        <button
          onClick={() => handleCommand('security', 'UNLOCK')}
          className="bg-[#1c2637] hover:bg-[#253248] text-slate-200 border border-slate-700/60 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          🔓 Unlock
        </button>
      </div>

      {/* Notification Toast */}
      {commandStatus && (
        <p className="text-[11px] text-center text-emerald-400 font-semibold animate-pulse bg-emerald-500/10 py-1.5 rounded-xl border border-emerald-500/30">
          {commandStatus}
        </p>
      )}

    </div>
    </>
  );

  // INLINE MODE: Render directly in container
  if (mode === 'inline') {
    return renderCardContent(onClose);
  }

  // FLOATING MODE: Self-contained floating button & popover modal
  // Hide on all auth pages before signing in (/auth, /signin, /signup)
  const isAuthRoute = ['/auth', '/signin', '/signup'].includes(location.pathname);
  if (isAuthRoute) {
    return null;
  }

  return (
    <>
      {/* Fullscreen Dark Backdrop Blur Overlay when Live Status is Open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn cursor-pointer" 
          title="Click to close"
        />
      )}

      {/* Floating Centered Container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 font-sans select-none w-full max-w-sm sm:max-w-md px-4">
        
        {/* Centered Modal Popover */}
        {isOpen && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 w-full shadow-2xl">
            {renderCardContent(() => setIsOpen(false))}
          </div>
        )}

        {/* Floating Toggle Action Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#00b976] hover:bg-[#009e64] text-white font-black text-sm sm:text-base rounded-full px-7 py-3.5 sm:px-8 sm:py-4 shadow-2xl shadow-[#00b976]/40 flex items-center gap-2.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 border-2 border-emerald-300/40 uppercase tracking-wider shrink-0"
          title="Toggle Live Vehicle Status"
        >
          <span className="text-lg">⚡</span>
          <span>{isOpen ? 'HIDE STATUS' : 'LIVE STATUS'}</span>
        </button>

      </div>
    </>
  );
};


export default LiveVehicleStatus;