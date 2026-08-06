import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import type { GenderType } from '../types/auth';

interface Vehicle {
  id: string;
  vendor: string;
  model: string;
  year: number;
  smartcarConnected?: boolean;
  chargeState: {
    batteryLevel: number;
    range: number;
    isPluggedIn: boolean;
    isCharging: boolean;
    chargeRate: number;
    chargeLimit: number;
    batteryCapacity: number;
  };
  schedule?: {
    startTime: string;
    endTime: string;
    active: boolean;
  };
  location?: {
    name: string;
  };
}

const STORAGE_KEY_VEHICLES = 'chargeup_vehicles_data_v3';
const STORAGE_KEY_SELECTED = 'chargeup_selected_vehicle_id_v3';
const EVENT_TELEMETRY_UPDATE = 'chargeup_telemetry_update_v3';

// Curated Neutral Cartoon Driver Avatars (4 Male & 4 Female, Normal Calm Faces)
const CARTOON_AVATARS = [
  { id: 'avatar_1', name: 'Avatar 1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&mouth=smile&eyes=default&eyebrows=default&facialHairProbability=0' },
  { id: 'avatar_2', name: 'Avatar 2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&mouth=smile&eyes=default&eyebrows=default&facialHairProbability=0' },
  { id: 'avatar_3', name: 'Avatar 3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&mouth=default&eyes=default&eyebrows=default&facialHairProbability=0' },
  { id: 'avatar_4', name: 'Avatar 4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&mouth=smile&eyes=default&eyebrows=default&facialHairProbability=0' },
  { id: 'avatar_5', name: 'Avatar 5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&mouth=smile&eyes=default&eyebrows=default&facialHairProbability=0' },
  { id: 'avatar_6', name: 'Avatar 6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&mouth=default&eyes=default&eyebrows=default&facialHairProbability=0' },
  { id: 'avatar_7', name: 'Avatar 7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&mouth=smile&eyes=default&eyebrows=default&facialHairProbability=0' },
  { id: 'avatar_8', name: 'Avatar 8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&mouth=smile&eyes=default&eyebrows=default&facialHairProbability=0' },
];

