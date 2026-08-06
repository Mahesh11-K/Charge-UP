// src/types/auth.ts
// Strongly Typed TypeScript Interfaces for ChargeUP Authentication & User Profiles

export type UserRole = 'driver' | 'station_owner' | 'admin';

export type AuthProviderType = 'local' | 'google';

export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserProfile {
  id?: number;
  mobileNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  gender?: GenderType;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  avatarStyle?: string;
  emergencyContact?: string;
  evModel?: string;
  bio?: string;
  isVerified?: boolean;
  updatedAt?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  authProvider?: AuthProviderType;
  avatarUrl?: string | null;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
  profile?: UserProfile | null;
}

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  profile?: UserProfile;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (credentials: SignUpInput) => Promise<void>;
  signin: (credentials: SignInInput) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUserProfile?: (profileData: UserProfile & { fullName?: string }) => Promise<void>;
}
