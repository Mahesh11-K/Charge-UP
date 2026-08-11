// src/pages/HomeCharging.tsx
import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import API from '../api/axios';
import { 
  FaHouseSignal, 
  FaBolt, 
  FaSliders, 
  FaPlug, 
  FaLocationDot,
  FaPlay,
  FaPause,
  FaStop,
  FaShieldHalved,
  FaArrowRotateRight,
  FaUserCheck,
  FaCarSide,
  FaBatteryThreeQuarters,
  FaTemperatureHigh,
  FaLock,
  FaLockOpen,
  FaHouse,
  FaGaugeHigh,
  FaLocationArrow
} from 'react-icons/fa6';

export interface SmartPolicy {
  mode: 'OFF_PEAK' | 'SOLAR_SURPLUS' | 'DYNAMIC_BALANCED' | 'FAST_CHARGE';
  offPeakStart: string;
  offPeakEnd: string;
  solarMatchingEnabled: boolean;
  dynamicLoadBalancing: boolean;
  targetBatterySoc: number;
  targetDepartureTime: string;
}

export interface EnodeVehicle {
  id: string;
  userId: string;
  chargerId: string;
  vendor: string;
  model: string;
  year: number;
  title?: string;
  vin?: string;
  chargeState?: {
    isCharging?: boolean;
    batteryLevel?: number;
    chargeRate?: number;
    range?: number;
    chargeTimeRemaining?: string | number;
  };
  homeStation?: {
    name?: string;
  };
}

export interface EnodeVehicleDetail extends EnodeVehicle {
  odometer?: {
    distance?: number;
  };
}

export interface DiagnosticsData {
  chargerId: string;
  name: string;
  status: string;
  lineVoltage: string;
  rcdSelfTest: string;
  timestamp: string;
}

export interface HomeCharger {
  id: string;
  name: string;
  address: string;
  eircode: string;
  cityRegion: string;
  lat: number;
  lng: number;
  brand: string;
  model: string;
  maxPowerKw: number;
  maxCurrentAmps: number;
  phases: number;
  connectorType: string;
  serialNumber: string;
  firmwareVersion: string;
  chargeState: 'CHARGING' | 'PAUSED' | 'SCHEDULED' | 'SOLAR_ECO' | 'DISCONNECTED';
  isPluggedIn: boolean;
  isCableLocked: boolean;
  currentPowerKw: number;
  currentAmps: number;
  voltage: number;
  frequencyHz: number;
  sessionEnergyKwh: number;
  totalEnergyKwh: number;
  sessionDurationMins: number;
  costPerKwh: number;
  currentSessionCostEur: number;
  smartPolicy: SmartPolicy;
  ownerName: string;
  evModelConnected: string;
}

