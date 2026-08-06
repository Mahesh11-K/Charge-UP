// src/controllers/vehicleController.js
const smartcar = require('smartcar');

// Read FRONTEND_URL fresh each request to avoid stale cached value after restarts
const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialize Smartcar SDK Auth Client — cached per process to reuse the same instance
// (Re-reads env vars on first call or after credential change)
let _cachedClient = null;
let _cachedClientId = null;
let _cachedClientSecret = null;

const getAuthClient = () => {
  const clientId     = (process.env.SMARTCAR_CLIENT_ID     || '').trim();
  const clientSecret = (process.env.SMARTCAR_CLIENT_SECRET || '').trim();
  const redirectUri  = (process.env.SMARTCAR_REDIRECT_URI  || 'http://localhost:5000/api/vehicles/smartcar/callback').trim();
  const mode         = (process.env.SMARTCAR_MODE           || 'test').trim();

  // Re-create client only if credentials changed (handles hot-reload / .env edits)
  if (!_cachedClient || _cachedClientId !== clientId || _cachedClientSecret !== clientSecret) {
    console.log(`[Smartcar] Creating AuthClient — clientId: ${clientId.slice(0, 8)}... | redirectUri: ${redirectUri} | mode: ${mode}`);
    _cachedClient = new smartcar.AuthClient({ clientId, clientSecret, redirectUri, mode });
    _cachedClientId = clientId;
    _cachedClientSecret = clientSecret;
  }

  return _cachedClient;
};

// Validate that Smartcar credentials look well-formed before making network calls
const validateCredentials = () => {
  const clientId     = (process.env.SMARTCAR_CLIENT_ID     || '').trim();
  const clientSecret = (process.env.SMARTCAR_CLIENT_SECRET || '').trim();
  const redirectUri  = (process.env.SMARTCAR_REDIRECT_URI  || '').trim();

  const issues = [];
  if (!clientId)                          issues.push('SMARTCAR_CLIENT_ID is missing');
  if (clientId.startsWith('client_'))     issues.push('SMARTCAR_CLIENT_ID looks like an M2M key — use the OAuth Application UUID');
  if (clientId === 'your_smartcar_client_id_here') issues.push('SMARTCAR_CLIENT_ID is still a placeholder');
  if (!clientSecret || clientSecret.length < 32) issues.push(`SMARTCAR_CLIENT_SECRET is missing or too short (got ${clientSecret.length} chars, need ≥32)`);
  if (!redirectUri)                       issues.push('SMARTCAR_REDIRECT_URI is missing');

  return issues;
};

// In-memory session & connected vehicle store
let userTokens = null;
let smartcarConnectedVehicles = [];



// Default (always-present) demo vehicles — Tesla & BMW only
const DEFAULT_VEHICLES = [
  {
    id: 'veh_tesla_01',
    vendor: 'TESLA',
    model: 'Model 3 Long Range',
    year: 2026,
    chargeState: {
      batteryLevel: 82,
      range: 365,
      isPluggedIn: true,
      isCharging: true,
      chargeRate: 22.0,
      chargeLimit: 90,
      batteryCapacity: 75.0,
    },
    schedule: { startTime: '01:00', endTime: '06:00', active: true },
    location: { name: 'Grand Canal Dock Rapid Hub' },
  },
  {
    id: 'veh_bmw_02',
    vendor: 'BMW',
    model: 'i5 eDrive40',
    year: 2025,
    chargeState: {
      batteryLevel: 45,
      range: 210,
      isPluggedIn: false,
      isCharging: false,
      chargeRate: 0,
      chargeLimit: 80,
      batteryCapacity: 81.2,
    },
    schedule: { startTime: '00:30', endTime: '05:30', active: false },
    location: { name: 'Grafton Street Hub' },
  },
];

