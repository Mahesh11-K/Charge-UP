// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import BrandTrusted from './components/BrandTrusted';
import Impact from './components/Impact';
import Process from './components/Process';
import Chargers from './components/Chargers';
import Features from './components/Features';
import Operations from './components/Operations';
import LiveVehicleStatus from './components/LiveVehicleStatus';

import Locations from './pages/Locations';
import HomeCharging from './pages/HomeCharging';
import Hospitality from './pages/Hospitality';
import Dashboard from './pages/Dashboard';
import Prices from './pages/Prices';
import Products from './pages/Products';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AuthPage from './pages/AuthPage';

// Automatically reset scroll position to top on page navigation
const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, search, hash]);

  return null;
};

const HomePage: React.FC = () => (
  <>
    <Hero />
    <BrandTrusted />
    <Features />
    <Operations />
    <Process />
    <Chargers />
    <Impact />
  </>
);

const AppLayout: React.FC = () => {
  const { isSidebarCollapsed } = useTheme();

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative pt-20 transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
    }`}>
      <Navbar />
      <Sidebar />
      <main className="w-full min-h-[calc(100vh-5rem)]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/home-charging" element={<HomeCharging />} />
          <Route path="/hospitality" element={<Hospitality />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <LiveVehicleStatus mode="floating" />
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <AppLayout />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;