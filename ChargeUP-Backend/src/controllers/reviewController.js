// src/controllers/reviewController.js
const { Review, User, UserProfile } = require('../models');

// Baseline dummy reviews to keep as initial show-off testimonials
const SEED_REVIEWS = [
  { id: -1, name: "Seán O'Connor", role: "Daily Commuter", location: "Dublin", rating: 5, comment: "The ultra-fast DC charger at Dublin Docklands saved my schedule today. Pulled 150 kW easily and got back on the road to Kildare in under 20 minutes. Highly recommend the app!", date: "2026-07-15", isVerified: true },
  { id: -2, name: "Aoife Murphy", role: "Tesla Model 3 Owner", location: "Cork", rating: 5, comment: "I use the Cork Central charging point every single week. Booking in advance via the Charge-UP app eliminates all range anxiety. Super reliable infrastructure.", date: "2026-07-12", isVerified: true },
  { id: -3, name: "Liam Fitzgerald", role: "Fleet Manager", location: "Galway", rating: 4, comment: "We transitioned our local delivery fleet to electric cars last winter. The network uptime has been great. Docking 1 star just because the Eyre Square spot gets very busy at lunch.", date: "2026-07-09", isVerified: true },
  { id: -4, name: "Róisín Byrne", role: "EV Roadtripper", location: "Belfast", rating: 5, comment: "Drove all the way from Kerry up to Belfast. The Charge-UP network coverage across the border areas is outstanding. Seamless payment integrations.", date: "2026-07-04", isVerified: true },
  { id: -5, name: "Conor Kelly", role: "Nissan Leaf Driver", location: "Limerick", rating: 4, comment: "Solid charging speeds and the app UI makes it simple to map out my trip. Clean station amenities nearby too.", date: "2026-06-28", isVerified: true },
  { id: -6, name: "Siobhán McCarthy", role: "Hotel Logistics Coordinator", location: "Waterford", rating: 5, comment: "Partnering with Charge-UP to install retail charging points at our resort has vastly boosted premium guest footfall. The software support is flawless.", date: "2026-06-22", isVerified: true },
  { id: -7, name: "Darragh Walsh", role: "Weekend Explorer", location: "Athlone", rating: 5, comment: "Perfect central node infrastructure in the Midlands. Whenever I am driving coast-to-coast across Ireland, Charge-UP is my definitive stop.", date: "2026-06-14", isVerified: true }
];

/**
 * Get all reviews (Database reviews + Baseline showcase reviews)
 */
const getAllReviews = async (req, res) => {
  try {
    const dbReviews = await Review.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['fullName'],
          include: [{ model: UserProfile, as: 'profile', attributes: ['city', 'evModel'] }]
        }
      ]
    });

    const formattedDbReviews = dbReviews.map(r => {
      const json = r.toJSON();
      return {
        id: json.id,
        name: json.name || json.User?.fullName || 'Verified EV Driver',
        role: json.role || json.User?.profile?.evModel || 'EV Driver',
        location: json.location || json.User?.profile?.city || 'Ireland',
        rating: json.rating,
        comment: json.comment,
        date: json.createdAt ? new Date(json.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        isVerified: json.isVerified ?? true
      };
    });

    // Merge database reviews with seed showcase reviews so baseline show-off testimonials remain
    const combinedReviews = [...formattedDbReviews, ...SEED_REVIEWS];

    return res.status(200).json({
      success: true,
      count: combinedReviews.length,
      reviews: combinedReviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    // Fallback to seed reviews if DB is unavailable
    return res.status(200).json({
      success: true,
      count: SEED_REVIEWS.length,
      reviews: SEED_REVIEWS
    });
  }
};

/**
 * Create a new driver review (Authenticated Users Only)
 */
const createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to submit a review.'
      });
    }

    const { rating, comment, role, location } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid rating between 1 and 5 stars.'
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Review text cannot be empty.'
      });
    }

    // Fetch user details to automatically pull user name and profile info
    const user = await User.findByPk(userId, {
      include: [{ model: UserProfile, as: 'profile' }]
    });

    const reviewerName = user ? user.fullName : (req.user.fullName || 'EV Driver');
    const reviewerRole = (role && role.trim()) ? role.trim() : (user?.profile?.evModel || 'Verified EV Driver');
    const reviewerLocation = (location && location.trim()) ? location.trim() : (user?.profile?.city || 'Ireland');

    const newReview = await Review.create({
      userId,
      name: reviewerName,
      role: reviewerRole,
      location: reviewerLocation,
      rating: parseInt(rating, 10),
      comment: comment.trim(),
      isVerified: true
    });

    const formattedReview = {
      id: newReview.id,
      name: newReview.name,
      role: newReview.role,
      location: newReview.location,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date(newReview.createdAt).toISOString().split('T')[0],
      isVerified: true
    };

    return res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review: formattedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to post review. Please try again later.'
    });
  }
};

module.exports = {
  getAllReviews,
  createReview
};