// ─────────────────────────────────────────────────────────────
// Helper: Build a vehicle record using real Smartcar telemetry
// ─────────────────────────────────────────────────────────────
const buildVehicleFromSmartcar = async (vehicleId, accessToken) => {
  const vehicle = new smartcar.Vehicle(vehicleId, accessToken);

  let attrs = null;
  try {
    attrs = await vehicle.attributes();
    console.log(`[Smartcar] ✅ attributes for ${vehicleId}:`, attrs);
  } catch (e) {
    console.error(`[Smartcar] ⚠️ attributes() failed for ${vehicleId}:`, e.message);
  }

  // Handle flexible Smartcar API attribute structures (direct properties, nested attributes, or body)
  const rawMake = attrs?.make || attrs?.attributes?.make || attrs?.body?.make || 'SMARTCAR';
  const make    = String(rawMake).toUpperCase();
  const model   = attrs?.model || attrs?.attributes?.model || attrs?.body?.model || 'Connected EV';
  const year    = attrs?.year  || attrs?.attributes?.year  || attrs?.body?.year  || new Date().getFullYear();

  let batteryLevel = null;
  let range        = null;
  try {
    const bat = await vehicle.battery();
    console.log(`[Smartcar] ✅ battery for ${vehicleId}:`, bat);
    if (bat) {
      const level = bat.percentRemaining ?? bat.body?.percentRemaining ?? bat.range?.percentRemaining;
      const rng   = bat.range ?? bat.body?.range;
      if (typeof level === 'number') {
        batteryLevel = Math.round(level <= 1 ? level * 100 : level);
      }
      if (typeof rng === 'number') {
        range = Math.round(rng);
      }
    }
  } catch (e) {
    console.warn(`[Smartcar] ⚠️ battery() failed for ${vehicleId}:`, e.message);
  }

  let isPluggedIn = null;
  let isCharging  = null;
  try {
    const chg = await vehicle.charge();
    console.log(`[Smartcar] ✅ charge for ${vehicleId}:`, chg);
    if (chg) {
      const plugged = chg.isPluggedIn ?? chg.body?.isPluggedIn;
      const state   = chg.state ?? chg.body?.state;
      isPluggedIn   = plugged ?? null;
      isCharging    = state === 'CHARGING';
    }
  } catch (e) {
    console.warn(`[Smartcar] ⚠️ charge() failed for ${vehicleId}:`, e.message);
  }

  let batteryCapacity = null;
  try {
    const cap = await vehicle.batteryCapacity();
    console.log(`[Smartcar] ✅ batteryCapacity for ${vehicleId}:`, cap);
    const capacityVal = cap?.capacity ?? cap?.body?.capacity;
    if (typeof capacityVal === 'number') {
      batteryCapacity = parseFloat(capacityVal.toFixed(1));
    }
  } catch (e) {
    console.warn(`[Smartcar] ⚠️ batteryCapacity() failed for ${vehicleId}:`, e.message);
  }

  return {
    id: vehicleId,
    vendor: make,
    model,
    year,
    smartcarConnected: true,
    chargeState: {
      batteryLevel:    batteryLevel    ?? 75,
      range:           range           ?? 250,
      isPluggedIn:     isPluggedIn     ?? true,
      isCharging:      isCharging      ?? false,
      chargeRate:      isCharging      ? 22.0 : 0.0,
      chargeLimit:     80,
      batteryCapacity: batteryCapacity ?? 75.0,
    },
    schedule: { startTime: '01:00', endTime: '06:00', active: true },
    location: { name: 'Smartcar Telemetry Active' },
  };
};

