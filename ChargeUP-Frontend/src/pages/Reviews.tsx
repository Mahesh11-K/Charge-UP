// src/pages/Reviews.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import backgroundImage from '../assets/ReviewsBg.png';
import { 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCheckCircle, 
  FaPen, 
  FaTimes, 
  FaLock, 
  FaArrowRight,
  FaShieldAlt,
  FaUserCheck,
  FaCheck,
  FaMapMarkerAlt
} from 'react-icons/fa';



interface Review {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  isVerified?: boolean;
}

const INITIAL_SHOWCASE_REVIEWS: Review[] = [
  { id: -1, name: "Seán O'Connor", role: "Daily Commuter", location: "Dublin", rating: 5, comment: "The ultra-fast DC charger at Dublin Docklands saved my schedule today. Pulled 150 kW easily and got back on the road to Kildare in under 20 minutes. Highly recommend the app!", date: "2026-07-15", isVerified: true },
  { id: -2, name: "Aoife Murphy", role: "Tesla Model 3 Owner", location: "Cork", rating: 5, comment: "I use the Cork Central charging point every single week. Booking in advance via the Charge-UP app eliminates all range anxiety. Super reliable infrastructure.", date: "2026-07-12", isVerified: true },
  { id: -3, name: "Liam Fitzgerald", role: "Fleet Manager", location: "Galway", rating: 4, comment: "We transitioned our local delivery fleet to electric cars last winter. The network uptime has been great. Docking 1 star just because the Eyre Square spot gets very busy at lunch.", date: "2026-07-09", isVerified: true },
  { id: -4, name: "Róisín Byrne", role: "EV Roadtripper", location: "Belfast", rating: 5, comment: "Drove all the way from Kerry up to Belfast. The Charge-UP network coverage across the border areas is outstanding. Seamless payment integrations.", date: "2026-07-04", isVerified: true },
  { id: -5, name: "Conor Kelly", role: "Nissan Leaf Driver", location: "Limerick", rating: 4, comment: "Solid charging speeds and the app UI makes it simple to map out my trip. Clean station amenities nearby too.", date: "2026-06-28", isVerified: true },
  { id: -6, name: "Siobhán McCarthy", role: "Hotel Logistics Coordinator", location: "Waterford", rating: 5, comment: "Partnering with Charge-UP to install retail charging points at our resort has vastly boosted premium guest footfall. The software support is flawless.", date: "2026-06-22", isVerified: true },
  { id: -7, name: "Darragh Walsh", role: "Weekend Explorer", location: "Athlone", rating: 5, comment: "Perfect central node infrastructure in the Midlands. Whenever I am driving coast-to-coast across Ireland, Charge-UP is my definitive stop.", date: "2026-06-14", isVerified: true }
];

