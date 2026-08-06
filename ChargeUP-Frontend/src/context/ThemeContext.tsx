// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'emerald' | 'cyan' | 'purple' | 'amber';
export type DistanceUnit = 'km' | 'mi';

export interface UserSettings {
  notificationsEnabled: boolean;
  stationAlerts: boolean;
  distanceUnit: DistanceUnit;
  soundEffects: boolean;
  compactView: boolean;
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebarOpen: () => void;

  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;

  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  notificationsEnabled: true,
  stationAlerts: true,
  distanceUnit: 'km',
  soundEffects: true,
  compactView: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('chargeup_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sidebar mobile drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Sidebar desktop collapse state (minimised vs expanded)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const savedCollapse = localStorage.getItem('chargeup_sidebar_collapsed');
    return savedCollapse ? JSON.parse(savedCollapse) : false;
  });

  // Accent color state
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const savedAccent = localStorage.getItem('chargeup_accent');
    return (savedAccent as AccentColor) || 'emerald';
  });

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem('chargeup_settings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  // Effect to sync html tag dark class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chargeup_theme', theme);
  }, [theme]);

  // Effect to sync collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('chargeup_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Effect to sync accent color to localStorage
  useEffect(() => {
    localStorage.setItem('chargeup_accent', accentColor);
  }, [accentColor]);

  // Effect to sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('chargeup_settings', JSON.stringify(settings));
  }, [settings]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebarOpen = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const setAccentColor = (accent: AccentColor) => {
    setAccentColorState(accent);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapsed,
        accentColor,
        setAccentColor,
        settings,
        updateSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
