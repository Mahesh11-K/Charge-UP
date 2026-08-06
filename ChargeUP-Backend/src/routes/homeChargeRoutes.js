// src/routes/homeChargeRoutes.js
const express = require('express');
const router = express.Router();
const homeChargeController = require('../controllers/homeChargeController');

// Authentication & Linking Endpoints
router.post('/oauth/token', homeChargeController.obtainOAuthToken);
router.post('/users/:userId/link-session', homeChargeController.createLinkSession);

// Charger Inventory & Telemetry
router.get('/dashboard/summary', homeChargeController.getDashboardSummary);
router.get('/chargers', homeChargeController.getDublinHomeChargers);
router.get('/chargers/:id', homeChargeController.getChargerById);

// Charger Control & Operational Configuration
router.post('/chargers/:id/charge', homeChargeController.controlChargerAction);
router.post('/chargers/:id/charge-limit', homeChargeController.setChargerCurrentLimit);
router.put('/chargers/:id/smart-charging-policy', homeChargeController.updateSmartPolicy);
router.post('/chargers/:id/cable-lock', homeChargeController.toggleCableLock);
router.post('/chargers/:id/diagnostics', homeChargeController.runHardwareDiagnostics);

// Enode API Sandbox Testing, Vehicle Telemetry & Webhooks
router.get('/vehicles', homeChargeController.getEnodeVehicles);
router.get('/vehicles/:vehicleId', homeChargeController.getEnodeVehicleById);
router.get('/enode/vehicles', homeChargeController.getEnodeVehicles);
router.get('/enode/vehicles/:vehicleId', homeChargeController.getEnodeVehicleById);

router.get('/sandbox/config', homeChargeController.getSandboxConfig);
router.post('/sandbox/webhooks/simulate', homeChargeController.simulateWebhookEvent);
router.post('/webhooks/enode', homeChargeController.receiveEnodeWebhook);

module.exports = router;


