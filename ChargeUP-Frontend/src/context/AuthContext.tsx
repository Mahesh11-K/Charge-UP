// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import API from '../api/axios';
import type { User, UserProfile, SignUpInput, SignInInput, AuthContextType, AuthResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('chargeup_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('chargeup_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ⚡ 1. Rehydrate & Verify User Context on App Mount / Page Refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('chargeup_token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get<AuthResponse>('/auth/me');
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('chargeup_user', JSON.stringify(response.data.user));
        } else {
          logout();
        }
      } catch (err: any) {
        console.warn('⚠️ Token verification failed on launch:', err?.response?.data?.error || err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // ⚡ 2. User Sign Up Method
  const signup = async (credentials: SignUpInput): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.post<AuthResponse>('/auth/signup', {
        fullName: credentials.fullName,
        email: credentials.email,
        password: credentials.password,
        role: credentials.role || 'driver',
      });

      const { token: newToken, user: newUser } = response.data;

      if (newToken && newUser) {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('chargeup_token', newToken);
        localStorage.setItem('chargeup_user', JSON.stringify(newUser));
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Registration failed. Please check your details and try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ⚡ 3. User Sign In Method
  const signin = async (credentials: SignInInput): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.post<AuthResponse>('/auth/signin', {
        email: credentials.email,
        password: credentials.password,
      });

      const { token: newToken, user: newUser } = response.data;

      if (newToken && newUser) {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('chargeup_token', newToken);
        localStorage.setItem('chargeup_user', JSON.stringify(newUser));
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Sign in failed. Invalid email or password.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ⚡ 4. Save & Update Profile Method
  const updateUserProfile = async (profileData: UserProfile & { fullName?: string }): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.put<AuthResponse>('/auth/profile', profileData);

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('chargeup_user', JSON.stringify(response.data.user));
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Failed to save profile details.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ⚡ 5. User Logout Method
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('chargeup_token');
    localStorage.removeItem('chargeup_user');
    
    API.post('/auth/logout').catch(() => {});
  };

  // ⚡ 6. Clear Error State
  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    signup,
    signin,
    logout,
    clearError,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