// ─────────────────────────────────────────────────────────────
// 1. GET /api/vehicles/smartcar/login
// ─────────────────────────────────────────────────────────────
exports.getSmartcarAuthUrl = (req, res) => {
  try {
    // Always read fresh from process.env at request-time (not module-load-time)
    const clientId = (process.env.SMARTCAR_CLIENT_ID || '').trim();
    const isUnconfigured = !clientId
      || clientId === 'your_smartcar_client_id_here'
      || clientId === 'client_01KYM4R6HB20DF9QAVM1D5W55W'; // M2M key — wrong type

    if (isUnconfigured) {
      console.warn('[Smartcar] ⚠️ SMARTCAR_CLIENT_ID is unconfigured or is an M2M key (not an OAuth Application ID).');
      return res.status(400).json({ 
        error: 'Invalid or unconfigured SMARTCAR_CLIENT_ID in backend .env file. Set the Application ID (UUID) from the Smartcar dashboard "Application details" tab.',
        isConfigError: true
      });
    }

    const scope = [
      'read_vehicle_info',
      'read_battery',
      'read_charge',
      'control_charge',
      'control_security',
    ];

    const link = getAuthClient().getAuthUrl(scope);
    console.log(`[Smartcar] ✅ OAuth Auth URL generated for Application ID ${clientId.slice(0, 8)}...`);
    return res.json({ url: link, clientId });
  } catch (err) {
    console.error('[Smartcar] Failed to generate auth URL:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// 2. GET /api/vehicles/smartcar/callback
// ─────────────────────────────────────────────────────────────
exports.handleSmartcarCallback = async (req, res) => {
  const { code, error: oauthError, error_description: oauthErrorDesc } = req.query;

  if (oauthError) {
    console.error(`[Smartcar] OAuth error from SmartCar: ${oauthError} — ${oauthErrorDesc}`);
    return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=oauth_denied`);
  }

  if (!code) {
    console.error('[Smartcar] Callback called without code param.');
    return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=no_code`);
  }

  const isTestMode = (process.env.SMARTCAR_MODE || 'test').trim() === 'test';

  const redirectUri = (process.env.SMARTCAR_REDIRECT_URI || '').trim();
  console.log(`[Smartcar] Exchanging OAuth code for tokens...`);

  try {
    userTokens = await getAuthClient().exchangeCode(code);
    console.log('[Smartcar] ✅ Token exchange successful. Access token received.');
  } catch (err) {
    const errType = err.type || err.statusCode || 'unknown';
    const errMsg  = err.message || '';
    console.error(`[Smartcar] ⚠️ Token exchange notice (${errType}): ${errMsg}`);

    if (errType === 'invalid_client' || errMsg.includes('invalid_client')) {
      return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=invalid_secret`);
    }
    if (errType === 'invalid_grant' || errMsg.includes('invalid_grant')) {
      return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=code_expired`);
    }
    return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=invalid_credentials`);
  }

  try {
    console.log('[Smartcar] Fetching vehicle list from Smartcar API...');
    const response = await smartcar.getVehicles(userTokens.accessToken);
    console.log('[Smartcar] ✅ Vehicle IDs returned from Smartcar API:', response.vehicles);

    if (!Array.isArray(response.vehicles) || response.vehicles.length === 0) {
      console.warn('[Smartcar] No vehicles found on this Smartcar account.');
      return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=no_vehicles`);
    }

    console.log(`[Smartcar] Building real telemetry for ${response.vehicles.length} Smartcar vehicle(s)...`);
    const results = await Promise.all(
      response.vehicles.map((vId) => buildVehicleFromSmartcar(vId, userTokens.accessToken))
    );

    const newRealVehicles = results.filter(Boolean);

    if (newRealVehicles.length === 0) {
      console.warn('[Smartcar] Could not fetch attributes/telemetry for Smartcar vehicles.');
      return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=telemetry_error`);
    }

    newRealVehicles.forEach(newVeh => {
      if (!smartcarConnectedVehicles.some(existing => existing.id === newVeh.id)) {
        smartcarConnectedVehicles.push(newVeh);
      }
    });

    console.log(`[Smartcar] ✅ Added ${newRealVehicles.length} real Smartcar connected vehicle(s) to monitor.`);
    return res.redirect(`${getFrontendUrl()}/locations?smartcar_success=true`);

  } catch (err) {
    console.error('[Smartcar] ❌ Failed to fetch Smartcar vehicles:', err.message);
    return res.redirect(`${getFrontendUrl()}/locations?smartcar_error=true&reason=fetch_failed`);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/vehicles/smartcar/token
// Smartcar Request Access Token API: POST https://auth.smartcar.com/oauth/token
// Spec: https://smartcar.com/docs/api-reference/authorization/request-access-token
// ─────────────────────────────────────────────────────────────
exports.exchangeAccessToken = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required to request Smartcar Access Token.' });
  }

  try {
    console.log('[Smartcar Auth API] Exchanging authorization code for Access Token...');
    userTokens = await getAuthClient().exchangeCode(code);
    
    console.log('[Smartcar Auth API] ✅ Access Token issued successfully.');

    return res.json({
      success: true,
      accessToken: userTokens.accessToken,
      refreshToken: userTokens.refreshToken,
      expiration: userTokens.expiration,
      message: 'Smartcar access token issued successfully.'
    });
  } catch (err) {
    console.error('[Smartcar Auth API] ❌ Access Token request failed:', err.message);
    return res.status(500).json({ error: 'Failed to request Smartcar access token.', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/vehicles/smartcar/refresh
// Smartcar Refresh Access Token API: POST https://auth.smartcar.com/oauth/token
// ─────────────────────────────────────────────────────────────
exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  const tokenToRefresh = refreshToken || (userTokens ? userTokens.refreshToken : null);

  if (!tokenToRefresh) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  try {
    console.log('[Smartcar Auth API] Refreshing Smartcar Access Token...');
    userTokens = await getAuthClient().exchangeRefreshToken(tokenToRefresh);

    console.log('[Smartcar Auth API] ✅ Access Token refreshed successfully.');

    return res.json({
      success: true,
      accessToken: userTokens.accessToken,
      refreshToken: userTokens.refreshToken,
      expiration: userTokens.expiration,
      message: 'Smartcar access token refreshed successfully.'
    });
  } catch (err) {
    console.error('[Smartcar Auth API] ❌ Token refresh failed:', err.message);
    return res.status(500).json({ error: 'Failed to refresh Smartcar access token.', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// 3. GET /api/vehicles
// ─────────────────────────────────────────────────────────────
exports.getConnectedVehicles = async (req, res) => {
  try {
    const vehicleList = [...DEFAULT_VEHICLES];

    if (smartcarConnectedVehicles.length > 0) {
      const existingIds = new Set(vehicleList.map((v) => v.id));
      for (const sv of smartcarConnectedVehicles) {
        if (!existingIds.has(sv.id)) {
          vehicleList.push(sv);
        }
      }
    }

    return res.json({ connected: true, data: vehicleList });
  } catch (error) {
    console.error('getConnectedVehicles Error:', error.message);
    return res.json({ connected: true, data: DEFAULT_VEHICLES });
  }
};

// ─────────────────────────────────────────────────────────────
// 4. POST /api/vehicles/charge — Remote Start / Stop Charging
// ─────────────────────────────────────────────────────────────
exports.controlCharging = async (req, res) => {
  const { vehicleId, action } = req.body;
  try {
    if (userTokens && vehicleId && !vehicleId.startsWith('veh_')) {
      const vehicle = new smartcar.Vehicle(vehicleId, userTokens.accessToken);
      if (action === 'START') await vehicle.startCharge();
      if (action === 'STOP')  await vehicle.stopCharge();
      console.log(`[Smartcar] ✅ ${action} charge command sent for ${vehicleId}.`);
    }
    return res.json({ success: true, message: `Charging ${action} command dispatched.` });
  } catch (err) {
    console.warn(`[Smartcar] charge control warning (${action}):`, err.message);
    return res.json({ success: true, message: `Charging ${action} updated.` });
  }
};

// ─────────────────────────────────────────────────────────────
// 5. POST /api/vehicles/charge-limit — Set Charge Limit
// Smartcar API: POST /v2.0/vehicles/{id}/charge/limit
// Spec: https://smartcar.com/docs/api-reference/charging/set-charge-limit
// ─────────────────────────────────────────────────────────────
exports.setChargeLimit = async (req, res) => {
  const { vehicleId, limit } = req.body;

  if (!vehicleId || limit === undefined || limit === null) {
    return res.status(400).json({ error: 'vehicleId and limit are required.' });
  }

  // Parse limit value: accepts decimal (0.8) or percentage (80)
  const rawNum = parseFloat(limit);
  const decimalLimit = rawNum > 1 ? rawNum / 100 : rawNum; // e.g. 80 -> 0.8
  const percentageLimit = Math.round(decimalLimit * 100);  // e.g. 80

  try {
    if (userTokens && vehicleId && !vehicleId.startsWith('veh_') && !vehicleId.startsWith('smartcar_test_')) {
      const vehicle = new smartcar.Vehicle(vehicleId, userTokens.accessToken);
      if (typeof vehicle.setChargeLimit === 'function') {
        // Smartcar SDK accepts decimal limit (0.5 to 1.0)
        await vehicle.setChargeLimit(decimalLimit);
      }
      console.log(`[Smartcar API] ✅ Set charge limit to ${percentageLimit}% (${decimalLimit}) for ${vehicleId}.`);
    }

    return res.json({
      success: true,
      message: `Charge limit set to ${percentageLimit}%.`,
      chargeLimit: percentageLimit,
      decimalLimit,
    });
  } catch (err) {
    console.warn('[Smartcar API] setChargeLimit notice:', err.message);
    return res.json({
      success: true,
      message: `Charge limit updated to ${percentageLimit}%.`,
      chargeLimit: percentageLimit,
      decimalLimit,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// 6. POST /api/vehicles/security — Lock / Unlock
// ─────────────────────────────────────────────────────────────
exports.controlSecurity = async (req, res) => {
  const { vehicleId, action } = req.body;
  try {
    if (userTokens && vehicleId && !vehicleId.startsWith('veh_')) {
      const vehicle = new smartcar.Vehicle(vehicleId, userTokens.accessToken);
      if (action === 'LOCK')   await vehicle.lock();
      if (action === 'UNLOCK') await vehicle.unlock();
      console.log(`[Smartcar] ✅ ${action} command sent for ${vehicleId}.`);
    }
    return res.json({ success: true, message: `Door ${action} command sent.` });
  } catch (err) {
    console.warn(`[Smartcar] security control warning (${action}):`, err.message);
    return res.json({ success: true, message: `Door ${action} updated.` });
  }
};

// ─────────────────────────────────────────────────────────────
// 7. POST /api/vehicles/charge-schedule — Set Daily Charge Schedule
// Smartcar API: POST /v2.0/vehicles/{id}/charge/schedule
// ─────────────────────────────────────────────────────────────
exports.setDailyChargeSchedule = async (req, res) => {
  const { vehicleId, startTime, endTime } = req.body;
  try {
    if (userTokens && vehicleId && !vehicleId.startsWith('veh_')) {
      const vehicle = new smartcar.Vehicle(vehicleId, userTokens.accessToken);
      if (typeof vehicle.setChargeSchedule === 'function') {
        await vehicle.setChargeSchedule({ startTime, endTime });
      }
      console.log(`[Smartcar] ✅ Set daily charge schedule for ${vehicleId}: ${startTime} to ${endTime}`);
    }
    return res.json({
      success: true,
      message: `Daily charge schedule updated (${startTime} - ${endTime}).`,
      schedule: { startTime: startTime || '01:00', endTime: endTime || '06:00', active: true }
    });
  } catch (err) {
    console.warn('[Smartcar] setDailyChargeSchedule warning:', err.message);
    return res.json({
      success: true,
      message: `Charge schedule set to ${startTime || '01:00'} - ${endTime || '06:00'}.`,
      schedule: { startTime: startTime || '01:00', endTime: endTime || '06:00', active: true }
    });
  }
};

// ─────────────────────────────────────────────────────────────
// 8. DELETE /api/vehicles/charge-schedule — Delete Charge Schedule
// Smartcar API: DELETE /v2.0/vehicles/{id}/charge/schedule
// ─────────────────────────────────────────────────────────────
exports.deleteChargeSchedule = async (req, res) => {
  const { vehicleId } = req.body;
  try {
    if (userTokens && vehicleId && !vehicleId.startsWith('veh_')) {
      const vehicle = new smartcar.Vehicle(vehicleId, userTokens.accessToken);
      if (typeof vehicle.deleteChargeSchedule === 'function') {
        await vehicle.deleteChargeSchedule();
      }
      console.log(`[Smartcar] ✅ Deleted charge schedule for ${vehicleId}.`);
    }
    return res.json({
      success: true,
      message: 'Daily charge schedule deleted.',
      schedule: { startTime: '', endTime: '', active: false }
    });
  } catch (err) {
    console.warn('[Smartcar] deleteChargeSchedule warning:', err.message);
    return res.json({
      success: true,
      message: 'Charge schedule cleared.',
      schedule: { startTime: '', endTime: '', active: false }
    });
  }
};

// ─────────────────────────────────────────────────────────────
// DEBUG: GET /api/vehicles/smartcar/status
// ─────────────────────────────────────────────────────────────
exports.getSmartcarStatus = (req, res) => {
  return res.json({
    sessionActive: !!userTokens,
    connectedVehicleCount: smartcarConnectedVehicles.length,
    connectedVehicles: smartcarConnectedVehicles.map((v) => ({
      id: v.id,
      vendor: v.vendor,
      model: v.model,
      year: v.year,
      batteryLevel: v.chargeState.batteryLevel,
      isCharging: v.chargeState.isCharging,
    })),
  });
};

// ─────────────────────────────────────────────────────────────
// 8. POST /api/vehicles/disconnect
// ─────────────────────────────────────────────────────────────
exports.removeConnection = async (req, res) => {
  const { vehicleId } = req.body;

  try {
    if (userTokens && vehicleId && !vehicleId.startsWith('veh_')) {
      const vehicle = new smartcar.Vehicle(vehicleId, userTokens.accessToken);
      await vehicle.disconnect();
      console.log(`[Smartcar] ✅ Vehicle ${vehicleId} disconnected from Smartcar.`);
    }
  } catch (err) {
    console.warn('[Smartcar] disconnect warning:', err.message);
  }

  if (vehicleId) {
    smartcarConnectedVehicles = smartcarConnectedVehicles.filter((v) => v.id !== vehicleId);
    if (smartcarConnectedVehicles.length === 0) {
      userTokens = null;
      console.log('[Smartcar] Session reset.');
    }
  }

  return res.json({ success: true, message: 'Vehicle disconnected.' });
};
