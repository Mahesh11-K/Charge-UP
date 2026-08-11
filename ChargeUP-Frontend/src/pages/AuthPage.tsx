// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaGoogle, 
  FaUserCheck, 
  FaRightFromBracket, 
  FaKey, 
  FaEnvelope, 
  FaUser, 
  FaLock, 
  FaCircleNotch,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';
import AuthBg from '../assets/AuthBg.png';

interface AuthPageProps {
  initialSignUp?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialSignUp = false }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(initialSignUp);
  const { user, token, isAuthenticated, signin, signup, logout, isLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  // Form states
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');
  const [showSignInPassword, setShowSignInPassword] = useState<boolean>(false);

  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [showSignUpPassword, setShowSignUpPassword] = useState<boolean>(false);
  const [signUpRole] = useState<UserRole>('driver');

  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [prevInitialSignUp, setPrevInitialSignUp] = useState<boolean>(initialSignUp);
  if (prevInitialSignUp !== initialSignUp) {
    setPrevInitialSignUp(initialSignUp);
    setIsSignUp(initialSignUp);
  }

  const handleToggleMode = (mode: boolean) => {
    setIsSignUp(mode);
    setLocalError(null);
    setSuccess(null);
    clearError();
  };

  // ⚡ Handle Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);
    clearError();

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      await signin({
        email: signInEmail.trim(),
        password: signInPassword,
      });

      setSuccess('Successfully signed in! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch {
      // Error handled by AuthContext state
    }
  };

  // ⚡ Handle Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);
    clearError();

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setLocalError('Please complete all required fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await signup({
        fullName: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: signUpRole,
      });

      setSuccess('Account created successfully! Welcome to ChargeUP.');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch {
      // Error handled by AuthContext state
    }
  };

  const activeError = localError || authError;

  // ⚡ RENDER AUTHENTICATED USER CARD (If user is logged in already)
  if (isAuthenticated && user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${AuthBg})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-2xl font-black text-slate-950 shadow-lg shadow-cyan-500/30">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : '⚡'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <FaEnvelope className="text-cyan-400" /> {user.email}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
              <FaUserCheck /> {user.role}
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Account User ID</div>
              <div className="font-mono text-sm text-cyan-300">{user.id}</div>
            </div>

            {token && (
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Active JWT Authorization Token</div>
                <div className="font-mono text-xs text-emerald-400 break-all bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-start gap-2 mt-1">
                  <FaKey className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>{token}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/25"
            >
              Go to Dashboard ➔
            </button>

            <button
              onClick={logout}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FaRightFromBracket /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ⚡ RENDER SLIDING AUTHENTICATION CARD
  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${AuthBg})` }}
    >
      {/* Dark Overlay for optimal contrast and readability */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs pointer-events-none" />

      {/* Background Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Sliding Card Container */}
      <div className="relative z-10 w-full max-w-4xl min-h-[580px] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* ==========================================
            1. LEFT PANEL (Sign In Form & Sign In Welcome)
           ========================================== */}
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-700 ease-in-out">
          {isSignUp ? (
            /* Left Welcome Panel (Visible during Sign Up mode) */
            <div className="text-center w-full max-w-sm my-auto flex flex-col items-center justify-center py-6">
              <div className="z-10 relative mb-6 flex items-center justify-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-md">
                <span className="text-xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)] scale-x-[-1] inline-block animate-bounce">🏎️</span>
                <div className="w-10 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full animate-pulse" />
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-300 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span>⚡ 100% CHARGING</span>
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-3 z-10 relative">Welcome Back!</h2>
              <p className="text-slate-300 text-xs sm:text-sm mb-6 z-10 relative leading-relaxed">
                Sign in to ChargeUP Ecosystem & Manage your EV stations & smart fleet.
              </p>
              <button
                onClick={() => handleToggleMode(false)}
                className="z-10 relative px-10 py-3 border border-slate-400 text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                SIGN IN
              </button>
            </div>
          ) : (
            /* Sign In Input Form (Visible during Sign In mode) */
            <div className="text-center w-full max-w-sm my-auto flex flex-col items-center justify-center py-6">
              <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                Sign In
              </h2>

              {/* Social Login Buttons with Original Brand Colors */}
              <div className="flex justify-center gap-3 my-4">
                <button type="button" title="Sign in with Google" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#EA4335] hover:border-[#EA4335]/50 hover:bg-[#EA4335]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaGoogle /></button>
                <button type="button" title="Sign in with Facebook" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaFacebookF /></button>
                <button type="button" title="Sign in with Twitter" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaTwitter /></button>
                <button type="button" title="Sign in with LinkedIn" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaLinkedinIn /></button>
              </div>

              <p className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">Or use your email address</p>

              {/* Status Notifications */}
              {activeError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs text-left">
                  {activeError}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs text-left">
                  {success}
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <FaLock />
                  </span>
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-11 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    title={showSignInPassword ? 'Hide Password' : 'Show Password'}
                  >
                    <span className="transition-transform duration-200 transform active:scale-90 hover:scale-110">
                      {showSignInPassword ? <FaEye className="text-cyan-400" /> : <FaEyeSlash />}
                    </span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <FaCircleNotch className="animate-spin" /> Signing In...
                    </>
                  ) : (
                    'SIGN IN TO CHARGEUP'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ==========================================
            2. RIGHT PANEL (Sign Up Welcome & Sign Up Form)
           ========================================== */}
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-700 ease-in-out">
          {isSignUp ? (
            /* Create Account Input Form (Visible during Sign Up mode) */
            <div className="text-center w-full max-w-sm my-auto flex flex-col items-center justify-center py-6">
              <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                Create Account
              </h2>

              {/* Social Login Buttons with Original Brand Colors */}
              <div className="flex justify-center gap-3 my-4">
                <button type="button" title="Sign up with Google" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#EA4335] hover:border-[#EA4335]/50 hover:bg-[#EA4335]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaGoogle /></button>
                <button type="button" title="Sign up with Facebook" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaFacebookF /></button>
                <button type="button" title="Sign up with Twitter" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaTwitter /></button>
                <button type="button" title="Sign up with LinkedIn" className="p-2.5 border border-slate-800 rounded-full text-slate-400 bg-slate-950 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><FaLinkedinIn /></button>
              </div>

              <p className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">Or register with email address</p>

              {/* Status Notifications */}
              {activeError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs text-left">
                  {activeError}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs text-left">
                  {success}
                </div>
              )}

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Full name"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <FaLock />
                  </span>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Password (min 6 chars)"
                    className="w-full pl-11 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    title={showSignUpPassword ? 'Hide Password' : 'Show Password'}
                  >
                    <span className="transition-transform duration-200 transform active:scale-90 hover:scale-110">
                      {showSignUpPassword ? <FaEye className="text-cyan-400" /> : <FaEyeSlash />}
                    </span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <FaCircleNotch className="animate-spin" /> Creating Account...
                    </>
                  ) : (
                    'CREATE CHARGEUP ACCOUNT'
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Right Welcome Panel (Visible during Sign In mode) */
            <div className="text-center w-full max-w-sm my-auto flex flex-col items-center justify-center py-6">
              <div className="z-10 relative mb-6 flex items-center justify-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-md">
                <span className="text-xl filter drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] inline-block animate-pulse">🚙</span>
                <div className="w-10 h-1 bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 rounded-full animate-pulse" />
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-cyan-300 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span>🔌 SMART EV NETWORK</span>
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-3 z-10 relative">Hey There!</h2>
              <p className="text-slate-300 text-xs sm:text-sm mb-6 z-10 relative leading-relaxed">
                Begin your journey with ChargeUP Ecosystem & Discover Next-Gen EV Services.
              </p>
              <button
                onClick={() => handleToggleMode(true)}
                className="z-10 relative px-10 py-3 border border-slate-400 text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                SIGN UP
              </button>
            </div>
          )}
        </div>

        {/* 3. SLIDING BACKGROUND OVERLAY */}
        <div
          className={`hidden md:block absolute top-0 w-1/2 h-full bg-gradient-to-br from-cyan-950 via-slate-900 to-emerald-950 border-r border-l border-slate-800 pointer-events-none transition-transform duration-700 ease-in-out ${
            isSignUp ? 'translate-x-0' : 'translate-x-full'
          }`}
        />

      </div>
    </div>
  );
};

export default AuthPage;