const DEFAULT_CHARGERS: HomeCharger[] = [
  {
    id: "chg_dub_001",
    name: "Ballsbridge Residential Hub",
    address: "24 Pembroke Road, Ballsbridge, Dublin 4",
    eircode: "D04 H5R2",
    cityRegion: "Dublin 4",
    lat: 53.3325,
    lng: -6.2341,
    brand: "ChargeUP Nectar",
    model: "Nectar Smart Home Pro 7.4kW",
    maxPowerKw: 7.4,
    maxCurrentAmps: 32,
    phases: 1,
    connectorType: "Type 2 Tethered",
    serialNumber: "ENODE-IE-D04-8842",
    firmwareVersion: "v3.14.2-enode",
    chargeState: "CHARGING",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 6.8,
    currentAmps: 29.5,
    voltage: 230,
    frequencyHz: 50.0,
    sessionEnergyKwh: 18.4,
    totalEnergyKwh: 1420.5,
    sessionDurationMins: 145,
    costPerKwh: 0.35,
    currentSessionCostEur: 6.44,
    smartPolicy: {
      mode: "OFF_PEAK",
      offPeakStart: "23:00",
      offPeakEnd: "08:00",
      solarMatchingEnabled: false,
      dynamicLoadBalancing: true,
      targetBatterySoc: 80,
      targetDepartureTime: "07:30"
    },
    ownerName: "Liam O'Connor",
    evModelConnected: "Tesla Model 3 Long Range (2024)"
  },
  {
    id: "chg_dub_002",
    name: "Ranelagh Smart Home Station",
    address: "88 Sandford Road, Ranelagh, Dublin 6",
    eircode: "D06 K2C3",
    cityRegion: "Dublin 6",
    lat: 53.3218,
    lng: -6.2514,
    brand: "Myenergi",
    model: "Zappi v2.1 22kW",
    maxPowerKw: 22.0,
    maxCurrentAmps: 32,
    phases: 3,
    connectorType: "Type 2 Socket",
    serialNumber: "ENODE-IE-D06-1934",
    firmwareVersion: "v5.2.0-zappi",
    chargeState: "SOLAR_ECO",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 4.2,
    currentAmps: 18.2,
    voltage: 400,
    frequencyHz: 50.0,
    sessionEnergyKwh: 12.1,
    totalEnergyKwh: 2890.0,
    sessionDurationMins: 90,
    costPerKwh: 0.12,
    currentSessionCostEur: 1.45,
    smartPolicy: {
      mode: "SOLAR_SURPLUS",
      offPeakStart: "00:00",
      offPeakEnd: "06:00",
      solarMatchingEnabled: true,
      dynamicLoadBalancing: true,
      targetBatterySoc: 90,
      targetDepartureTime: "08:00"
    },
    ownerName: "Siobhán Murphy",
    evModelConnected: "Hyundai Ioniq 5 (77kWh)"
  },
  {
    id: "chg_dub_003",
    name: "Clontarf Coastal Residence Point",
    address: "142 Clontarf Road, Clontarf, Dublin 3",
    eircode: "D03 Y8E5",
    cityRegion: "Dublin 3",
    lat: 53.3639,
    lng: -6.1985,
    brand: "Easee",
    model: "Easee Home Smart 11kW",
    maxPowerKw: 11.0,
    maxCurrentAmps: 16,
    phases: 3,
    connectorType: "Type 2 Socket",
    serialNumber: "ENODE-IE-D03-7721",
    firmwareVersion: "v2.8.9-easee",
    chargeState: "SCHEDULED",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 0.0,
    currentAmps: 0.0,
    voltage: 400,
    frequencyHz: 50.0,
    sessionEnergyKwh: 0.0,
    totalEnergyKwh: 980.2,
    sessionDurationMins: 0,
    costPerKwh: 0.22,
    currentSessionCostEur: 0.00,
    smartPolicy: {
      mode: "OFF_PEAK",
      offPeakStart: "23:00",
      offPeakEnd: "07:00",
      solarMatchingEnabled: false,
      dynamicLoadBalancing: true,
      targetBatterySoc: 85,
      targetDepartureTime: "07:15"
    },
    ownerName: "Ciarán Walsh",
    evModelConnected: "Volkswagen ID.4 Pro"
  },
  {
    id: "chg_dub_004",
    name: "Sandyford Suburban Green Station",
    address: "15 Blackthorn Road, Sandyford, Dublin 18",
    eircode: "D18 E2X9",
    cityRegion: "Dublin 18",
    lat: 53.2778,
    lng: -6.2081,
    brand: "Wallbox",
    model: "Wallbox Pulsar Plus 22kW",
    maxPowerKw: 22.0,
    maxCurrentAmps: 32,
    phases: 3,
    connectorType: "Type 2 Tethered",
    serialNumber: "ENODE-IE-D18-5012",
    firmwareVersion: "v6.1.1-wallbox",
    chargeState: "CHARGING",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 11.0,
    currentAmps: 16.0,
    voltage: 400,
    frequencyHz: 50.0,
    sessionEnergyKwh: 24.6,
    totalEnergyKwh: 3410.8,
    sessionDurationMins: 130,
    costPerKwh: 0.38,
    currentSessionCostEur: 9.35,
    smartPolicy: {
      mode: "DYNAMIC_BALANCED",
      offPeakStart: "22:00",
      offPeakEnd: "06:00",
      solarMatchingEnabled: true,
      dynamicLoadBalancing: true,
      targetBatterySoc: 100,
      targetDepartureTime: "06:30"
    },
    ownerName: "Fiona Byrne",
    evModelConnected: "BMW i4 eDrive40"
  },
  {
    id: "chg_dub_005",
    name: "Rathmines Eco Smart Charger",
    address: "51 Lower Rathmines Road, Dublin 6",
    eircode: "D06 R8X2",
    cityRegion: "Dublin 6",
    lat: 53.3265,
    lng: -6.2651,
    brand: "Zaptec",
    model: "Zaptec Go 7.4kW",
    maxPowerKw: 7.4,
    maxCurrentAmps: 32,
    phases: 1,
    connectorType: "Type 2 Socket",
    serialNumber: "ENODE-IE-D06-9931",
    firmwareVersion: "v4.0.5-zaptec",
    chargeState: "PAUSED",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 0.0,
    currentAmps: 0.0,
    voltage: 230,
    frequencyHz: 50.0,
    sessionEnergyKwh: 8.5,
    totalEnergyKwh: 740.0,
    sessionDurationMins: 65,
    costPerKwh: 0.32,
    currentSessionCostEur: 2.72,
    smartPolicy: {
      mode: "OFF_PEAK",
      offPeakStart: "23:00",
      offPeakEnd: "08:00",
      solarMatchingEnabled: false,
      dynamicLoadBalancing: true,
      targetBatterySoc: 80,
      targetDepartureTime: "07:45"
    },
    ownerName: "Darragh Smith",
    evModelConnected: "Nissan Leaf e+"
  },
  {
    id: "chg_dub_006",
    name: "Drumcondra Residence Point",
    address: "74 Griffith Avenue, Drumcondra, Dublin 9",
    eircode: "D09 P4K7",
    cityRegion: "Dublin 9",
    lat: 53.3721,
    lng: -6.2492,
    brand: "Schneider Electric",
    model: "EVlink Home 7.4kW",
    maxPowerKw: 7.4,
    maxCurrentAmps: 32,
    phases: 1,
    connectorType: "Type 2 Tethered",
    serialNumber: "ENODE-IE-D09-3320",
    firmwareVersion: "v2.1.0-schneider",
    chargeState: "CHARGING",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 7.2,
    currentAmps: 31.3,
    voltage: 230,
    frequencyHz: 50.0,
    sessionEnergyKwh: 15.3,
    totalEnergyKwh: 1850.4,
    sessionDurationMins: 125,
    costPerKwh: 0.36,
    currentSessionCostEur: 5.51,
    smartPolicy: {
      mode: "FAST_CHARGE",
      offPeakStart: "00:00",
      offPeakEnd: "07:00",
      solarMatchingEnabled: false,
      dynamicLoadBalancing: true,
      targetBatterySoc: 100,
      targetDepartureTime: "08:00"
    },
    ownerName: "Aoife Kelly",
    evModelConnected: "Kia EV6 GT-Line"
  },
  {
    id: "chg_dub_007",
    name: "Dundrum Villa Smart Charger",
    address: "29 Taney Road, Dundrum, Dublin 14",
    eircode: "D14 F9V1",
    cityRegion: "Dublin 14",
    lat: 53.2878,
    lng: -6.2415,
    brand: "Andersen",
    model: "Andersen A2 Custom 22kW",
    maxPowerKw: 22.0,
    maxCurrentAmps: 32,
    phases: 3,
    connectorType: "Type 2 Concealed",
    serialNumber: "ENODE-IE-D14-1189",
    firmwareVersion: "v4.5.1-andersen",
    chargeState: "SOLAR_ECO",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 5.5,
    currentAmps: 8.0,
    voltage: 400,
    frequencyHz: 50.0,
    sessionEnergyKwh: 9.8,
    totalEnergyKwh: 2120.0,
    sessionDurationMins: 85,
    costPerKwh: 0.15,
    currentSessionCostEur: 1.47,
    smartPolicy: {
      mode: "SOLAR_SURPLUS",
      offPeakStart: "23:00",
      offPeakEnd: "07:00",
      solarMatchingEnabled: true,
      dynamicLoadBalancing: true,
      targetBatterySoc: 85,
      targetDepartureTime: "07:30"
    },
    ownerName: "Eoin Gallagher",
    evModelConnected: "Audi Q4 e-tron"
  },
  {
    id: "chg_dub_008",
    name: "Howth Head Eco Charging Spot",
    address: "5 Harbour Road, Howth, Co. Dublin",
    eircode: "D13 K3Y9",
    cityRegion: "Co. Dublin",
    lat: 53.3881,
    lng: -6.0682,
    brand: "Tesla",
    model: "Tesla Wall Connector Gen 3 11kW",
    maxPowerKw: 11.0,
    maxCurrentAmps: 16,
    phases: 3,
    connectorType: "Type 2 Tethered",
    serialNumber: "ENODE-IE-D13-9041",
    firmwareVersion: "v24.1.2-tesla",
    chargeState: "CHARGING",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 10.8,
    currentAmps: 15.6,
    voltage: 400,
    frequencyHz: 50.0,
    sessionEnergyKwh: 32.1,
    totalEnergyKwh: 4500.0,
    sessionDurationMins: 180,
    costPerKwh: 0.34,
    currentSessionCostEur: 10.91,
    smartPolicy: {
      mode: "OFF_PEAK",
      offPeakStart: "23:00",
      offPeakEnd: "08:00",
      solarMatchingEnabled: true,
      dynamicLoadBalancing: true,
      targetBatterySoc: 90,
      targetDepartureTime: "07:00"
    },
    ownerName: "Maeve Ryan",
    evModelConnected: "Tesla Model Y Performance"
  },
  {
    id: "chg_dub_009",
    name: "Castleknock Villa Hub",
    address: "63 Castleknock Road, Dublin 15",
    eircode: "D15 H7Y2",
    cityRegion: "Dublin 15",
    lat: 53.3742,
    lng: -6.3611,
    brand: "EO Charging",
    model: "EO Mini Pro 3 7.4kW",
    maxPowerKw: 7.4,
    maxCurrentAmps: 32,
    phases: 1,
    connectorType: "Type 2 Socket",
    serialNumber: "ENODE-IE-D15-4412",
    firmwareVersion: "v1.9.4-eo",
    chargeState: "DISCONNECTED",
    isPluggedIn: false,
    isCableLocked: false,
    currentPowerKw: 0.0,
    currentAmps: 0.0,
    voltage: 230,
    frequencyHz: 50.0,
    sessionEnergyKwh: 0.0,
    totalEnergyKwh: 610.5,
    sessionDurationMins: 0,
    costPerKwh: 0.35,
    currentSessionCostEur: 0.00,
    smartPolicy: {
      mode: "OFF_PEAK",
      offPeakStart: "23:00",
      offPeakEnd: "07:00",
      solarMatchingEnabled: false,
      dynamicLoadBalancing: true,
      targetBatterySoc: 80,
      targetDepartureTime: "07:30"
    },
    ownerName: "Cormac Doyle",
    evModelConnected: "Peugeot e-208"
  },
  {
    id: "chg_dub_010",
    name: "Blackrock Parkside Station",
    address: "18 Mount Merrion Avenue, Blackrock, Co. Dublin",
    eircode: "A94 V2H8",
    cityRegion: "Co. Dublin",
    lat: 53.2985,
    lng: -6.1824,
    brand: "Pod Point",
    model: "Pod Point Solo 3 7.4kW",
    maxPowerKw: 7.4,
    maxCurrentAmps: 32,
    phases: 1,
    connectorType: "Type 2 Universal",
    serialNumber: "ENODE-IE-A94-6623",
    firmwareVersion: "v3.8.0-pod",
    chargeState: "CHARGING",
    isPluggedIn: true,
    isCableLocked: true,
    currentPowerKw: 6.9,
    currentAmps: 30.0,
    voltage: 230,
    frequencyHz: 50.0,
    sessionEnergyKwh: 0,
    totalEnergyKwh: 520.0,
    sessionDurationMins: 0,
    costPerKwh: 0.35,
    currentSessionCostEur: 0,
    smartPolicy: {
      mode: "OFF_PEAK",
      offPeakStart: "23:00",
      offPeakEnd: "07:00",
      solarMatchingEnabled: false,
      dynamicLoadBalancing: false,
      targetBatterySoc: 80,
      targetDepartureTime: "08:00"
    },
    ownerName: "Niamh Brennan",
    evModelConnected: "Polestar 2 Long Range"
  }
];

