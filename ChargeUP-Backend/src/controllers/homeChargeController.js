// src/controllers/homeChargeController.js

/**
 * Clean & Minimal Enode Operations Controller
 * Manages Home Chargers & EV Vehicle Telemetry in Dublin Region
 */

const DUBLIN_HOME_CHARGERS = [
  {
    id: "chg_dub_001",
    name: "Ballsbridge Residential Hub",
    address: "24 Pembroke Road, Ballsbridge, Dublin 4",
    eircode: "D04 H5R2",
    cityRegion: "Dublin 4",
    lat: 53.3325,
    lng: -6.2341,
    brand: "ChargeUP Nectar",
    model: "Nectar Smart Home Pro",
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
    sessionEnergyKwh: 14.8,
    totalEnergyKwh: 1990.0,
    sessionDurationMins: 130,
    costPerKwh: 0.35,
    currentSessionCostEur: 5.18,
    smartPolicy: {
      mode: "DYNAMIC_BALANCED",
      offPeakStart: "23:00",
      offPeakEnd: "08:00",
      solarMatchingEnabled: true,
      dynamicLoadBalancing: true,
      targetBatterySoc: 85,
      targetDepartureTime: "07:15"
    },
    ownerName: "Orla McCarthy",
    evModelConnected: "Polestar 2 Long Range"
  }
];

const ENODE_VEHICLES = [
  { id: "veh_dub_001", userId: "user_dublin_driver_01", chargerId: "chg_dub_001", vendor: "Tesla", model: "Model 3 Long Range", year: 2024, title: "Liam's Tesla Model 3", vin: "5YJ3E1EA8PF123456", batteryCapacityKwh: 82.0, batteryLevelPct: 78, estimatedRangeKm: 385 },
  { id: "veh_dub_002", userId: "user_dublin_driver_02", chargerId: "chg_dub_002", vendor: "Hyundai", model: "Ioniq 5 (77kWh)", year: 2023, title: "Siobhán's Ioniq 5", vin: "KM8K23AG5PU987654", batteryCapacityKwh: 77.4, batteryLevelPct: 65, estimatedRangeKm: 310 },
  { id: "veh_dub_003", userId: "user_dublin_driver_03", chargerId: "chg_dub_003", vendor: "Volkswagen", model: "ID.4 Pro", year: 2024, title: "Ciarán's Volkswagen ID.4", vin: "WVWZZZE1ZRP112233", batteryCapacityKwh: 77.0, batteryLevelPct: 42, estimatedRangeKm: 215 },
  { id: "veh_dub_004", userId: "user_dublin_driver_04", chargerId: "chg_dub_004", vendor: "BMW", model: "i4 eDrive40", year: 2023, title: "Fiona's BMW i4", vin: "WBA31AW050FP44556", batteryCapacityKwh: 83.9, batteryLevelPct: 88, estimatedRangeKm: 440 },
  { id: "veh_dub_005", userId: "user_dublin_driver_05", chargerId: "chg_dub_005", vendor: "Nissan", model: "Leaf e+", year: 2022, title: "Darragh's Nissan Leaf", vin: "JN1FAAZEOU0667788", batteryCapacityKwh: 62.0, batteryLevelPct: 54, estimatedRangeKm: 220 },
  { id: "veh_dub_006", userId: "user_dublin_driver_06", chargerId: "chg_dub_006", vendor: "Kia", model: "EV6 GT-Line", year: 2024, title: "Aoife's Kia EV6", vin: "KNAE25A90P5990011", batteryCapacityKwh: 77.4, batteryLevelPct: 71, estimatedRangeKm: 360 },
  { id: "veh_dub_007", userId: "user_dublin_driver_07", chargerId: "chg_dub_007", vendor: "Audi", model: "Q4 e-tron", year: 2023, title: "Eoin's Audi Q4", vin: "WAUZZZFZ9RP223344", batteryCapacityKwh: 82.0, batteryLevelPct: 60, estimatedRangeKm: 325 },
  { id: "veh_dub_008", userId: "user_dublin_driver_08", chargerId: "chg_dub_008", vendor: "Tesla", model: "Model Y Performance", year: 2024, title: "Maeve's Tesla Model Y", vin: "7SAXCBE53PF556677", batteryCapacityKwh: 82.0, batteryLevelPct: 92, estimatedRangeKm: 455 },
  { id: "veh_dub_009", userId: "user_dublin_driver_09", chargerId: "chg_dub_009", vendor: "Peugeot", model: "e-208", year: 2023, title: "Cormac's Peugeot e-208", vin: "VF3UHZKK2PW889900", batteryCapacityKwh: 50.0, batteryLevelPct: 35, estimatedRangeKm: 140 },
  { id: "veh_dub_010", userId: "user_dublin_driver_10", chargerId: "chg_dub_010", vendor: "Polestar", model: "Polestar 2 Long Range", year: 2024, title: "Orla's Polestar 2", vin: "YV1VS00C1P1334455", batteryCapacityKwh: 78.0, batteryLevelPct: 79, estimatedRangeKm: 395 }
];

