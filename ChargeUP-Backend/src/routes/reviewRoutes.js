// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { getAllReviews, createReview } = require('../controllers/reviewController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Public route: Fetch all reviews
router.get('/', getAllReviews);

// Protected route: Post a review (verified logged-in users only)
router.post('/', authenticateJWT, createReview);

module.exports = router;
