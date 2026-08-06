// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// ⚡ Authentication & Profile Endpoints

// 1. User Registration (POST /api/auth/signup & /api/auth/register)
router.post('/signup', authController.signup);
router.post('/register', authController.register);

// 2. User Sign In / Login (POST /api/auth/signin & /api/auth/login)
router.post('/signin', authController.signin);
router.post('/login', authController.login);

// 3. Google OAuth Verification (POST /api/auth/google)
router.post('/google', authController.googleAuth);

// 4. Current User Context (GET /api/auth/me) - Guarded by JWT Middleware
router.get('/me', authenticateJWT, authController.getMe);

// 5. User Profile Management (GET & PUT /api/auth/profile) - Guarded by JWT Middleware
router.get('/profile', authenticateJWT, authController.getProfile);
router.put('/profile', authenticateJWT, authController.updateProfile);
router.post('/profile', authenticateJWT, authController.updateProfile);

// 6. Utility: Check Email Availability (POST /api/auth/check-email)
router.post('/check-email', authController.checkEmail);

// 7. User Sign Out (POST /api/auth/logout)
router.post('/logout', authController.logout);

module.exports = router;