let liveChargers = JSON.parse(JSON.stringify(DUBLIN_HOME_CHARGERS));

// Helper: Format Enode Vehicle Telemetry
function formatVehicleData(v, charger) {
  const isCharging = charger ? (charger.chargeState === 'CHARGING' || charger.chargeState === 'SOLAR_ECO') : false;
  return {
    id: v.id,
    userId: v.userId,
    chargerId: v.chargerId,
    vendor: v.vendor,
    model: v.model,
    year: v.year,
    title: v.title,
    vin: v.vin,
    chargeState: {
      isCharging,
      isPluggedIn: charger ? charger.isPluggedIn : true,
      chargeRate: charger ? charger.currentPowerKw : 0,
      chargeLimit: charger?.smartPolicy?.targetBatterySoc || 80,
      batteryLevel: v.batteryLevelPct,
      batteryCapacity: v.batteryCapacityKwh,
      chargeTimeRemaining: isCharging && charger.currentPowerKw > 0 ? Math.round((((charger.smartPolicy.targetBatterySoc - v.batteryLevelPct) / 100) * v.batteryCapacityKwh / charger.currentPowerKw) * 60) : 0,
      range: v.estimatedRangeKm
    },
    location: { latitude: charger ? charger.lat : 53.3325, longitude: charger ? charger.lng : -6.2341, lastUpdated: new Date().toISOString() },
    odometer: { distance: 20000, unit: "km" },
    homeStation: charger ? { id: charger.id, name: charger.name, brand: charger.brand } : null
  };
}

// ── MINIMAL ENODE OPERATIONS ──────────────────────────────────────────

exports.obtainOAuthToken = async (req, res) => {
  res.json({ access_token: `enode_at_${Date.now()}`, token_type: "Bearer", expires_in: 3600 });
};

exports.createLinkSession = async (req, res) => {
  const userId = req.params.userId || "user_dublin_driver_01";
  res.json({ linkToken: `enode_link_${Date.now()}`, linkUrl: `https://link.enode.io/v1/connect?token=demo`, userId });
};

exports.getDublinHomeChargers = async (req, res) => {
  const { cityRegion, brand, state } = req.query;
  let results = [...liveChargers];
  if (cityRegion && cityRegion !== 'ALL') results = results.filter(c => c.cityRegion.toLowerCase() === cityRegion.toLowerCase());
  if (brand) results = results.filter(c => c.brand.toLowerCase().includes(brand.toLowerCase()));
  if (state && state !== 'ALL') results = results.filter(c => c.chargeState.toLowerCase() === state.toLowerCase());
  res.json({ count: results.length, region: "Dublin, Ireland", chargers: results });
};

exports.getChargerById = async (req, res) => {
  const charger = liveChargers.find(c => c.id === req.params.id);
  if (!charger) return res.status(404).json({ error: "Charger not found" });
  res.json(charger);
};

exports.controlChargerAction = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const index = liveChargers.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Charger not found" });

  const c = liveChargers[index];
  if (action === 'START') { c.chargeState = 'CHARGING'; c.currentPowerKw = Number((c.maxPowerKw * 0.95).toFixed(1)); c.currentAmps = 29.5; }
  else if (action === 'PAUSE') { c.chargeState = 'PAUSED'; c.currentPowerKw = 0; c.currentAmps = 0; }
  else if (action === 'STOP') { c.chargeState = 'DISCONNECTED'; c.currentPowerKw = 0; c.currentAmps = 0; }
  else if (action === 'BOOST') { c.chargeState = 'CHARGING'; c.currentPowerKw = c.maxPowerKw; c.currentAmps = c.maxCurrentAmps; c.smartPolicy.mode = 'FAST_CHARGE'; }

  liveChargers[index] = c;
  res.json({ message: `Action [${action}] executed`, chargerId: c.id, updatedState: c.chargeState, currentPowerKw: c.currentPowerKw });
};