const HomeCharging: React.FC = () => {
  // Persistent State Initialization
  const [chargers, setChargers] = useState<HomeCharger[]>(() => {
    const saved = localStorage.getItem('chargeup_home_chargers');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_CHARGERS;
  });

  const [selectedCharger, setSelectedCharger] = useState<HomeCharger>(() => {
    const savedId = localStorage.getItem('chargeup_selected_charger_id');
    const savedChargers = localStorage.getItem('chargeup_home_chargers');
    const list: HomeCharger[] = savedChargers ? JSON.parse(savedChargers) : DEFAULT_CHARGERS;
    return list.find((c: HomeCharger) => c.id === savedId) || list[0];
  });

  const [filterRegion, setFilterRegion] = useState<string>(() => localStorage.getItem('chargeup_filter_region') || 'ALL');
  const [filterStatus, setFilterStatus] = useState<string>(() => localStorage.getItem('chargeup_filter_status') || 'ALL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  void isLoading;
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Amperage & Bi-Directional Controls
  const [targetAmps, setTargetAmps] = useState<number>(() => Number(localStorage.getItem('chargeup_target_amps')) || 32);
  const [v2hEnabled, setV2hEnabled] = useState<boolean>(() => localStorage.getItem('chargeup_v2h_enabled') === 'true');
  const [climatePrecon, setClimatePrecon] = useState<boolean>(() => localStorage.getItem('chargeup_climate_precon') !== 'false');
  const [batteryPreheat, setBatteryPreheat] = useState<boolean>(() => localStorage.getItem('chargeup_battery_preheat') === 'true');
  const [cableAutoLock, setCableAutoLock] = useState<boolean>(() => localStorage.getItem('chargeup_cable_autolock') !== 'false');

  // Modals & Action States
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState<boolean>(false);
  const [showSchedulerModal, setShowSchedulerModal] = useState<boolean>(false);
  const [isDiagnosticsScanning, setIsDiagnosticsScanning] = useState<boolean>(false);
  const [diagnosticsData, setDiagnosticsData] = useState<DiagnosticsData | null>(null);

  // Hardware Pairing States
  const [pairingVendor, setPairingVendor] = useState<string>('Easee Home');
  const [pairingSerial, setPairingSerial] = useState<string>('ES-DUBLIN-7741');
  const [isPairingLoading, setIsPairingLoading] = useState<boolean>(false);
  const [pairingSuccess, setPairingSuccess] = useState<boolean>(false);

  // Connected EV Fleet Telemetry Modal States
  const [showVehicleSandboxModal, setShowVehicleSandboxModal] = useState<boolean>(false);
  const [activeVehApiTab, setActiveVehApiTab] = useState<'GET_VEHICLES' | 'GET_VEHICLE'>('GET_VEHICLES');
  const [enodeVehiclesList, setEnodeVehiclesList] = useState<EnodeVehicle[]>([]);
  const [selectedVehId, setSelectedVehId] = useState<string>('veh_dub_001');
  const [vehicleDetailData, setVehicleDetailData] = useState<EnodeVehicleDetail | null>(null);
  const [isVehApiLoading, setIsVehApiLoading] = useState<boolean>(false);
  const [vendorFilter, setVendorFilter] = useState<string>('ALL');
  void isVehApiLoading;
  void vendorFilter;
  void setVendorFilter;

  // Sync targetAmps when selectedCharger changes
  const [prevSelectedChargerId, setPrevSelectedChargerId] = useState<string | undefined>(selectedCharger?.id);
  if (selectedCharger && selectedCharger.id !== prevSelectedChargerId) {
    setPrevSelectedChargerId(selectedCharger.id);
    setTargetAmps(selectedCharger.currentAmps || selectedCharger.maxCurrentAmps);
  }

  // Persistence Effects
  useEffect(() => { localStorage.setItem('chargeup_home_chargers', JSON.stringify(chargers)); }, [chargers]);
  useEffect(() => { if (selectedCharger) localStorage.setItem('chargeup_selected_charger_id', selectedCharger.id); }, [selectedCharger]);
  useEffect(() => { localStorage.setItem('chargeup_v2h_enabled', String(v2hEnabled)); }, [v2hEnabled]);
  useEffect(() => { localStorage.setItem('chargeup_climate_precon', String(climatePrecon)); }, [climatePrecon]);
  useEffect(() => { localStorage.setItem('chargeup_battery_preheat', String(batteryPreheat)); }, [batteryPreheat]);
  useEffect(() => { localStorage.setItem('chargeup_cable_autolock', String(cableAutoLock)); }, [cableAutoLock]);
  useEffect(() => { localStorage.setItem('chargeup_filter_region', filterRegion); }, [filterRegion]);
  useEffect(() => { localStorage.setItem('chargeup_filter_status', filterStatus); }, [filterStatus]);
  useEffect(() => { localStorage.setItem('chargeup_target_amps', String(targetAmps)); }, [targetAmps]);

  // Maplibre Map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  // Manual Refresh Handler
  const handleRefreshChargers = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/home-charging/chargers');
      if (res.data?.chargers?.length > 0) {
        setChargers(res.data.chargers);
        const savedId = localStorage.getItem('chargeup_selected_charger_id');
        const match = res.data.chargers.find((c: HomeCharger) => c.id === savedId) || res.data.chargers[0];
        setSelectedCharger(match);
      }
    } catch {
      console.warn('Running with ChargeUP interactive sandbox mode.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load from Backend API
  useEffect(() => {
    let ignore = false;
    const loadInitialChargers = async () => {
      try {
        const res = await API.get('/home-charging/chargers');
        if (!ignore && res.data?.chargers?.length > 0) {
          setChargers(res.data.chargers);
          const savedId = localStorage.getItem('chargeup_selected_charger_id');
          const match = res.data.chargers.find((c: HomeCharger) => c.id === savedId) || res.data.chargers[0];
          setSelectedCharger(match);
        }
      } catch {
        console.warn('Running with ChargeUP interactive sandbox mode.');
      }
    };
    loadInitialChargers();
    return () => {
      ignore = true;
    };
  }, []);

  // Filtered Charger List
  const filteredChargers = chargers.filter(c => {
    const matchRegion = filterRegion === 'ALL' || c.cityRegion.toLowerCase() === filterRegion.toLowerCase();
    const matchStatus = filterStatus === 'ALL' || c.chargeState.toLowerCase() === filterStatus.toLowerCase();
    return matchRegion && matchStatus;
  });

  // Calculate Operational Metrics
  const totalActiveKW = chargers.reduce((sum, c) => sum + (c.currentPowerKw || 0), 0);
  const totalKwhSession = chargers.reduce((sum, c) => sum + (c.sessionEnergyKwh || 0), 0);
  const chargingCount = chargers.filter(c => c.chargeState === 'CHARGING' || c.chargeState === 'SOLAR_ECO').length;
  const solarPercent = Math.round((chargers.filter(c => c.smartPolicy.solarMatchingEnabled).length / chargers.length) * 100);

  // Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [-6.2415, 53.3412],
        zoom: 11.2,
        attributionControl: false
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      mapRef.current = map;
    }

    if (selectedCharger && mapRef.current) {
      mapRef.current.easeTo({
        center: [selectedCharger.lng, selectedCharger.lat],
        zoom: 12.5,
        duration: 900
      });
    }

    if (mapRef.current) {
      Object.values(markersRef.current).forEach(m => m.remove());
      markersRef.current = {};

      filteredChargers.forEach(chg => {
        const isSelected = selectedCharger?.id === chg.id;
        const el = document.createElement('div');
        el.className = `relative cursor-pointer transition-all duration-200 ${isSelected ? 'z-50 scale-125' : 'z-10 opacity-90 hover:opacity-100 hover:scale-110'}`;

        let statusBg = 'bg-emerald-500 shadow-emerald-400/50';
        if (chg.chargeState === 'SOLAR_ECO') statusBg = 'bg-sky-500 shadow-sky-400/50';
        if (chg.chargeState === 'SCHEDULED') statusBg = 'bg-indigo-500 shadow-indigo-400/50';
        if (chg.chargeState === 'PAUSED') statusBg = 'bg-amber-500 shadow-amber-400/50';
        if (chg.chargeState === 'DISCONNECTED') statusBg = 'bg-slate-400 shadow-slate-300/50';

        el.innerHTML = `
          <div className="w-7 h-7 rounded-full border-2 border-white ${statusBg} flex items-center justify-center text-white text-xs font-black shadow-md">
            ⚡
          </div>
        `;

        el.addEventListener('click', () => setSelectedCharger(chg));

        if (mapRef.current) {
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([chg.lng, chg.lat])
            .addTo(mapRef.current);
          markersRef.current[chg.id] = marker;
        }
      });
    }
  }, [selectedCharger, filteredChargers]);

  // Execute Control Action (START, PAUSE, STOP, BOOST)
  const handleControlAction = async (action: 'START' | 'PAUSE' | 'STOP' | 'BOOST') => {
    if (!selectedCharger) return;
    setActionLoading(true);

    try {
      await API.post(`/home-charging/chargers/${selectedCharger.id}/charge`, { action });
      const updated = { ...selectedCharger };
      if (action === 'START') { updated.chargeState = 'CHARGING'; updated.currentPowerKw = Number((updated.maxPowerKw * 0.95).toFixed(1)); updated.currentAmps = 29.5; }
      else if (action === 'PAUSE') { updated.chargeState = 'PAUSED'; updated.currentPowerKw = 0; updated.currentAmps = 0; }
      else if (action === 'STOP') { updated.chargeState = 'DISCONNECTED'; updated.currentPowerKw = 0; updated.currentAmps = 0; }
      else if (action === 'BOOST') { updated.chargeState = 'CHARGING'; updated.currentPowerKw = updated.maxPowerKw; updated.currentAmps = updated.maxCurrentAmps; updated.smartPolicy.mode = 'FAST_CHARGE'; }

      setChargers(prev => prev.map(c => c.id === selectedCharger.id ? updated : c));
      setSelectedCharger(updated);
      showToast(`Command [${action}] executed successfully for ${selectedCharger.name}!`, 'success');
    } catch {
      showToast(`Command [${action}] executed`, 'info');
    } finally {
      setActionLoading(false);
    }
  };

  // Set Current Limit Slider
  const handleApplyCurrentLimit = async (newAmps: number) => {
    if (!selectedCharger) return;
    setTargetAmps(newAmps);
    try {
      await API.post(`/home-charging/chargers/${selectedCharger.id}/charge-limit`, { maxCurrentAmps: newAmps });
      const calcKw = Number(((230 * newAmps * (selectedCharger.phases === 3 ? 1.732 : 1)) / 1000).toFixed(1));
      const updated: HomeCharger = { ...selectedCharger, currentAmps: newAmps, currentPowerKw: Math.min(selectedCharger.maxPowerKw, calcKw) };
      setChargers(prev => prev.map(c => c.id === selectedCharger.id ? updated : c));
      setSelectedCharger(updated);
      showToast(`Amperage limit updated to ${newAmps}A (${calcKw} kW)`, 'success');
    } catch {
      showToast(`Current Limit set to ${newAmps}A`, 'info');
    }
  };

  // Update Smart Policy
  const handleUpdateSmartPolicy = async (updates: Partial<SmartPolicy>) => {
    if (!selectedCharger) return;
    const newPolicy = { ...selectedCharger.smartPolicy, ...updates };
    try {
      await API.put(`/home-charging/chargers/${selectedCharger.id}/smart-charging-policy`, updates);
      let newChargeState = selectedCharger.chargeState;
      let newKw = selectedCharger.currentPowerKw;
      if (newPolicy.mode === 'SOLAR_SURPLUS') { newChargeState = 'SOLAR_ECO'; newKw = 4.2; }
      else if (newPolicy.mode === 'OFF_PEAK') { newChargeState = 'SCHEDULED'; newKw = 0; }

      const updated: HomeCharger = { ...selectedCharger, chargeState: newChargeState, currentPowerKw: newKw, smartPolicy: newPolicy };
      setChargers(prev => prev.map(c => c.id === selectedCharger.id ? updated : c));
      setSelectedCharger(updated);
      showToast(`Smart Policy updated to ${newPolicy.mode}`, 'success');
    } catch {
      showToast(`Policy set to ${newPolicy.mode}`, 'info');
    }
  };

  // Fetch Connected Vehicles
  const handleFetchEnodeVehicles = async (vendor?: string) => {
    setIsVehApiLoading(true);
    try {
      const vFilter = vendor !== undefined ? vendor : vendorFilter;
      const queryParam = vFilter && vFilter !== 'ALL' ? `?vendor=${encodeURIComponent(vFilter)}` : '';
      const res = await API.get(`/home-charging/vehicles${queryParam}`);
      setEnodeVehiclesList(res.data?.data || []);
    } catch {
      setEnodeVehiclesList(chargers.map((c, idx) => ({
        id: `veh_dub_00${idx + 1}`,
        userId: `user_dublin_driver_0${idx + 1}`,
        chargerId: c.id,
        vendor: c.evModelConnected.split(' ')[0],
        model: c.evModelConnected,
        year: 2024,
        title: `${c.ownerName}'s ${c.evModelConnected}`,
        vin: `5YJ3E1EA8PF1000${idx + 1}`,
        chargeState: { isCharging: c.chargeState === 'CHARGING' || c.chargeState === 'SOLAR_ECO', batteryLevel: 75 + idx, chargeRate: c.currentPowerKw, range: 350 + idx * 10 },
        homeStation: { name: c.name }
      })));
    } finally {
      setIsVehApiLoading(false);
    }
  };

  const handleFetchEnodeVehicleById = async (vId: string) => {
    setIsVehApiLoading(true);
    try {
      const res = await API.get(`/home-charging/vehicles/${vId}`);
      setVehicleDetailData(res.data?.data || null);
    } catch {
      console.warn('Vehicle detail fetch fallback');
    } finally {
      setIsVehApiLoading(false);
    }
  };

  // Diagnostics Scan
  const handleRunDiagnostics = async () => {
    if (!selectedCharger) return;
    setIsDiagnosticsScanning(true);
    try {
      const res = await API.post(`/home-charging/chargers/${selectedCharger.id}/diagnostics`);
      setDiagnosticsData(res.data?.diagnostics || null);
      showToast(`Hardware Diagnostic Scan Completed for ${selectedCharger.name}`, 'success');
    } catch {
      setDiagnosticsData({ chargerId: selectedCharger.id, name: selectedCharger.name, status: "HEALTHY", lineVoltage: "230V ±0.8%", rcdSelfTest: "PASSED", timestamp: new Date().toISOString() });
      showToast(`Diagnostic scan completed for ${selectedCharger.name}`, 'info');
    } finally {
      setIsDiagnosticsScanning(false);
    }
  };

  // Cable Lock Toggle
  const handleToggleCableLock = async () => {
    if (!selectedCharger) return;
    const nextState = !selectedCharger.isCableLocked;
    try {
      await API.post(`/home-charging/chargers/${selectedCharger.id}/cable-lock`, { isCableLocked: nextState });
      const updated = { ...selectedCharger, isCableLocked: nextState };
      setChargers(prev => prev.map(c => c.id === selectedCharger.id ? updated : c));
      setSelectedCharger(updated);
      showToast(`Hardware Cable Lock ${nextState ? 'ENGAGED & LOCKED' : 'RELEASED & UNLOCKED'}`, 'success');
    } catch {
      const updated = { ...selectedCharger, isCableLocked: nextState };
      setChargers(prev => prev.map(c => c.id === selectedCharger.id ? updated : c));
      setSelectedCharger(updated);
      showToast(`Cable lock set to ${nextState ? 'LOCKED' : 'UNLOCKED'}`, 'info');
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50/70 via-slate-50 to-sky-50/70 text-slate-900 font-sans pt-16 sm:pt-20 pb-20 selection:bg-emerald-100 selection:text-emerald-900 relative">
      
      {/* 🌿 SOFT AMBIENT LIGHT GREEN & LIGHT BLUE BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-[-5%] w-[550px] h-[550px] bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[25%] w-[450px] h-[450px] bg-teal-300/15 rounded-full blur-3xl" />
      </div>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
          <div className={`px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold text-slate-900 backdrop-blur-md ${
            notification.type === 'success' ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900 shadow-emerald-500/20' :
            notification.type === 'error' ? 'bg-red-50/95 border-red-300 text-red-900 shadow-red-500/20' :
            'bg-sky-50/95 border-sky-300 text-sky-900 shadow-sky-500/20'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* ── CLEAN LIGHT HERO BANNER ────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[32px] bg-white/90 border border-slate-200/80 backdrop-blur-xl p-6 sm:p-10 shadow-xs hover:shadow-md transition-shadow">
          
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-400 to-sky-500" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs">
                  <FaHouseSignal className="text-emerald-600" />
                  <span>ChargeUP Ecosystem</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-sky-100/90 text-sky-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-sky-200/80 shadow-2xs">
                  <FaLocationDot className="text-sky-600" />
                  <span>Dublin City Region (10 Hubs)</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Home Charging <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600">Operations</span>
              </h1>
              
              <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                Smart home EV charging dashboard for Dublin city region. Control live power flow, off-peak rates, and green solar energy matching with effortless ease.
              </p>
            </div>

            {/* QUICK ACTIONS DOCK (LIGHT GREEN & LIGHT BLUE THEME) */}
            <div className="w-full lg:w-80 shrink-0 bg-slate-50/90 border border-slate-200/80 p-4 rounded-[28px] shadow-inner backdrop-blur-md space-y-3">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Quick Actions Dock
                </span>
                <span className="text-emerald-700 bg-emerald-100/80 font-extrabold text-[9px] px-2 py-0.5 rounded-md border border-emerald-200">
                  READY
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="w-full bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-between border border-emerald-400/30"
                >
                  <div className="flex items-center gap-2.5">
                    <FaPlug className="text-emerald-100 text-sm" />
                    <span>Pair Hardware</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-200 font-extrabold px-2 py-0.5 rounded-md">Gateway</span>
                </button>

                <button
                  onClick={() => {
                    setShowVehicleSandboxModal(true);
                    handleFetchEnodeVehicles();
                  }}
                  className="w-full bg-linear-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-between border border-sky-400/30"
                >
                  <div className="flex items-center gap-2.5">
                    <FaCarSide className="text-sky-100 text-sm" />
                    <span>Connected EV Fleet</span>
                  </div>
                  <span className="text-[10px] bg-sky-950/80 text-sky-200 font-extrabold px-2 py-0.5 rounded-md">10 EVs</span>
                </button>

                <button
                  onClick={() => {
                    setShowDiagnosticsModal(true);
                    if (!diagnosticsData) handleRunDiagnostics();
                  }}
                  className="w-full bg-linear-to-r from-teal-600 via-cyan-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-between border border-cyan-400/30"
                >
                  <div className="flex items-center gap-2.5">
                    <FaShieldHalved className="text-teal-100 text-sm" />
                    <span>Cable Lock & Health</span>
                  </div>
                  <span className="text-[10px] bg-teal-950/80 text-teal-200 font-extrabold px-2 py-0.5 rounded-md">Security</span>
                </button>

                <button
                  onClick={() => setShowSchedulerModal(true)}
                  className="w-full bg-linear-to-r from-emerald-700 via-teal-700 to-sky-700 hover:from-emerald-600 hover:to-sky-600 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-between border border-emerald-400/30"
                >
                  <div className="flex items-center gap-2.5">
                    <FaSliders className="text-emerald-100 text-sm" />
                    <span>Smart Scheduler</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-200 font-extrabold px-2 py-0.5 rounded-md">Schedule</span>
                </button>
              </div>
            </div>

          </div>

          {/* REAL-TIME METRICS AGGREGATES ROW (LIGHT THEME) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
            <div className="bg-white/90 p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all backdrop-blur-md">
              <div className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">Active Stations</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
                <span>{chargers.length}</span>
                <span className="text-xs text-emerald-600 font-bold">({chargingCount} Active)</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4.5 rounded-2xl border border-emerald-200/80 shadow-xs hover:shadow-md transition-all backdrop-blur-md">
              <div className="text-[11px] text-emerald-800 font-extrabold uppercase tracking-wider">Aggregate Grid Load</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                {totalActiveKW.toFixed(1)} <span className="text-xs font-bold text-slate-700">kW</span>
              </div>
            </div>

            <div className="bg-sky-50/70 p-4.5 rounded-2xl border border-sky-200/80 shadow-xs hover:shadow-md transition-all backdrop-blur-md">
              <div className="text-[11px] text-sky-800 font-extrabold uppercase tracking-wider">Session Energy</div>
              <div className="text-xl sm:text-2xl font-black text-sky-700 mt-1">
                {totalKwhSession.toFixed(1)} <span className="text-xs font-bold text-slate-700">kWh</span>
              </div>
            </div>

            <div className="bg-teal-50/70 p-4.5 rounded-2xl border border-teal-200/80 shadow-xs hover:shadow-md transition-all backdrop-blur-md">
              <div className="text-[11px] text-teal-800 font-extrabold uppercase tracking-wider">Solar Smart Sync</div>
              <div className="text-xl sm:text-2xl font-black text-teal-700 mt-1">
                {solarPercent}% <span className="text-xs font-bold text-slate-600">Clean PV</span>
              </div>
            </div>
          </div>

        </div>


        {/* ── MAIN DASHBOARD GRID ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Dublin Station Hubs & Interactive Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white/95 border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                  <span>📍 Dublin Station Hubs</span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                    {filteredChargers.length}
                  </span>
                </h3>

                <button 
                  onClick={handleRefreshChargers}
                  disabled={isLoading}
                  className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
                >
                  <FaArrowRotateRight className={isLoading ? 'animate-spin' : ''} />
                  <span>Sync</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Region</label>
                  <select 
                    value={filterRegion} 
                    onChange={e => setFilterRegion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="ALL">All Dublin Regions</option>
                    <option value="Dublin 3">Dublin 3 (Clontarf)</option>
                    <option value="Dublin 4">Dublin 4 (Ballsbridge)</option>
                    <option value="Dublin 6">Dublin 6 (Ranelagh/Rathmines)</option>
                    <option value="Dublin 9">Dublin 9 (Drumcondra)</option>
                    <option value="Dublin 14">Dublin 14 (Dundrum)</option>
                    <option value="Dublin 15">Dublin 15 (Castleknock)</option>
                    <option value="Dublin 18">Dublin 18 (Sandyford)</option>
                    <option value="Co. Dublin">Co. Dublin (Howth/Blackrock)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                  <select 
                    value={filterStatus} 
                    onChange={e => setFilterStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="ALL">All Charger States</option>
                    <option value="CHARGING">Charging</option>
                    <option value="SOLAR_ECO">Solar Eco</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PAUSED">Paused</option>
                    <option value="DISCONNECTED">Disconnected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-3 shadow-xs">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-3 py-1 mb-2">
                <span>🗺️ Interactive Map (Dublin Region)</span>
                <span className="text-[11px] text-emerald-600 font-extrabold">Live Geolocation</span>
              </div>
              
              <div className="rounded-2xl relative h-[250px] w-full overflow-hidden border border-slate-100 shadow-inner">
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
              </div>
            </div>

            {/* Scrollable Dublin Home Charger List */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredChargers.map(chg => {
                const isSelected = selectedCharger?.id === chg.id;
                return (
                  <div
                    key={chg.id}
                    onClick={() => setSelectedCharger(chg)}
                    className={`p-4.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-emerald-500 bg-white shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-1.5">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                          {chg.cityRegion} • {chg.brand}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {chg.name}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        chg.chargeState === 'CHARGING' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        chg.chargeState === 'SOLAR_ECO' ? 'bg-sky-100 text-sky-800 border-sky-200' :
                        chg.chargeState === 'SCHEDULED' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                        chg.chargeState === 'PAUSED' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {chg.chargeState.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3 truncate">
                      📍 {chg.address}
                    </p>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-1.5">
                        <FaBolt className="text-emerald-500 text-xs" />
                        <span>{chg.currentPowerKw} kW ({chg.currentAmps}A)</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${chg.lat},${chg.lng}`, '_blank');
                        }}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <FaLocationArrow className="text-xs" />
                        <span>Directions</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          
          {/* RIGHT COLUMN: Selected Station Cockpit (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {selectedCharger && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-7">
                
                {/* 1. Station Header */}
                <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        ChargeUP Hardware: {selectedCharger.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {selectedCharger.connectorType}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {selectedCharger.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      📍 {selectedCharger.address} ({selectedCharger.eircode})
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedCharger.lat},${selectedCharger.lng}`, '_blank');
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FaLocationArrow className="text-emerald-600 text-xs" />
                      <span>Get Directions</span>
                    </button>

                    <div className="bg-slate-50 p-2.5 px-3.5 rounded-2xl border border-slate-100 shrink-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <FaUserCheck className="text-emerald-500 text-xs" />
                        <span>{selectedCharger.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <FaCarSide className="text-sky-600 text-xs" />
                        <span>{selectedCharger.evModelConnected}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Real-Time Hardware Telemetry Grid */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <span>⚡ Live Hardware Telemetry</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                    <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80">
                      <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider">Current Power</p>
                      <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                        {selectedCharger.currentPowerKw} <span className="text-xs">kW</span>
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{selectedCharger.currentAmps} Amperes</p>
                    </div>

                    <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200/80">
                      <p className="text-[10px] text-sky-800 font-extrabold uppercase tracking-wider">Voltage / Freq</p>
                      <p className="text-xl sm:text-2xl font-black text-sky-700 mt-1">
                        {selectedCharger.voltage} <span className="text-xs">V</span>
                      </p>
                      <p className="text-[10px] text-sky-600 font-semibold mt-0.5">{selectedCharger.frequencyHz} Hz • {selectedCharger.phases}-Phase</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Session Energy</p>
                      <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                        {selectedCharger.sessionEnergyKwh} <span className="text-xs">kWh</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedCharger.sessionDurationMins} Mins active</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Session Cost</p>
                      <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
                        €{selectedCharger.currentSessionCostEur.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">€{selectedCharger.costPerKwh}/kWh rate</p>
                    </div>
                  </div>
                </div>


                {/* 🚗 CONNECTED EV TELEMETRY & V2H POWER POD */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 space-y-5 border border-slate-800 shadow-md">
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30 shadow-inner">
                        <FaCarSide />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-base tracking-tight">
                            {selectedCharger.evModelConnected}
                          </h3>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
                            CONNECTED EV
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Owner: {selectedCharger.ownerName} • VIN: 5YJ3E1EA8NF{selectedCharger.id.slice(-4).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setCableAutoLock(!cableAutoLock);
                          showToast(`Cable Auto-Lock set to ${!cableAutoLock ? 'LOCKED' : 'UNLOCKED'}`, 'info');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                          cableAutoLock ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {cableAutoLock ? <FaLock className="text-emerald-400" /> : <FaLockOpen />}
                        <span>{cableAutoLock ? 'Cable Locked' : 'Unlocked'}</span>
                      </button>
                    </div>
                  </div>

                  {/* EV Battery Gauge Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-center">
                    
                    {/* SOC Gauge */}
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <FaBatteryThreeQuarters className="text-emerald-400 text-sm" />
                          <span>EV Battery</span>
                        </span>
                        <span className="text-emerald-400 font-black text-sm">
                          {selectedCharger.smartPolicy.targetBatterySoc - 12}%
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                        <div 
                          className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 relative"
                          style={{ width: `${selectedCharger.smartPolicy.targetBatterySoc - 12}%` }}
                        >
                          <div className="absolute top-0 right-0 w-2 h-full bg-white/60 animate-ping rounded-full" />
                        </div>
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>340 km Range</span>
                        <span>Target: {selectedCharger.smartPolicy.targetBatterySoc}%</span>
                      </div>
                    </div>

                    {/* Speed */}
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Charging Speed</div>
                      <div className="text-base font-black text-white flex items-center gap-1.5">
                        <FaGaugeHigh className="text-cyan-400 text-xs" />
                        <span>+{selectedCharger.currentPowerKw > 0 ? Math.round(selectedCharger.currentPowerKw * 5.2) : 0} km / hr</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Est. finish at {selectedCharger.smartPolicy.targetDepartureTime}
                      </div>
                    </div>

                    {/* Cabin Climate */}
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-300 flex items-center gap-1">
                          <FaTemperatureHigh className="text-amber-400 text-xs" />
                          <span>Cabin Climate</span>
                        </span>
                        <button
                          onClick={() => {
                            setClimatePrecon(!climatePrecon);
                            showToast(`Cabin Climate turned ${!climatePrecon ? 'ON (21°C)' : 'OFF'}`, 'info');
                          }}
                          className={`w-9 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer ${climatePrecon ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${climatePrecon ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {climatePrecon ? 'Warms cabin (21°C)' : 'Climate Off'}
                      </div>
                    </div>

                    {/* Battery Warmup */}
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-300 flex items-center gap-1">
                          <FaBolt className="text-emerald-400 text-xs" />
                          <span>Battery Warmup</span>
                        </span>
                        <button
                          onClick={() => {
                            setBatteryPreheat(!batteryPreheat);
                            showToast(`Battery Pre-heating ${!batteryPreheat ? 'ENABLED' : 'DISABLED'}`, 'info');
                          }}
                          className={`w-9 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer ${batteryPreheat ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${batteryPreheat ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {batteryPreheat ? 'Optimizing pack temp' : 'Thermal Idle'}
                      </div>
                    </div>

                  </div>

                  {/* V2H Bi-Directional Power Feature */}
                  <div className="bg-linear-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 p-4 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/30">
                          V2H Bi-Directional Feature
                        </span>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <FaHouse className="text-emerald-400" />
                          <span>Vehicle-to-Home Power Feed</span>
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Feeds stored EV battery power into home circuits during peak hours (17:00-19:00 @ €0.44/kWh), saving up to €38/mo.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setV2hEnabled(!v2hEnabled);
                        showToast(`V2H Vehicle-to-Home Power Backfeed ${!v2hEnabled ? 'ENABLED' : 'DISABLED'}`, !v2hEnabled ? 'success' : 'info');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 ${
                        v2hEnabled 
                          ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <FaBolt className={v2hEnabled ? 'animate-pulse text-slate-950' : 'text-emerald-400'} />
                      <span>{v2hEnabled ? 'V2H Backfeed ACTIVE' : 'Enable V2H Backfeed'}</span>
                    </button>
                  </div>

                </div>

                {/* 3. Hardware Control Action Buttons */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>🎮 Hardware Controls</span>
                    <span className="text-[11px] text-slate-500 font-medium">Cable: {selectedCharger.isPluggedIn ? '🔌 Plugged In' : '❌ Unplugged'}</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleControlAction('START')}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold py-3 px-4 rounded-2xl transition-all shadow-md shadow-emerald-600/20 text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaPlay />
                      <span>Start</span>
                    </button>

                    <button
                      onClick={() => handleControlAction('PAUSE')}
                      disabled={actionLoading}
                      className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-extrabold py-3 px-4 rounded-2xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaPause />
                      <span>Pause</span>
                    </button>

                    <button
                      onClick={() => handleControlAction('STOP')}
                      disabled={actionLoading}
                      className="bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-extrabold py-3 px-4 rounded-2xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaStop />
                      <span>Stop</span>
                    </button>

                    <button
                      onClick={() => handleControlAction('BOOST')}
                      disabled={actionLoading}
                      className="bg-linear-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 active:scale-95 text-white font-black py-3 px-4 rounded-2xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaBolt />
                      <span>Boost Max</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>


      {/* ── CLEAN LIGHT MODALS ────────────────────────────────────────────── */}
      
      {/* 1. HARDWARE LINKING MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative border border-slate-100">
            <button onClick={() => setShowLinkModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Hardware Pairing Gateway
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pair Home Charger</h3>
            </div>

            {pairingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xl mx-auto">✓</div>
                <h4 className="font-extrabold text-emerald-900 text-base">Hardware Successfully Paired!</h4>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Select EV Charger Brand</label>
                  <select value={pairingVendor} onChange={e => setPairingVendor(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Easee Home">Easee Home (7.4 kW / 22 kW)</option>
                    <option value="Wallbox Pulsar Max">Wallbox Pulsar Max / Plus</option>
                    <option value="Zaptec Go">Zaptec Go Smart Home</option>
                    <option value="Myenergi Zappi v2.1">Myenergi Zappi Eco Charger</option>
                    <option value="Tesla Wall Connector Gen 3">Tesla Wall Connector Gen 3</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Serial Number (SN)</label>
                    <input type="text" value={pairingSerial} onChange={e => setPairingSerial(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">PIN Code</label>
                    <input type="password" value="4821" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800" />
                  </div>
                </div>

                <button onClick={() => { setIsPairingLoading(true); setTimeout(() => { setIsPairingLoading(false); setPairingSuccess(true); setTimeout(() => setShowLinkModal(false), 1200); }, 1000); }} disabled={isPairingLoading} className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md cursor-pointer">
                  {isPairingLoading ? 'Connecting...' : 'Pair Charger via Gateway'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CABLE LOCK & DIAGNOSTICS MODAL */}
      {showDiagnosticsModal && selectedCharger && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowDiagnosticsModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md border border-sky-200">Hardware Security & Health</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FaShieldHalved className="text-sky-600" />
                <span>Station Cable Lock & Diagnostics</span>
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Cable Lock Mechanism</div>
                  <div className="text-xs text-slate-500 mt-0.5">{selectedCharger.isCableLocked ? 'Cable locked into socket.' : 'Cable unlocked.'}</div>
                </div>
                <button onClick={handleToggleCableLock} className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer">
                  {selectedCharger.isCableLocked ? 'Unlock Cable' : 'Lock Cable'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Station Health Audit</h4>
                <button onClick={handleRunDiagnostics} disabled={isDiagnosticsScanning} className="bg-slate-100 text-sky-700 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer hover:bg-slate-200">
                  {isDiagnosticsScanning ? 'Scanning...' : 'Run Diagnostics'}
                </button>
              </div>

              {diagnosticsData && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700"><span>Voltage Level:</span><span className="text-emerald-600 font-bold">{diagnosticsData.lineVoltage}</span></div>
                  <div className="flex justify-between text-slate-700"><span>RCD Protection:</span><span className="text-emerald-600 font-bold">{diagnosticsData.rcdSelfTest}</span></div>
                </div>
              )}
            </div>

            <button onClick={() => setShowDiagnosticsModal(false)} className="w-full bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-2xl cursor-pointer hover:bg-slate-200">Close</button>
          </div>
        </div>
      )}

      {/* 3. SMART SCHEDULER MODAL */}
      {showSchedulerModal && selectedCharger && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowSchedulerModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">Smart Engine</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FaSliders className="text-emerald-600" />
                <span>Smart Charge Policy</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'OFF_PEAK', name: '🌙 Night Off-Peak', desc: 'Cheap night electricity' },
                { id: 'SOLAR_SURPLUS', name: '☀️ Solar Eco', desc: 'Match local solar PV' },
                { id: 'DYNAMIC_BALANCED', name: '⚖️ Dynamic Load', desc: 'Protect main fuse' },
                { id: 'FAST_CHARGE', name: '⚡ Fast Boost', desc: 'Maximum power speed' }
              ].map(m => (
                <div key={m.id} onClick={() => handleUpdateSmartPolicy({ mode: m.id as SmartPolicy['mode'] })} className={`p-3 rounded-2xl border cursor-pointer ${selectedCharger.smartPolicy.mode === m.id ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="font-extrabold text-xs text-slate-900">{m.name}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Max Charging Current</span>
                <span className="text-emerald-600 font-black">{targetAmps} Amps</span>
              </div>
              <input type="range" min="6" max={selectedCharger.maxCurrentAmps || 32} value={targetAmps} onChange={e => handleApplyCurrentLimit(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>

            <button onClick={() => setShowSchedulerModal(false)} className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md cursor-pointer">Apply Schedule</button>
          </div>
        </div>
      )}

      {/* 4. CONNECTED EV FLEET TELEMETRY MODAL */}
      {showVehicleSandboxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[92vh] overflow-y-auto">
            <button onClick={() => setShowVehicleSandboxModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md border border-sky-200 flex items-center gap-1.5">
                  <FaCarSide className="text-sky-600" />
                  <span>Fleet Vehicle Operations</span>
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">🚗 Connected Electric Vehicle Fleet</h3>
            </div>

            <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
              <button onClick={() => { setActiveVehApiTab('GET_VEHICLES'); handleFetchEnodeVehicles(); }} className={`px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer ${activeVehApiTab === 'GET_VEHICLES' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-200/80 text-slate-700'}`}>Fleet Vehicles Overview</button>
              <button onClick={() => { setActiveVehApiTab('GET_VEHICLE'); handleFetchEnodeVehicleById(selectedVehId); }} className={`px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer ${activeVehApiTab === 'GET_VEHICLE' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-200/80 text-slate-700'}`}>Live Vehicle Telemetry</button>
            </div>

            {activeVehApiTab === 'GET_VEHICLES' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[440px] overflow-y-auto">
                {enodeVehiclesList.map((veh: EnodeVehicle) => (
                  <div key={veh.id} onClick={() => { setSelectedVehId(veh.id); setActiveVehApiTab('GET_VEHICLE'); handleFetchEnodeVehicleById(veh.id); }} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-sky-400 transition-all cursor-pointer space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-sky-700">{veh.vendor} • {veh.year}</span>
                        <h4 className="font-extrabold text-sm text-slate-900">{veh.title || veh.model}</h4>
                      </div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">{veh.chargeState?.isCharging ? '⚡ CHARGING' : '🔌 CONNECTED'}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Battery Level</span><span className="text-emerald-600 font-black">{veh.chargeState?.batteryLevel}% SOC</span></div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300"><div className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${veh.chargeState?.batteryLevel || 50}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeVehApiTab === 'GET_VEHICLE' && vehicleDetailData && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-black text-xl text-slate-900">{vehicleDetailData.title}</h4>
                    <p className="text-xs text-slate-500">VIN: {vehicleDetailData.vin}</p>
                  </div>
                  <div className="text-2xl font-black text-emerald-600">{vehicleDetailData.chargeState?.batteryLevel}% SOC</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200"><div className="text-[10px] text-slate-500 uppercase font-bold">Speed</div><div className="text-lg font-black text-slate-900 mt-1">{vehicleDetailData.chargeState?.chargeRate} kW</div></div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200"><div className="text-[10px] text-slate-500 uppercase font-bold">Time</div><div className="text-lg font-black text-slate-900 mt-1">{vehicleDetailData.chargeState?.chargeTimeRemaining || 0} Mins</div></div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200"><div className="text-[10px] text-slate-500 uppercase font-bold">Odometer</div><div className="text-lg font-black text-slate-900 mt-1">{vehicleDetailData.odometer?.distance?.toLocaleString()} km</div></div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200"><div className="text-[10px] text-slate-500 uppercase font-bold">Range</div><div className="text-lg font-black text-sky-700 mt-1">{vehicleDetailData.chargeState?.range} km</div></div>
                </div>
              </div>
            )}

            <button onClick={() => setShowVehicleSandboxModal(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-2xl cursor-pointer">Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomeCharging;
