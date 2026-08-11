// src/pages/Hospitality.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaStar,
  FaLocationDot,
  FaPlug,
  FaMugSaucer,
  FaUtensils,
  FaBed,
  FaMagnifyingGlass,
  FaClock,
  FaSliders,
  FaPhone,
  FaGlobe,
  FaCheck,
  FaXmark,
  FaBuildingUser,
  FaGaugeHigh,
  FaSquareUpRight
} from 'react-icons/fa6';

export interface VenueItem {
  id: string;
  name: string;
  category: 'hotel' | 'cafe' | 'restaurant' | 'lounge';
  categoryLabel: string;
  district: string;
  address: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  chargingHubName: string;
  chargingHubDistance: string;
  walkingTime: string;
  chargingPower: string;
  recommendedDwell: string;
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  amenities: string[];
  description: string;
  customerReview: string;
  reviewAuthor: string;
  phone: string;
  website: string;
  menuHighlight: string;
}

const DUBLIN_VENUES: VenueItem[] = [
  {
    id: 'marker-hotel',
    name: 'The Marker Hotel & Rooftop Lounge',
    category: 'hotel',
    categoryLabel: 'Luxury Hotel & Lounge',
    district: 'Grand Canal Dock, Dublin 2',
    address: 'Grand Canal Square, Docklands, Dublin 2',
    rating: 4.9,
    reviewsCount: 2150,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Docklands Ultra Hub',
    chargingHubDistance: '30 meters',
    walkingTime: '1 min walk',
    chargingPower: '6x 350kW DC Fast',
    recommendedDwell: '30 - 45 mins',
    priceRange: '€€€€',
    amenities: ['Free High-Speed WiFi', 'Rooftop Bar', 'Spa & Pool', 'Valet Charging', 'Live Station Monitor'],
    description: 'Ultra-modern 5-star hotel in Dublin’s tech & financial quarter with a stunning panoramic rooftop lounge overseeing the Grand Canal basin.',
    customerReview: 'Directly across from the 350kW chargers. Plugged in my Taycan, had an espresso on the rooftop, and was at 85% battery before finishing my drink!',
    reviewAuthor: 'Liam O’Connor, Tesla Driver',
    phone: '+353 1 687 5100',
    website: 'https://themarkerdublin.com',
    menuHighlight: 'Artisan Irish Charcuterie & Signature Rooftop Cocktails'
  },
  {
    id: 'brother-hubbard',
    name: 'Brother Hubbard South',
    category: 'cafe',
    categoryLabel: 'Artisan Brunch & Cafe',
    district: 'Portobello, Dublin 8',
    address: '46 Harrington St, Camden Quarter, Dublin 8',
    rating: 4.8,
    reviewsCount: 1840,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Camden Hub',
    chargingHubDistance: '120 meters',
    walkingTime: '2 mins walk',
    chargingPower: '4x 150kW DC Fast',
    recommendedDwell: '25 - 35 mins',
    priceRange: '€€',
    amenities: ['Free High-Speed WiFi', 'Outdoor Courtyard', 'Specialty Coffee', 'Vegan Options', 'Dog Friendly'],
    description: 'Iconic Dublin Middle Eastern inspired specialty brunch cafe famous for sourdoughs, freshly roasted coffees, and vibrant outdoor dining.',
    customerReview: 'Best brunch spot in Dublin 8! Perfect stopping point to grab a flat white while fast charging my Hyundai IONIQ 5.',
    reviewAuthor: 'Aoife Walsh, EV Enthusiast',
    phone: '+353 1 441 1112',
    website: 'https://brotherhubbard.ie',
    menuHighlight: 'Middle Eastern Shakshuka & Specialty Single-Origin Espresso'
  },
  {
    id: 'shelbourne-hotel',
    name: 'The Shelbourne & No. 27 Bar',
    category: 'hotel',
    categoryLabel: 'Historic Luxury Hotel',
    district: 'St. Stephen’s Green, Dublin 2',
    address: '27 St Stephen’s Green, Dublin 2',
    rating: 4.9,
    reviewsCount: 3400,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP St. Stephen’s Green Hub',
    chargingHubDistance: '80 meters',
    walkingTime: '1 min walk',
    chargingPower: '8x 350kW DC Fast',
    recommendedDwell: '30 - 60 mins',
    priceRange: '€€€€',
    amenities: ['Free High-Speed WiFi', 'Afternoon Tea', 'Concierge EV Service', 'Valet Parking', 'Fine Dining'],
    description: 'Dublin’s premiere historic 5-star landmark overlooking St Stephen’s Green park. Offers legendary afternoon teas and luxury hospitality.',
    customerReview: 'Exquisite environment for a quick rest. The valet plugged my BMW i7 into the ChargeUP station while I enjoyed tea in the lounge.',
    reviewAuthor: 'Sir Patrick M., Business Traveller',
    phone: '+353 1 663 4500',
    website: 'https://theshelbourne.com',
    menuHighlight: 'Traditional Shelbourne Afternoon Tea & Irish Whiskey Flights'
  },
  {
    id: 'fade-street-social',
    name: 'Fade Street Social Gastro Bistro',
    category: 'restaurant',
    categoryLabel: 'Fine Dining & Tapas Bar',
    district: 'Creative Quarter, Dublin 2',
    address: '6 Fade St, Dublin 2',
    rating: 4.7,
    reviewsCount: 1920,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Drury St Smart Station',
    chargingHubDistance: '90 meters',
    walkingTime: '1 min walk',
    chargingPower: '4x 200kW DC Fast',
    recommendedDwell: '40 - 60 mins',
    priceRange: '€€€',
    amenities: ['Free High-Speed WiFi', 'Rooftop Cocktail Bar', 'Woodfired Grill', 'Private Dining', 'Gluten-Free Menu'],
    description: 'Renowned gastro-restaurant designed by Chef Dylan McGrath featuring wood-fired local seafood, tapas, and a lively winter garden rooftop.',
    customerReview: 'Fantastic tapas and great craft drinks! Chargers are just around the corner on Drury Street.',
    reviewAuthor: 'Sean Murphy, Audi e-tron Owner',
    phone: '+353 1 604 0066',
    website: 'https://fadestreetsocial.com',
    menuHighlight: 'Wood-Fired Irish Scallops & Truffle Flatbreads'
  },
  {
    id: '3fe-coffee',
    name: '3fe Coffee & Roastery',
    category: 'cafe',
    categoryLabel: 'Specialty Coffee Roastery',
    district: 'Grand Canal Street, Dublin 2',
    address: '32 Grand Canal Street Lower, Dublin 2',
    rating: 4.9,
    reviewsCount: 1560,
    imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Grand Canal Fast Hub',
    chargingHubDistance: '50 meters',
    walkingTime: '1 min walk',
    chargingPower: '6x 150kW DC Fast',
    recommendedDwell: '15 - 25 mins',
    priceRange: '€€',
    amenities: ['Free High-Speed WiFi', 'Barista Training Counter', 'Artisan Pastries', 'Outdoor Bench Seating', 'Work-Friendly'],
    description: 'World-champion coffee roaster pioneering specialty coffee in Ireland with precision pour-overs, espresso flights, and seasonal toasties.',
    customerReview: 'The pinnacle of Dublin coffee. Fast charging hub is literally 50 steps away across the canal bridge.',
    reviewAuthor: 'Emma Byrne, Polestar Driver',
    phone: '+353 1 661 9329',
    website: 'https://3fe.com',
    menuHighlight: 'Filter Coffee Tasting Flight & House Made Sourdough Toasties'
  },
  {
    id: 'woollen-mills',
    name: 'The Woollen Mills Eating House',
    category: 'restaurant',
    categoryLabel: 'Heritage Irish Eatery',
    district: 'Liffey Quays, Dublin 1',
    address: '42 Ormond Quay Lower, Dublin 1',
    rating: 4.7,
    reviewsCount: 2310,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Jervis Centre Hub',
    chargingHubDistance: '150 meters',
    walkingTime: '2 mins walk',
    chargingPower: '6x 200kW DC Fast',
    recommendedDwell: '35 - 50 mins',
    priceRange: '€€',
    amenities: ['Free High-Speed WiFi', 'Ha’penny River Views', 'Rooftop Terrace', 'Craft Beer List', 'Bakery On-Site'],
    description: 'Four-story historic eating house situated next to the iconic Ha’penny Bridge serving authentic modern Irish cuisine and house bakery goods.',
    customerReview: 'Lovely view of the Liffey river. We recharged our EV while enjoying Dublin coddle and fresh sourdough.',
    reviewAuthor: 'Ciaran K., Volkswagen ID.4 Owner',
    phone: '+353 1 828 0140',
    website: 'https://thewoollenmills.com',
    menuHighlight: 'Dublin Coddle with Artisan Sausage & Fresh Crab Toast'
  },
  {
    id: 'intercontinental-dublin',
    name: 'InterContinental Dublin & Lobby Lounge',
    category: 'hotel',
    categoryLabel: '5-Star Resort & Spa',
    district: 'Ballsbridge, Dublin 4',
    address: 'Simmonscourt Rd, Ballsbridge, Dublin 4',
    rating: 4.9,
    reviewsCount: 1780,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Ballsbridge Flagship Hub',
    chargingHubDistance: 'Directly On-Site',
    walkingTime: '0 min walk',
    chargingPower: '8x 350kW DC Fast',
    recommendedDwell: '30 - 60 mins',
    priceRange: '€€€€',
    amenities: ['Free High-Speed WiFi', 'On-Site 350kW Hub', 'Courtyard Garden', 'Whiskey Bar', 'Luxury Spa'],
    description: 'Set on two acres of landscaped gardens in affluent Ballsbridge, offering peaceful luxury lounges and direct on-site ChargeUP 350kW dispensers.',
    customerReview: 'The best charging experience in Dublin! The station is located right at the hotel courtyard entrance with 350kW speed.',
    reviewAuthor: 'Marcus Vance, Porsche Taycan Driver',
    phone: '+353 1 665 4000',
    website: 'https://intercontinentaldublin.ie',
    menuHighlight: 'Whiskey Bar Reserve Tasting & Prime Irish Ribeye'
  },
  {
    id: 'beanhive-coffee',
    name: 'Beanhive Coffee',
    category: 'cafe',
    categoryLabel: 'Specialty Latte Art & Breakfast',
    district: 'Grafton Street Quarter, Dublin 2',
    address: '26 Dawson St, Dublin 2',
    rating: 4.8,
    reviewsCount: 2890,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Dawson St Charging Hub',
    chargingHubDistance: '60 meters',
    walkingTime: '1 min walk',
    chargingPower: '4x 150kW DC Fast',
    recommendedDwell: '20 - 30 mins',
    priceRange: '€',
    amenities: ['Free High-Speed WiFi', 'Custom Latte Art', 'Full Irish Breakfast', 'Takeaway Coffee', 'Cozy Seating'],
    description: 'World-famous for custom hand-drawn foam latte art and generous full Irish breakfasts just off Grafton Street.',
    customerReview: 'Their foam art is unbelievable! Got a personalized EV charger drawn on my cappuccino while my Kia EV6 was charging.',
    reviewAuthor: 'Niamh Kelly, Local Resident',
    phone: '+353 1 677 4833',
    website: 'https://beanhive.ie',
    menuHighlight: 'Famous Custom Latte Art Cappuccino & Full Irish Fry'
  },
  {
    id: 'forest-marcy',
    name: 'Forest & Marcy Wine Bistro',
    category: 'restaurant',
    categoryLabel: 'Natural Wine & Tasting Bar',
    district: 'Leeson Street, Dublin 2',
    address: '126 Leeson Street Upper, Dublin 2',
    rating: 4.8,
    reviewsCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Leeson St Fast Hub',
    chargingHubDistance: '100 meters',
    walkingTime: '2 mins walk',
    chargingPower: '4x 200kW DC Fast',
    recommendedDwell: '40 - 60 mins',
    priceRange: '€€€',
    amenities: ['Free High-Speed WiFi', 'Chef’s Counter Dining', 'Natural Wine Pairing', 'Seasonal Tasting Menu', 'Quiet Atmosphere'],
    description: 'Intimate neighborhood wine bistro featuring an open chef counter, organic biodynamic wines, and small plates focused on Irish seasonality.',
    customerReview: 'Unmatched culinary experience. Had a glass of natural orange wine while charging our Volvo EX30 for the trip home.',
    reviewAuthor: 'David & Siobhan, Food Critics',
    phone: '+353 1 660 2500',
    website: 'https://forestandmarcy.ie',
    menuHighlight: 'Fermented Potato Bread with Smoked Butter & Natural Wine Pairings'
  },
  {
    id: 'devlin-hotel',
    name: 'The Devlin & Layla’s Rooftop',
    category: 'hotel',
    categoryLabel: 'Boutique Hotel & Rooftop',
    district: 'Ranelagh Village, Dublin 6',
    address: '117 Ranelagh, Dublin 6',
    rating: 4.8,
    reviewsCount: 1240,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Ranelagh Hub',
    chargingHubDistance: '70 meters',
    walkingTime: '1 min walk',
    chargingPower: '4x 150kW DC Fast',
    recommendedDwell: '30 - 45 mins',
    priceRange: '€€€',
    amenities: ['Free High-Speed WiFi', 'Panoramic Glass Rooftop', 'Art House Cinema', 'Cocktail Bar', 'EV Valet'],
    description: 'Chic boutique hotel in vibrant Ranelagh Village with glass-enclosed Layla’s rooftop offering 360° views of Dublin mountains and city skyline.',
    customerReview: 'Layla rooftop is stunning! Super fast 150kW charger is just 1 min away on Ranelagh Main St.',
    reviewAuthor: 'Chloe Henderson, Lucid Air Owner',
    phone: '+353 1 406 0000',
    website: 'https://thedevlin.ie',
    menuHighlight: 'Wood-Fired Neapolitan Pizza & Craft Cocktails on Layla’s Terrace'
  },
  {
    id: 'two-boys-brew',
    name: 'Two Boys Brew Cafe',
    category: 'cafe',
    categoryLabel: 'Aussie Specialty Cafe',
    district: 'Phibsborough, Dublin 7',
    address: '375 North Circular Rd, Phibsborough, Dublin 7',
    rating: 4.8,
    reviewsCount: 1670,
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Phibsborough Hub',
    chargingHubDistance: '110 meters',
    walkingTime: '2 mins walk',
    chargingPower: '4x 150kW DC Fast',
    recommendedDwell: '25 - 35 mins',
    priceRange: '€€',
    amenities: ['Free High-Speed WiFi', 'Specialty Matcha & Batch Brew', 'Avocado Toasties', 'Spacious Seating', 'Pet Friendly'],
    description: 'Melbourne-inspired specialty cafe in North Dublin known for vibrant healthy bowls, house-roasted coffees, and sunny atmosphere.',
    customerReview: 'Top notch matcha and sourdough! Charging station around the corner got me to 90% while I relaxed inside.',
    reviewAuthor: 'Gavin Ross, Ford Mustang Mach-E Owner',
    phone: '+353 1 830 9230',
    website: 'https://twoboysbrew.ie',
    menuHighlight: 'Chilli Scrambled Eggs on Sourdough & Cold Brew Coffee'
  },
  {
    id: 'cleaver-east',
    name: 'Cleaver East Grill & Lounge',
    category: 'restaurant',
    categoryLabel: 'Gourmet Steakhouse & Lounge',
    district: 'Temple Bar Quarter, Dublin 2',
    address: '6 Essex St East, Temple Bar, Dublin 2',
    rating: 4.6,
    reviewsCount: 1150,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Temple Bar Garage Hub',
    chargingHubDistance: '180 meters',
    walkingTime: '2 mins walk',
    chargingPower: '6x 200kW DC Fast',
    recommendedDwell: '40 - 60 mins',
    priceRange: '€€€',
    amenities: ['Free High-Speed WiFi', 'Dry-Aged Steak Display', 'Cocktail Lounge', 'Late Night Dining', 'Charging Discounts'],
    description: 'Cutting-edge modern steakhouse in the heart of Dublin’s cultural quarter offering prime dry-aged Irish beef and creative cocktails.',
    customerReview: 'Great steak, lively atmosphere, and effortless charging nearby in Temple Bar garage.',
    reviewAuthor: 'Brian P., BMW iX Owner',
    phone: '+353 1 531 3500',
    website: 'https://cleavereast.ie',
    menuHighlight: '30-Day Dry-Aged Irish Ribeye & Cleaver House Cocktails'
  },
  {
    id: 'kaph-coffee',
    name: 'Kaph Specialty Coffee',
    category: 'cafe',
    categoryLabel: 'Artisan Espresso Bar',
    district: 'Creative Quarter, Dublin 2',
    address: '31 Drury St, Dublin 2',
    rating: 4.7,
    reviewsCount: 1430,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Drury St Smart Hub',
    chargingHubDistance: '40 meters',
    walkingTime: '1 min walk',
    chargingPower: '4x 200kW DC Fast',
    recommendedDwell: '15 - 25 mins',
    priceRange: '€',
    amenities: ['Free High-Speed WiFi', 'Oat Milk Specialty', 'Paleo Pastries', 'Mezzanine Seating', 'Quick Takeaway'],
    description: 'Trendy two-story espresso bar on Drury Street popular with creatives, serving single-origin coffees and gluten-free pastries.',
    customerReview: 'Super friendly baristas and the charger is literally right across the street. Fast 20 min top-up!',
    reviewAuthor: 'Laura Higgins, EV Commuter',
    phone: '+353 1 677 9100',
    website: 'https://kaph.ie',
    menuHighlight: 'Single-Origin Aeropress & Artisan Almond Croissants'
  },
  {
    id: 'merrion-hotel',
    name: 'The Merrion & Cellar Lounge',
    category: 'lounge',
    categoryLabel: '5-Star Cellar Lounge & Fine Dining',
    district: 'Merrion Square, Dublin 2',
    address: 'Upper Merrion St, Dublin 2',
    rating: 4.9,
    reviewsCount: 2600,
    imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80',
    chargingHubName: 'ChargeUP Merrion Square Hub',
    chargingHubDistance: '70 meters',
    walkingTime: '1 min walk',
    chargingPower: '6x 350kW DC Fast',
    recommendedDwell: '40 - 60 mins',
    priceRange: '€€€€',
    amenities: ['Free High-Speed WiFi', 'Michelin 2-Star Restaurant', '18th Century Cellar Bar', 'Private Courtyard', 'Valet Charging'],
    description: 'Set within four restored Georgian townhouses containing Ireland’s largest private art collection, 2-star Michelin Dining, and historic vault lounges.',
    customerReview: 'A truly world-class experience. Relaxing in the Cellar Bar while our electric car charges on Merrion Street.',
    reviewAuthor: 'Elizabeth & Richard V., International Guests',
    phone: '+353 1 603 0600',
    website: 'https://merrionhotel.com',
    menuHighlight: 'Patrick Guilbaud Tasting Menu & Cellar Reserve Irish Whiskey'
  }
];

