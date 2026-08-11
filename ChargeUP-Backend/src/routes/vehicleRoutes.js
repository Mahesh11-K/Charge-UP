// src/routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/smartcar/login',      vehicleController.getSmartcarAuthUrl);
router.get('/smartcar/callback',   vehicleController.handleSmartcarCallback);
router.get('/smartcar/status',     vehicleController.getSmartcarStatus);

// Smartcar Access Token & Refresh Endpoints  
router.post('/smartcar/token',   vehicleController.exchangeAccessToken);
router.post('/smartcar/refresh', vehicleController.refreshAccessToken);

router.get('/',                  vehicleController.getConnectedVehicles);
router.post('/charge',           vehicleController.controlCharging);
router.post('/charge-limit',     vehicleController.setChargeLimit);
router.post('/security',         vehicleController.controlSecurity);

// Smartcar Daily Charge Schedule Endpoints
router.post('/charge-schedule',   vehicleController.setDailyChargeSchedule);
router.delete('/charge-schedule', vehicleController.deleteChargeSchedule);

router.post('/disconnect',       vehicleController.removeConnection);
router.delete('/disconnect',     vehicleController.removeConnection);

module.exports = router;