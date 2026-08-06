// src/app.js
// Load .env FIRST, before any other require — override:true ensures nodemon restarts
// always pick up the latest values instead of inheriting stale ones from the parent process.
require('dotenv').config({ override: true });

// ── Startup Environment Validation ─────────────────────────────────────────
(function validateEnv() {
  const clientId = (process.env.SMARTCAR_CLIENT_ID || '').trim();
  const clientSecret = (process.env.SMARTCAR_CLIENT_SECRET || '').trim();

  const isMissingId     = !clientId;
  const isM2MKey        = clientId.startsWith('client_');
  const isPlaceholder   = clientId === 'your_smartcar_client_id_here';
  const isMissingSecret = !clientSecret;

  if (isMissingId || isPlaceholder) {
    console.error('🚨 SMARTCAR_CLIENT_ID is missing or set to placeholder in .env file.');
  }
  if (isM2MKey) {
    console.error('🚨 SMARTCAR_CLIENT_ID looks like an M2M key. Use Application ID (UUID).');
  }
  if (isMissingSecret) {
    console.error('🚨 SMARTCAR_CLIENT_SECRET is missing in .env file.');
  }
})();
// ───────────────────────────────────────────────────────────────────────────

const express = require('express');
const cors = require('cors');

// Import database instance from database.js
const sequelize = require('./config/database');
require('./models'); // Register model definitions

const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const homeChargeRoutes = require('./routes/homeChargeRoutes');
const initWebSocket = require('./websocket/socketServer');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// ⚡ ROOT WELCOME ROUTE
app.get('/', (req, res) => {
  res.json({
    message: '⚡ Welcome to ChargeUP Backend REST API!',
    status: 'Server Active',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      stations: '/api/stations',
      vehicles: '/api/vehicles',
      reviews: '/api/reviews',
      homeCharging: '/api/home-charging'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/home-charging', homeChargeRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Launch HTTP & WebSocket servers
const server = app.listen(PORT, () => {
  console.log(`🚀 REST HTTP Server running on http://localhost:${PORT}`);
});

initWebSocket(server);

// ⚡ Automatic Database Migration & Safe Table Sync on Boot
(async () => {
  try {
    // Standard safe sync without { alter: true } to prevent duplicate index key bloat
    await sequelize.sync();
    console.log('✅ Database models synchronized successfully.');
  } catch (syncErr) {
    console.warn('⚠️ Database sync notice:', syncErr.message);
  }
})();