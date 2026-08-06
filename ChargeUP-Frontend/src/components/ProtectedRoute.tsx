// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading State - Render futuristic loader spinner
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <span className="text-xl">⚡</span>
        </div>
        <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">
          Verifying ChargeUP Session...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State - Redirect to /signin preserving attempt location
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 3. Unauthorized Role State - Check role authorization if specified
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-red-500/20">
          🚫
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Access Restricted</h2>
        <p className="text-slate-400 max-w-md mt-2">
          Your account role (<span className="text-cyan-400 font-semibold">{user.role}</span>) does not have permission to view this page.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  // 4. Access Granted - Render Protected Component
  return children;
};

export default ProtectedRoute;