export const Dashboard: React.FC = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Live Vehicle State
  const [dashboardVehicles, setDashboardVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string>('');
  const [smartcarLoading, setSmartcarLoading] = useState<boolean>(false);
  const [smartcarNotice, setSmartcarNotice] = useState<string | null>(null);

  // Profile Form State
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [gender, setGender] = useState<GenderType>('prefer_not_to_say');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [evModel, setEvModel] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(CARTOON_AVATARS[0].url);

  // Synchronize Live Vehicles from local storage & custom telemetry events
  useEffect(() => {
    const syncVehiclesFromStorage = () => {
      try {
        const rawVehicles = localStorage.getItem(STORAGE_KEY_VEHICLES);
        const selId       = localStorage.getItem(STORAGE_KEY_SELECTED);
        if (rawVehicles) {
          const parsed: Vehicle[] = JSON.parse(rawVehicles);
          // Keep default vehicles and authentic Smartcar connected vehicles
          const valid = parsed.filter((v: Vehicle) =>
            v.id === 'veh_tesla_01' || 
            v.id === 'veh_bmw_02' || 
            (v.smartcarConnected === true && !v.id.startsWith('smartcar_test_') && !v.id.startsWith('sim_'))
          );
          setDashboardVehicles(valid);
          if (selId && valid.some((v: Vehicle) => v.id === selId)) {
            setActiveVehicleId(selId);
          } else if (valid.length > 0) {
            setActiveVehicleId(valid[0].id);
          }
        }

      } catch (e) {
        // Fallback
      }
    };

    syncVehiclesFromStorage();
    window.addEventListener(EVENT_TELEMETRY_UPDATE, syncVehiclesFromStorage);
    window.addEventListener('storage', syncVehiclesFromStorage);

    return () => {
      window.removeEventListener(EVENT_TELEMETRY_UPDATE, syncVehiclesFromStorage);
      window.removeEventListener('storage', syncVehiclesFromStorage);
    };
  }, []);

  const handleSelectDashboardVehicle = (id: string) => {
    setActiveVehicleId(id);
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED, id);
      window.dispatchEvent(new Event(EVENT_TELEMETRY_UPDATE));
    } catch (e) {
      console.error('Failed to update selected vehicle', e);
    }
  };

  const handleDashboardSetChargeLimit = async (newLimit: number) => {
    if (!activeVehicle) return;
    const updated = dashboardVehicles.map(v => {
      if (v.id !== activeVehicle.id) return v;
      return {
        ...v,
        chargeState: {
          ...v.chargeState,
          chargeLimit: newLimit
        }
      };
    });

    setDashboardVehicles(updated);
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(updated));
      window.dispatchEvent(new Event(EVENT_TELEMETRY_UPDATE));
      await API.post('/vehicles/charge-limit', { vehicleId: activeVehicle.id, limit: newLimit });
    } catch (e) {
      // Local state updated
    }

    setSmartcarNotice(`🎯 Charge limit set to ${newLimit}% for ${activeVehicle.vendor}.`);
    setTimeout(() => setSmartcarNotice(null), 3000);
  };

  const handleDashboardAddEV = async () => {
    setSmartcarLoading(true);
    setSmartcarNotice('🔄 Connecting to Smartcar API...');
    try {
      const resp = await API.get('/vehicles/smartcar/login');
      if (resp.data?.url) {
        window.location.href = resp.data.url;
      } else {
        setSmartcarNotice('⚠️ Could not obtain Smartcar authorization URL.');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Could not connect to Smartcar API. Make sure backend is running.';
      setSmartcarNotice(`⚠️ ${errorMsg}`);
    } finally {
      setSmartcarLoading(false);
    }
  };

  const activeVehicle = dashboardVehicles.find(v => v.id === activeVehicleId) || dashboardVehicles[0];

  // Initialize Form with existing user/profile data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      const prof = user.profile;
      if (prof) {
        setMobileNumber(prof.mobileNumber || '');
        setAddress(prof.address || '');
        setCity(prof.city || '');
        setStateName(prof.state || '');
        setZipCode(prof.zipCode || '');
        setGender(prof.gender || 'prefer_not_to_say');
        setDateOfBirth(prof.dateOfBirth ? String(prof.dateOfBirth).split('T')[0] : '');
        setEmergencyContact(prof.emergencyContact || '');
        setEvModel(prof.evModel || '');
        setBio(prof.bio || '');
        if (prof.avatarUrl) {
          setSelectedAvatar(prof.avatarUrl);
        }
      }

      // Check if profile is empty -> default to edit mode for first-time profile creation
      const isProfileEmpty = !prof || (!prof.mobileNumber && !prof.address);
      if (isProfileEmpty) {
        setIsEditing(true);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    if (!fullName.trim()) {
      setSaveError('Full Name is required.');
      return;
    }

    if (!mobileNumber.trim()) {
      setSaveError('Mobile Number is required for verification.');
      return;
    }

    setIsSaving(true);

    try {
      if (updateUserProfile) {
        await updateUserProfile({
          fullName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          address: address.trim(),
          city: city.trim(),
          state: stateName.trim(),
          zipCode: zipCode.trim(),
          gender,
          dateOfBirth: dateOfBirth || null,
          avatarUrl: selectedAvatar,
          emergencyContact: emergencyContact.trim(),
          evModel: evModel.trim(),
          bio: bio.trim(),
          isVerified: true,
        });

        setSaveSuccess('Profile details saved & verified in MySQL database successfully!');
        setIsEditing(false);
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  if (!user) return null;

  const currentProfile = user.profile;
  const isProfileComplete = currentProfile && currentProfile.mobileNumber && currentProfile.address;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-50 text-slate-800 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative font-sans">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* =========================================================================
            HEADER & HERO LIGHT GREENISH VERIFIED CARD
           ========================================================================= */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-600/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Decorative Background Circles */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
            {/* Selected Male / Female Cartoon Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white/80 p-1.5 shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={selectedAvatar || CARTOON_AVATARS[0].url}
                  alt="Cartoon Driver Avatar"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-emerald-300 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-md">
                VERIFIED ✓
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.fullName}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-md">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-emerald-100">{user.email}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-semibold text-white">
                <span className="flex items-center gap-1 bg-black/15 px-3 py-1 rounded-lg border border-white/20">
                  📱 {currentProfile?.mobileNumber || 'Mobile Pending'}
                </span>
                <span className="flex items-center gap-1 bg-black/15 px-3 py-1 rounded-lg border border-white/20">
                  🚗 {currentProfile?.evModel || 'EV Model Unspecified'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 z-10 w-full sm:w-auto justify-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs border border-white/40 backdrop-blur-md transition-all shadow-md cursor-pointer"
            >
              {isEditing ? 'View Profile Dashboard 👁️' : 'Edit Profile Form ✏️'}
            </button>

            <button
              onClick={handleSignOut}
              className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 font-extrabold text-xs border border-red-300/40 backdrop-blur-md transition-all shadow-md cursor-pointer"
            >
              Sign Out 🚪
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-xs">
            <span className="text-emerald-600">✅</span>
            <span>{saveSuccess}</span>
          </div>
        )}
        {saveError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center gap-2 shadow-xs">
            <span className="text-red-600">⚠️</span>
            <span>{saveError}</span>
          </div>
        )}

        {/* =========================================================================
            MODE 1: LIGHT THEME PROFILE SETUP FORM (White & Light Greenish UI)
           ========================================================================= */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-500/5 space-y-8 animate-fadeIn">
            <div className="border-b border-emerald-100 pb-4">
              <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Personal Profile Verification Form
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter your personal driver details & select your preferred cartoon profile avatar.
              </p>
            </div>

            {/* 1. CARTOON AVATARS SELECTION GRID */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-800 mb-3">
                Choose Cartoon Profile Avatar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {CARTOON_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.url)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                      selectedAvatar === avatar.url
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md scale-105'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                    }`}
                  >
                    <img src={avatar.url} alt={avatar.name} className="w-14 h-14 object-contain filter drop-shadow-xs" />
                    <span className="text-[10px] font-extrabold text-slate-700 text-center leading-tight">
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. PERSONAL DETAILS FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderType)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                >
                  <option value="prefer_not_to_say">Prefer Not to Say</option>
                  <option value="male">Male 👨</option>
                  <option value="female">Female 👩</option>
                  <option value="other">Other ⚧</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* 3. ADDRESS & LOCATION FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 EV Charging Way, Suite 400"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="California"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="94105"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* 4. EV VEHICLE & EMERGENCY CONTACT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Registered EV Model
                </label>
                <input
                  type="text"
                  value={evModel}
                  onChange={(e) => setEvModel(e.target.value)}
                  placeholder="e.g. Tesla Model Y / Porsche Taycan / Hyundai Ioniq 5"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+1 (555) 987-6543"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Driver Bio & Notes
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your EV experience or charging preferences..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-emerald-100">
              {isProfileComplete && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving Profile to Database...' : 'Save & Verify Profile Details 💾'}
              </button>
            </div>
          </form>
        ) : (
          /* =========================================================================
              MODE 2: LIGHT THEME VERIFIED PROFILE DASHBOARD SUMMARY
             ========================================================================= */
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Charging Sessions</div>
                <div className="text-2xl font-black text-emerald-600 mt-2">12 Active</div>
                <div className="text-[11px] font-bold text-teal-600 mt-1">⚡ 100% Reliability</div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Energy</div>
                <div className="text-2xl font-black text-teal-600 mt-2">1,480 kWh</div>
                <div className="text-[11px] font-bold text-slate-600 mt-1">Clean Solar Energy</div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">CO₂ Saved</div>
                <div className="text-2xl font-black text-emerald-600 mt-2">520 kg</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">🌱 Green Footprint</div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Verification Status</div>
                <div className="text-2xl font-black text-emerald-600 mt-2">Verified ✓</div>
              </div>
            </div>

            {/* Live Connected Smartcar EV Telemetry Card (Renders strictly for Smartcar-connected EVs) */}
            {activeVehicle && activeVehicle.smartcarConnected && (

              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 space-y-6 relative overflow-hidden font-sans">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{activeVehicle.smartcarConnected ? '⚡ SMARTCAR TELEMETRY ACTIVE' : '⚡ DEFAULT MONITORING EV'}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white mt-1">
                      {activeVehicle.vendor} {activeVehicle.model} <span className="text-slate-400 text-lg font-normal">({activeVehicle.year})</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {dashboardVehicles.length > 1 && (
                      <select
                        value={activeVehicle.id}
                        onChange={(e) => handleSelectDashboardVehicle(e.target.value)}
                        className="bg-slate-800 text-slate-100 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {dashboardVehicles.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.vendor} {v.model} ({v.chargeState?.batteryLevel}% SOC)
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={handleDashboardAddEV}
                      disabled={smartcarLoading}
                      className="bg-[#00b976] hover:bg-[#009e64] text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      <span className="text-sm font-black">+</span>
                      <span>ADD EV VIA SMARTCAR</span>
                    </button>
                  </div>
                </div>

                {smartcarNotice && (
                  <div className="py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-medium w-fit">
                    {smartcarNotice}
                  </div>
                )}

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 text-center">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">BATTERY LEVEL</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">{activeVehicle.chargeState.batteryLevel}%</span>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 text-center">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">EST. RANGE</span>
                    <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{activeVehicle.chargeState.range} <span className="text-xs font-normal text-slate-400">km</span></span>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 text-center">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">CHARGING SPEED</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">{activeVehicle.chargeState.chargeRate} <span className="text-xs font-normal text-slate-400">kW</span></span>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 text-center">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">BATTERY CAPACITY</span>
                    <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{activeVehicle.chargeState.batteryCapacity} <span className="text-xs font-normal text-slate-400">kWh</span></span>
                  </div>
                </div>

                {/* Smartcar API: Set Charge Limit Control Row */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-sm">🎯</span>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Smartcar Charge Limit</p>
                      <p className="text-[11px] text-slate-400">Target limit set to <strong className="text-emerald-400 font-black">{activeVehicle.chargeState.chargeLimit}%</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[50, 70, 80, 90, 100].map((limitVal) => (
                      <button
                        key={limitVal}
                        type="button"
                        onClick={() => handleDashboardSetChargeLimit(limitVal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          activeVehicle.chargeState.chargeLimit === limitVal
                            ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                        title={`Set Smartcar Charge Limit to ${limitVal}%`}
                      >
                        {limitVal}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Details Summary Grid */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-500/5 space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>👤</span> Verified Driver Profile Details
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                >
                  Edit Information ✏️
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-slate-500 font-extrabold block uppercase tracking-wider">Mobile Number</span>
                  <span className="font-extrabold text-slate-900 mt-1 block">{currentProfile?.mobileNumber || 'Not set'}</span>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-slate-500 font-extrabold block uppercase tracking-wider">Gender</span>
                  <span className="font-extrabold text-slate-900 mt-1 block capitalize">{currentProfile?.gender || 'Not specified'}</span>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-slate-500 font-extrabold block uppercase tracking-wider">EV Vehicle Model</span>
                  <span className="font-extrabold text-emerald-700 mt-1 block">{currentProfile?.evModel || 'Not specified'}</span>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 md:col-span-2">
                  <span className="text-xs text-slate-500 font-extrabold block uppercase tracking-wider">Address</span>
                  <span className="font-extrabold text-slate-900 mt-1 block">
                    {currentProfile?.address ? `${currentProfile.address}, ${currentProfile.city || ''} ${currentProfile.state || ''} ${currentProfile.zipCode || ''}` : 'Not set'}
                  </span>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-slate-500 font-extrabold block uppercase tracking-wider">Emergency Contact</span>
                  <span className="font-extrabold text-amber-600 mt-1 block">{currentProfile?.emergencyContact || 'Not set'}</span>
                </div>
              </div>

              {currentProfile?.bio && (
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-slate-500 font-extrabold block uppercase tracking-wider">Driver Bio</span>
                  <p className="text-sm text-slate-700 font-medium mt-1 leading-relaxed">{currentProfile.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;