// src/components/FloatingDashboard.tsx
import React from 'react';
import LiveVehicleStatus from './LiveVehicleStatus';

export const FloatingDashboard: React.FC = () => {
  return <LiveVehicleStatus mode="floating" />;
};

export const FloatingDashboardButton = FloatingDashboard;
export default FloatingDashboard;