exports.setChargerCurrentLimit = async (req, res) => {
  const { id } = req.params;
  const { maxCurrentAmps } = req.body;
  const index = liveChargers.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Charger not found" });

  const c = liveChargers[index];
  const amps = Math.max(6, Math.min(32, Number(maxCurrentAmps || 32)));
  c.currentAmps = amps;
  c.currentPowerKw = Number(((230 * amps * (c.phases === 3 ? 1.732 : 1)) / 1000).toFixed(1));
  liveChargers[index] = c;
  res.json({ message: "Current limit updated", chargerId: c.id, currentAmps: c.currentAmps, currentPowerKw: c.currentPowerKw });
};

exports.updateSmartPolicy = async (req, res) => {
  const { id } = req.params;
  const index = liveChargers.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Charger not found" });

  const c = liveChargers[index];
  c.smartPolicy = { ...c.smartPolicy, ...req.body };
  if (req.body.mode === 'SOLAR_SURPLUS') { c.chargeState = 'SOLAR_ECO'; c.currentPowerKw = 4.2; }
  else if (req.body.mode === 'OFF_PEAK') { c.chargeState = 'SCHEDULED'; c.currentPowerKw = 0; }

  liveChargers[index] = c;
  res.json({ message: "Smart policy updated", chargerId: c.id, smartPolicy: c.smartPolicy });
};

exports.getDashboardSummary = async (req, res) => {
  const totalKW = liveChargers.reduce((s, c) => s + (c.currentPowerKw || 0), 0);
  const totalKwh = liveChargers.reduce((s, c) => s + (c.sessionEnergyKwh || 0), 0);
  const activeCount = liveChargers.filter(c => c.chargeState === 'CHARGING' || c.chargeState === 'SOLAR_ECO').length;

  res.json({
    metrics: {
      totalStations: liveChargers.length,
      chargingCount: activeCount,
      totalActivePowerKw: Number(totalKW.toFixed(1)),
      totalSessionEnergyKwh: Number(totalKwh.toFixed(1))
    }
  });
};

exports.toggleCableLock = async (req, res) => {
  const index = liveChargers.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Charger not found" });

  const c = liveChargers[index];
  c.isCableLocked = req.body.isCableLocked !== undefined ? Boolean(req.body.isCableLocked) : !c.isCableLocked;
  liveChargers[index] = c;
  res.json({ message: "Cable lock updated", chargerId: c.id, isCableLocked: c.isCableLocked });
};

exports.runHardwareDiagnostics = async (req, res) => {
  const charger = liveChargers.find(c => c.id === req.params.id);
  if (!charger) return res.status(404).json({ error: "Charger not found" });

  res.json({
    diagnostics: {
      chargerId: charger.id,
      name: charger.name,
      status: "HEALTHY",
      lineVoltage: `${charger.voltage || 230}V ±0.8%`,
      rcdSelfTest: "PASSED",
      cableLockMechanism: charger.isCableLocked ? "LOCKED" : "UNLOCKED",
      timestamp: new Date().toISOString()
    }
  });
};

exports.getEnodeVehicles = async (req, res) => {
  const { vendor } = req.query;
  let list = ENODE_VEHICLES.map(v => formatVehicleData(v, liveChargers.find(c => c.id === v.chargerId)));
  if (vendor && vendor !== 'ALL') list = list.filter(v => v.vendor.toLowerCase().includes(vendor.toLowerCase()));
  res.json({ count: list.length, data: list });
};

exports.getEnodeVehicleById = async (req, res) => {
  const v = ENODE_VEHICLES.find(x => x.id === req.params.vehicleId || x.chargerId === req.params.vehicleId);
  if (!v) return res.status(404).json({ error: "Vehicle not found" });
  res.json({ data: formatVehicleData(v, liveChargers.find(c => c.id === v.chargerId)) });
};

exports.getSandboxConfig = async (req, res) => {
  res.json({ environment: "sandbox", active: true });
};

exports.simulateWebhookEvent = async (req, res) => {
  res.json({ status: "SIMULATED_OK" });
};

exports.receiveEnodeWebhook = async (req, res) => {
  res.status(200).json({ status: "RECEIVED_OK" });
};
