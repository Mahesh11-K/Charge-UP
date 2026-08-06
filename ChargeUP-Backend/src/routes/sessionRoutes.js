const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// ⚡ Active Session Operations
router.post('/start', authenticateToken, sessionController.startSession);
router.post('/stop', authenticateToken, sessionController.stopSession);
router.post('/telemetry', authenticateToken, sessionController.updateTelemetry);

// 🔍 Driver Session Queries
router.get('/active', authenticateToken, sessionController.getActiveSession);
router.get('/history', authenticateToken, sessionController.getUserSessions);

module.exports = router;