export const Hospitality: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hotel' | 'cafe' | 'restaurant' | 'lounge'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'reviews'>('rating');
  const [activeVenue, setActiveVenue] = useState<VenueItem | null>(null);

  const filteredVenues = useMemo(() => {
    return DUBLIN_VENUES.filter(venue => {
      const matchesCategory = selectedCategory === 'all' || venue.category === selectedCategory;
      const matchesQuery = 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.chargingHubName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'distance') {
        const distA = parseInt(a.chargingHubDistance);
        const distB = parseInt(b.chargingHubDistance);
        return (isNaN(distA) ? 0 : distA) - (isNaN(distB) ? 0 : distB);
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 transition-colors duration-300">
      
      {/* HERO BANNER SECTION */}
      <section className="relative pt-28 pb-20 bg-slate-900 text-white overflow-hidden">
        {/* Background Overlay Image with Dark Gradient Tint */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-900/90 to-slate-950 pointer-events-none" />

        {/* Floating Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-6 shadow-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="uppercase tracking-widest text-[11px]">Dublin City Hospitality & EV Charging Hubs</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Relax, Dine & Recharge <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              While You Charge Up
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Discover 14 premier hotels, artisan cafes, rooftop lounges, and fine dining spots located steps away from ChargeUP 150kW - 350kW Ultra-Fast stations in Dublin.
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <p className="text-2xl font-black text-emerald-400">14</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Curated Dublin Venues</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <p className="text-2xl font-black text-cyan-400">&lt; 2 mins</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Avg Walk to Charger</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <p className="text-2xl font-black text-amber-400">4.8 ★</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Avg Public Rating</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <p className="text-2xl font-black text-emerald-400">350 kW</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Ultra-Fast Stations</p>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE SEARCH & FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
          
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search venue name, food type, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer p-1"
                >
                  <FaXmark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center lg:justify-start">
              {[
                { id: 'all', label: 'All Venues (14)', icon: <FaBuildingUser className="w-3.5 h-3.5" /> },
                { id: 'hotel', label: 'Hotels & Resorts', icon: <FaBed className="w-3.5 h-3.5 text-sky-500" /> },
                { id: 'cafe', label: 'Artisan Cafes', icon: <FaMugSaucer className="w-3.5 h-3.5 text-amber-500" /> },
                { id: 'restaurant', label: 'Fine Dining', icon: <FaUtensils className="w-3.5 h-3.5 text-emerald-500" /> },
                { id: 'lounge', label: 'Lounges & Bars', icon: <FaGaugeHigh className="w-3.5 h-3.5 text-purple-500" /> },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as 'all' | 'hotel' | 'cafe' | 'restaurant' | 'lounge')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <FaSliders className="w-3 h-3 text-emerald-500" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance' | 'reviews')}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="rating">Highest Rated ⭐</option>
                <option value="reviews">Most Reviewed 🔥</option>
                <option value="distance">Closest to Charging 🚶</option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* VENUES GRID (14 DUBLIN HOSPITALITY SUGGESTIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Recommended Venues Near Charging Spots
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Showing {filteredVenues.length} Dublin hospitality spots with public ratings & instant walking distance
            </p>
          </div>

          <Link
            to="/locations"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View Dublin Charging Map</span>
            <FaSquareUpRight className="w-3 h-3" />
          </Link>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No venues match your search filter.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try clearing your search query or selecting "All Venues".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={venue.imageUrl}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/60 shadow-xs">
                        {venue.categoryLabel}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-xs">
                        {venue.priceRange}
                      </span>
                    </div>

                    {/* Rating Badge Overlay Bottom Left */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 shadow-md">
                      <FaStar className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-black text-white">{venue.rating}</span>
                      <span className="text-[10px] text-slate-300">({venue.reviewsCount.toLocaleString()})</span>
                    </div>

                    {/* Walk Time Badge Overlay Bottom Right */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-emerald-950/90 text-emerald-400 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-800/80 shadow-md">
                      <FaClock className="w-3 h-3" />
                      <span>{venue.walkingTime}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                      <FaLocationDot className="w-3 h-3 text-emerald-500" />
                      <span>{venue.district}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {venue.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {venue.description}
                    </p>

                    {/* EV Charging Station Association Box */}
                    <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                          <FaPlug className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">
                            {venue.chargingHubName}
                          </p>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                            {venue.chargingPower} • {venue.chargingHubDistance}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amenities Chips */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {venue.amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Charge Time: <strong className="text-slate-800 dark:text-slate-200">{venue.recommendedDwell}</strong>
                  </div>

                  <button
                    onClick={() => setActiveVenue(venue)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* PARTNER WITH CHARGEUP FOR HOTEL/CAFE OWNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                For Hotel, Restaurant & Business Owners
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">
                Turn Customer Dwell Time Into <br className="hidden sm:inline" />
                <span className="text-emerald-400">Secondary Revenue</span>
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-normal max-w-xl">
                Partner with ChargeUP to install ultra-fast 150kW - 350kW EV charging hubs at your Dublin hotel, cafe, or retail space with zero upfront hardware costs and full revenue share.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
                <div className="flex items-center gap-1.5">
                  <FaCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Free Turn-Key Installation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Attract Premium EV Drivers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Monthly Passive Revenue Share</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center items-start lg:items-end">
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl shadow-xl transition-all cursor-pointer text-sm">
                  Become a Partner Host
                </button>
              </Link>
              <span className="text-[11px] text-slate-400 font-medium">Over 120+ host partners in Ireland</span>
            </div>

          </div>
        </div>
      </section>

      {/* VENUE DETAIL MODAL DRAWER */}
      {activeVenue && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveVenue(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVenue(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer transition-colors z-10"
            >
              <FaXmark className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800">
              <img
                src={activeVenue.imageUrl}
                alt={activeVenue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white shadow-xs">
                  {activeVenue.categoryLabel}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {activeVenue.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                  <FaLocationDot className="w-3 h-3 text-emerald-400" />
                  <span>{activeVenue.address}</span>
                </p>
              </div>
            </div>

            {/* Rating & Distance Bar */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-center border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Public Rating</span>
                <span className="text-base font-extrabold text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                  <FaStar className="w-3.5 h-3.5" /> {activeVenue.rating} <span className="text-[11px] text-slate-400">({activeVenue.reviewsCount})</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-center border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Nearest Station</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">
                  {activeVenue.chargingHubDistance} ({activeVenue.walkingTime})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-center border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Power Level</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {activeVenue.chargingPower}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">About Venue</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {activeVenue.description}
              </p>
            </div>

            {/* Menu & Highlight */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">Specialty Highlight</h4>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                🍽️ {activeVenue.menuHighlight}
              </p>
            </div>

            {/* Customer Review Quote */}
            <div className="mb-6 bg-slate-100/90 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 italic text-xs text-slate-600 dark:text-slate-300">
              <p>"{activeVenue.customerReview}"</p>
              <p className="not-italic font-bold text-slate-800 dark:text-slate-200 mt-2 text-[11px]">
                — {activeVenue.reviewAuthor}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2">Amenities & Services</h4>
              <div className="flex flex-wrap gap-2">
                {activeVenue.amenities.map((am, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact & Map Directions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <a href={`tel:${activeVenue.phone}`} className="flex items-center gap-1 hover:text-emerald-600">
                  <FaPhone className="w-3 h-3 text-emerald-500" /> {activeVenue.phone}
                </a>
                <a href={activeVenue.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600">
                  <FaGlobe className="w-3 h-3 text-emerald-500" /> Website
                </a>
              </div>

              <Link to="/locations">
                <button
                  onClick={() => setActiveVenue(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Navigate to Charger & Venue ➔
                </button>
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Hospitality;