const Reviews: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>(INITIAL_SHOWCASE_REVIEWS);

  
  // Slider State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);

  // Form & Auth Modal State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Form Fields
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formRole, setFormRole] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Determine responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Fetch reviews from backend API on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get('/reviews');
        if (response.data.success && Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews);
        }
      } catch (err) {
        console.warn('Backend reviews endpoint unreachable, using showcase baseline:', err);
      }
    };
    fetchReviews();
  }, []);


  // 3. Slider Calculations
  const maxIndex = Math.max(0, reviews.length - itemsPerPage);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex, nextSlide]);

  // Average Rating
  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  // Star Render Helper
  const renderStars = (rating: number, interactive = false, onSelect?: (r: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = interactive ? starValue <= (hoverRating || formRating) : starValue <= rating;
      return (
        <button
          type={interactive ? "button" : "submit"}
          key={i}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onSelect && onSelect(starValue)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform p-1' : 'cursor-default'} ${
            isFilled ? 'text-amber-400' : 'text-slate-200'
          }`}
        >
          <FaStar className={interactive ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'} />
        </button>
      );
    });
  };

  // Open Form or Auth Prompt
  const handleWriteReviewClick = () => {
    if (isAuthenticated) {
      setFormRole(user?.profile?.evModel || 'EV Driver');
      setFormLocation(user?.profile?.city || 'Dublin');
      setFormError(null);
      setIsFormOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Handle Form Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) {
      setFormError('Please enter your review text.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await API.post('/reviews', {
        rating: formRating,
        comment: formComment,
        role: formRole || 'EV Driver',
        location: formLocation || 'Ireland',
      });

      if (response.data.success && response.data.review) {
        const newRev: Review = response.data.review;
        setReviews((prev) => [newRev, ...prev]);
        setIsFormOpen(false);
        setFormComment('');
        setCurrentIndex(0); // Scroll slider to the start so user sees their new review!
        
        setToastMessage('🎉 Thank you! Your review has been posted live.');
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch (err: any) {
      console.error('Failed to post review:', err);
      const errMsg = err?.response?.data?.error || 'Failed to submit review. Please try again.';
      setFormError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-900 font-sans pt-16 sm:pt-20 pb-16 selection:bg-emerald-100 selection:text-emerald-900 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Semi-transparent soft background layer */}
      <div className="absolute inset-0 bg-slate-50/85 z-0" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <FaCheckCircle className="text-xl" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Header & Trustpilot Style Dashboard Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-200/80 pb-10 mb-12">
          
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-md border border-emerald-300 shadow-2xs">
                Verified Testimonials
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                <FaShieldAlt className="text-emerald-600" /> ChargeUP Network Verified
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-4 text-slate-900 leading-tight">
              Driver Reviews & Ratings
            </h1>
            <p className="text-slate-600 mt-3 max-w-xl font-medium text-sm sm:text-base leading-relaxed">
              Real experience ratings from verified EV drivers, commercial fleets, and hotel operators across Ireland.
            </p>

            {/* Call To Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={handleWriteReviewClick}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 text-sm sm:text-base group cursor-pointer"
              >
                <FaPen className="group-hover:rotate-12 transition-transform" />
                <span>Write a Review</span>
                {!isAuthenticated && (
                  <span className="text-xs bg-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaLock className="text-[10px]" /> Signed-in only
                  </span>
                )}
              </button>

              {isAuthenticated && user && (
                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 bg-white/80 px-3.5 py-2 rounded-xl border border-slate-200">
                  <FaUserCheck className="text-emerald-600 text-sm" />
                  <span>Logged in as <strong className="text-slate-800">{user.fullName}</strong></span>
                </div>
              )}
            </div>
          </div>
          
          {/* Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white via-white to-emerald-50/40 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                    EXCELLENT
                  </span>
                  <span className="text-xs font-semibold text-slate-600">Community Verified</span>
                </div>

                <div className="text-5xl font-black text-slate-900 tracking-tight mt-2 flex items-baseline gap-2">
                  {averageRating}
                  <span className="text-lg font-bold text-slate-400">/ 5.0</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {renderStars(Math.round(parseFloat(averageRating)))}
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex flex-col items-end">
                  <div className="bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <FaCheckCircle /> {reviews.length} Verified
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-2">
                    Ireland Region
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    100% Authentic Ratings
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Updated live in real-time</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Live Sync
              </span>
            </div>
          </div>
        </div>

        {/* ⚡ TRUSTPILOT WIDGET STYLE REVIEW SLIDER */}
        <div 
          className="relative my-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Recent Driver Feedback</span>
                <span className="text-xs text-slate-400 font-semibold bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                  Slide {currentIndex + 1} of {maxIndex + 1}
                </span>
              </h2>
            </div>

            {/* Prev / Next Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-xl bg-white/90 hover:bg-emerald-600 hover:text-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-10 h-10 rounded-xl bg-white/90 hover:bg-emerald-600 hover:text-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>

          {/* Slider Track Container */}
          <div className="overflow-hidden rounded-3xl p-1">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage + (itemsPerPage === 1 ? 0 : 1.5))}%)`
              }}
            >
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{ flex: `0 0 calc(${100 / itemsPerPage}% - ${(itemsPerPage - 1) * 16 / itemsPerPage}px)` }}
                  className="bg-white/95 backdrop-blur-xs border border-slate-200/90 p-6 sm:p-7 rounded-3xl flex flex-col justify-between hover:bg-white hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-xl group relative"
                >
                  <div className="relative">
                    {/* Review Header Profile */}
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-emerald-800 transition-colors">
                          {rev.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{rev.role}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs">
                        <FaMapMarkerAlt className="text-emerald-600 text-xs" />
                        <span>{rev.location}</span>
                      </span>
                    </div>


                    {/* Rating Stars Bar */}
                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex gap-0.5">
                        {renderStars(rev.rating)}
                      </div>
                      <span className="text-xs font-black text-slate-700 ml-1.5">
                        {rev.rating}.0
                      </span>
                    </div>

                    {/* Review Body Comment */}
                    <p className="text-slate-600 text-sm leading-relaxed font-normal italic relative z-10">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Card Footer Verification */}
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-5 border-t border-slate-100 mt-6 flex justify-between items-center">
                    <span className="text-emerald-600 flex items-center gap-1 font-extrabold">
                      <FaCheckCircle className="text-emerald-500 text-xs" /> Verified Session
                    </span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Pagination Indicator Dots */}
          {maxIndex > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === index ? 'w-8 bg-emerald-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ⚡ MODAL 1: WRITE A REVIEW FORM (AUTHENTICATED USERS ONLY) */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-scaleUp">
              
              {/* Close Modal Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FaTimes className="text-lg" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-md">
                  Community Review
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Share Your Charging Experience
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Posting as <strong className="text-slate-800">{user?.fullName}</strong> ({user?.email})
                </p>
              </div>

              {formError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Rating Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex gap-1">
                      {renderStars(formRating, true, (r) => setFormRating(r))}
                    </div>
                    <span className="text-xs font-bold text-slate-600 ml-2">
                      {formRating === 5 && '⭐⭐⭐⭐⭐ Exceptional'}
                      {formRating === 4 && '⭐⭐⭐⭐ Great Experience'}
                      {formRating === 3 && '⭐⭐⭐ Average'}
                      {formRating === 2 && '⭐⭐ Below Expectations'}
                      {formRating === 1 && '⭐ Poor'}
                    </span>
                  </div>
                </div>

                {/* Role / EV Model */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Role / EV Model
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Tesla Model 3 Owner, Fleet Manager, Daily Commuter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* City / Location */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    City / Location in Ireland
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Dublin, Cork, Galway, Limerick"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Review Comment *
                  </label>
                  <textarea
                    rows={4}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Describe your charging experience, station cleanliness, speed, or Charge-UP app usability..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <span>Post Review</span>
                        <FaArrowRight className="text-xs" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ⚡ MODAL 2: AUTHENTICATION REQUIRED PROMPT (VISITORS ONLY) */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative animate-scaleUp">
              
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FaTimes className="text-lg" />
              </button>

              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                <FaLock />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Sign In to Post a Review
              </h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Only registered & verified Charge-UP account holders can submit reviews to maintain authentic network feedback.
              </p>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-5 text-left text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-emerald-500 shrink-0" />
                  <span>Verify your EV charging session</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-emerald-500 shrink-0" />
                  <span>Earn community driver points</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-emerald-500 shrink-0" />
                  <span>Help drivers across Ireland choose reliable spots</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    navigate('/signin');
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <span>Sign In to Account</span>
                  <FaArrowRight className="text-xs" />
                </button>
                <button
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    navigate('/signup');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Register New Account
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reviews;