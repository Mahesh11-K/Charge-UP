// src/pages/Products.tsx
import React, { useState, useMemo } from 'react';
import backgroundImage from '../assets/ProductsBg.png';

// Local Assets for Products
import HomeProAC from '../assets/HomeProAC.png';
import ACC from '../assets/ACC.png';
import EcoPillar from '../assets/Eco-Pillar.png';
import PortableAC from '../assets/PortableAC.png';
import HyperCharge150DC from '../assets/HyperCharge150DC.png';
import DCC from '../assets/DCC.png';
import MobileRanger30DC from '../assets/MobileRanger30DC.png';
import CompactFleetDC50 from '../assets/CompactFleetDC50.png';
import NacsCcsAdapter from '../assets/NacsCcsAdapter.png';
import Type2TpuCable from '../assets/Type2TpuCable.jpg';
import SmartLoadBalancer from '../assets/SmartLoadBalancer.png';
import PedestalStand from '../assets/PedestalStand.png';
import FleetRfidCards from '../assets/FleetRfidCards.png';
import CableRetractor from '../assets/CableRetractor.jpg';

import {
  FaBolt,
  FaPlug,
  FaStar,
  FaCartShopping,
  FaCheck,
  FaMagnifyingGlass,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaTruckFast,
  FaLock,
  FaEye,
  FaMinus,
  FaPlus,
  FaTrashCan,
  FaTag,
  FaCreditCard,
  FaWrench,
  FaBox
} from 'react-icons/fa6';

export interface ProductItem {
  id: string;
  name: string;
  category: 'ac' | 'dc' | 'hardware';
  categoryLabel: string;
  modelCode: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  powerOutput: string;
  connectorType: string;
  warranty: string;
  ipRating: string;
  imageUrl: string;
  imageFit?: 'cover' | 'contain';
  badgeText: string;
  badgeBg: string;
  inStock: boolean;
  description: string;
  features: string[];
  bestFor: string;
  seaiApproved: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

// 14 CURATED PRODUCTS (4 AC Chargers, 4 DC Chargers, 6 Hardware Equipments)
const PRODUCTS_DATA: ProductItem[] = [
  // --- AC CHARGERS (4 PRODUCTS) ---
  {
    id: 'ac-home-pro',
    name: 'ChargeUP Home Pro AC Station',
    category: 'ac',
    categoryLabel: 'AC Home Charger',
    modelCode: 'CHP-74-HOME',
    price: 549,
    originalPrice: 649,
    rating: 4.9,
    reviewsCount: 142,
    powerOutput: '7.4 kW / 22 kW',
    connectorType: 'Tethered Type 2 (7.5m Cable)',
    warranty: '3 Year Warranty',
    ipRating: 'IP65 Weatherproof',
    imageUrl: HomeProAC,
    imageFit: 'contain',
    badgeText: 'SEAI €300 Grant Approved',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    inStock: true,
    description: 'Smart residential EV charger with Wi-Fi/Bluetooth automation, solar panel load balancing, and app-controlled off-peak night scheduling.',
    features: ['Wi-Fi & Bluetooth Smart App', 'Dynamic Solar Load Management', 'SEAI Grant Certified'],
    bestFor: 'Residential overnight home charging',
    seaiApproved: true
  },
  {
    id: 'ac-wall-dual',
    name: 'VoltWall Commercial Dual AC Hub',
    category: 'ac',
    categoryLabel: 'AC Commercial Charger',
    modelCode: 'VWC-22-DUAL',
    price: 1899,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 98,
    powerOutput: '22 kW Dual Socket (44kW Total)',
    connectorType: 'Dual Type 2 Sockets',
    warranty: '5 Year Commercial Warranty',
    ipRating: 'IP55 Vandal Proof',
    imageUrl: ACC,
    badgeText: 'MID Billing Metered',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    inStock: true,
    description: 'Commercial wall-mounted dual charger engineered for multi-vehicle charging at hotel car parks, office buildings, and retail plazas.',
    features: ['OCPP 1.6J / 2.0.1 Open Protocol', 'RFID Card & App Payment Ready', 'MID Meter Certified'],
    bestFor: 'Hotels, offices & commercial lots',
    seaiApproved: false
  },
  {
    id: 'ac-ecopillar',
    name: 'EcoPillar Workplace AC Terminal',
    category: 'ac',
    categoryLabel: 'AC Workplace Charger',
    modelCode: 'ECP-11-PIL',
    price: 1150,
    originalPrice: 1350,
    rating: 4.7,
    reviewsCount: 64,
    powerOutput: '11 kW / 22 kW 3-Phase',
    connectorType: 'Type 2 Socket with Auto-Lock',
    warranty: '3 Year Warranty',
    ipRating: 'IK10 / IP65 Steel',
    imageUrl: EcoPillar,
    badgeText: 'RFID Access Security',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    inStock: true,
    description: 'Rugged floor-mounted stainless steel pillar charger configured specifically for employee fleet parking and corporate campuses.',
    features: ['Employee RFID Card Access', 'Stainless Steel Anti-Corrosion', 'Corporate Fleet Telematics'],
    bestFor: 'Corporate campus & staff parking',
    seaiApproved: true
  },
  {
    id: 'ac-portable-pro',
    name: 'ChargeUP Portable AC Travel Charger',
    category: 'ac',
    categoryLabel: 'AC Portable Charger',
    modelCode: 'CPP-74-TRAV',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 210,
    powerOutput: '3.3 kW / 7.4 kW Adjustable',
    connectorType: 'UK/Irish 3-Pin & CEE Commando',
    warranty: '2 Year Warranty',
    ipRating: 'IP67 Waterproof',
    imageUrl: PortableAC,
    imageFit: 'contain',
    badgeText: 'Emergency Road Kit',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    inStock: true,
    description: 'Universal heavy-duty portable AC charger with OLED digital diagnostic display and multi-plug adapters for road trips and emergencies.',
    features: ['OLED Current Display (6A-32A)', 'IP67 Submersible Waterproof', 'Includes Carry Case & Adapters'],
    bestFor: 'Road trips, travel & emergency backup',
    seaiApproved: false
  },

  // --- DC CHARGERS (4 PRODUCTS) ---
  {
    id: 'dc-hyper-150',
    name: 'HyperCharge 150 Ultra DC Station',
    category: 'dc',
    categoryLabel: 'DC Fast Charger',
    modelCode: 'HPC-150-DC',
    price: 22500,
    originalPrice: 25000,
    rating: 4.9,
    reviewsCount: 86,
    powerOutput: '150 kW DC Fast Charging',
    connectorType: 'Dual CCS2 + NACS Option',
    warranty: '5 Year Full Service Warranty',
    ipRating: 'NEMA 4X / IP65',
    imageUrl: HyperCharge150DC,
    imageFit: 'contain',
    badgeText: 'High-Power Highway Ready',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    inStock: true,
    description: 'Commercial liquid-cooled 150kW DC fast charging station designed for motorway service plazas, fleet hubs, and fuel forecourts.',
    features: ['Integrated Contactless Card Terminal', 'Dynamic Power Sharing (75kW x2)', '99.9% Network Uptime SLAs'],
    bestFor: 'Highway service stations & fleet hubs',
    seaiApproved: false
  },
  {
    id: 'dc-apex-350',
    name: 'Apex 350 Supercharged DC Hub',
    category: 'dc',
    categoryLabel: 'DC Ultra Fast Charger',
    modelCode: 'APX-350-LIQ',
    price: 45000,
    originalPrice: 49000,
    rating: 5.0,
    reviewsCount: 42,
    powerOutput: '350 kW Ultra-Fast (800V Architecture)',
    connectorType: 'Liquid-Cooled Dual CCS2 / NACS',
    warranty: '5 Year Premium Warranty',
    ipRating: 'IP65 All-Weather',
    imageUrl: DCC,
    badgeText: '800V 15-Min Charge',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    inStock: true,
    description: 'State-of-the-art 350kW liquid-cooled dispenser delivering up to 200 miles of EV range in under 15 minutes for Taycan, Lucid & Hyundai 800V EVs.',
    features: ['Liquid-Cooled Ultra Cables', '32-inch High-Res Media Screen', 'ISO 15118 Autocharge Handshake'],
    bestFor: 'Flagship motorway charging plazas',
    seaiApproved: false
  },
  {
    id: 'dc-mobile-ranger',
    name: 'Mobile Ranger 30kW DC Suitcase',
    category: 'dc',
    categoryLabel: 'DC Portable Charger',
    modelCode: 'MRG-30-PORT',
    price: 6850,
    originalPrice: 7500,
    rating: 4.8,
    reviewsCount: 38,
    powerOutput: '30 kW Rapid DC Boost',
    connectorType: 'CCS2 Guns & Rugged Cable',
    warranty: '2 Year Warranty',
    ipRating: 'Heavy Duty Impact Suitcase',
    imageUrl: MobileRanger30DC,
    imageFit: 'contain',
    badgeText: 'Roadside Recovery Kit',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    inStock: true,
    description: 'Rugged wheeled mobile DC charger for roadside assistance trucks, EV breakdown rescue, and temporary event fleet management.',
    features: ['30 kW Rapid DC Energy Injection', 'Built-in Heavy Duty Off-Road Wheels', 'Universal Vehicle Compatibility'],
    bestFor: 'Roadside rescue & mobile fleet recovery',
    seaiApproved: false
  },
  {
    id: 'dc-urban-50',
    name: 'Compact Fleet DC 50 Station',
    category: 'dc',
    categoryLabel: 'DC Urban Fast Charger',
    modelCode: 'CFD-50-URB',
    price: 12800,
    originalPrice: 14000,
    rating: 4.7,
    reviewsCount: 53,
    powerOutput: '50 kW DC Fast',
    connectorType: 'CCS2 + CHAdeMO Dual',
    warranty: '3 Year Warranty',
    ipRating: 'IP54 Weatherproof',
    imageUrl: CompactFleetDC50,
    imageFit: 'contain',
    badgeText: 'Urban Taxi & Delivery',
    badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    inStock: true,
    description: 'Space-saving 50kW DC charger ideal for urban taxi depots, grocery store parking, and last-mile delivery fleet replenishment.',
    features: ['Compact Footprint (< 0.3m²)', 'Dual CCS2 & CHAdeMO Support', 'Touchscreen User Interface'],
    bestFor: 'Urban retail, taxi hubs & last-mile delivery',
    seaiApproved: false
  },

  // --- EV RELATED HARDWARE EQUIPMENT (6 PRODUCTS) ---
  {
    id: 'hw-nacs-adapter',
    name: 'NACS to CCS1/CCS2 Super Adapter',
    category: 'hardware',
    categoryLabel: 'EV Cable Adapter',
    modelCode: 'ADP-NACS-500A',
    price: 189,
    originalPrice: 229,
    rating: 4.9,
    reviewsCount: 312,
    powerOutput: 'Up to 250 kW / 500A DC',
    connectorType: 'NACS Female to CCS Male',
    warranty: '2 Year Warranty',
    ipRating: 'IP67 Waterproof',
    imageUrl: NacsCcsAdapter,
    imageFit: 'contain',
    badgeText: 'Tesla & Supercharger Compatible',
    badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    inStock: true,
    description: 'Heavy-duty 500A rated high-voltage adapter enabling non-Tesla EVs to charge at NACS Supercharger stations safely.',
    features: ['500A Peak Current Support', 'Dual Temperature Thermal Cutoff', 'Solid Brass Contacts'],
    bestFor: 'Unlocking NACS Superchargers for all EVs',
    seaiApproved: false
  },
  {
    id: 'hw-type2-cable',
    name: 'Heavy Duty 10m Type 2 TPU Cable',
    category: 'hardware',
    categoryLabel: 'EV Charging Cable',
    modelCode: 'CBL-T2-10M-32A',
    price: 149,
    originalPrice: 179,
    rating: 4.8,
    reviewsCount: 184,
    powerOutput: '3-Phase 32A (22 kW Rating)',
    connectorType: 'Type 2 to Type 2 Male/Female',
    warranty: '3 Year Warranty',
    ipRating: 'IP65 Water & Dust',
    imageUrl: Type2TpuCable,
    imageFit: 'contain',
    badgeText: 'Extra Long 10m Length',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    inStock: true,
    description: 'Ultra-durable 10-meter long TPU jacketed 32A 3-phase EV charging cable designed to withstand vehicle roll-overs and extreme weather.',
    features: ['10 Meter Extra Long Reach', 'Run-Over Proof Flame Retardant TPU', 'Includes Waterproof Storage Bag'],
    bestFor: 'Public AC charging stations',
    seaiApproved: false
  },
  {
    id: 'hw-load-balancer',
    name: 'Smart Dynamic Load Balancer Hub',
    category: 'hardware',
    categoryLabel: 'Energy Management',
    modelCode: 'BAL-DYN-HUB3',
    price: 279,
    originalPrice: 329,
    rating: 4.9,
    reviewsCount: 76,
    powerOutput: '1-Phase & 3-Phase Auto Sync',
    connectorType: 'CT Clamp Sensor Bus',
    warranty: '3 Year Warranty',
    ipRating: 'IP54 DIN Rail Mount',
    imageUrl: SmartLoadBalancer,
    imageFit: 'contain',
    badgeText: 'Prevents Main Fuse Tripping',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    inStock: true,
    description: 'Intelligent electrical panel sensor that dynamically adjusts EV charging power based on home appliances to prevent main fuse trips.',
    features: ['Real-Time Household Current Monitor', 'Solar PV Excess Energy Capture', 'Includes 3x CT Clamps'],
    bestFor: 'Homes with heat pumps or solar PV',
    seaiApproved: true
  },
  {
    id: 'hw-pedestal-stand',
    name: 'Stainless Steel Pedestal & Cable Dock',
    category: 'hardware',
    categoryLabel: 'Mounting Hardware',
    modelCode: 'PED-SS-DOCK',
    price: 199,
    originalPrice: 249,
    rating: 4.7,
    reviewsCount: 52,
    powerOutput: 'Universal Wallbox Mount',
    connectorType: 'Integrated Type 2 Cable Holster',
    warranty: '5 Year Anti-Rust Warranty',
    ipRating: '316 Marine Grade Stainless',
    imageUrl: PedestalStand,
    imageFit: 'contain',
    badgeText: '316 Marine Stainless Steel',
    badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    inStock: true,
    description: 'Free-standing heavy-duty stainless steel mounting post equipped with cable hanger and plug holster for outdoor driveway installations.',
    features: ['Pre-drilled Concrete Base Mounting', '316 Marine Stainless Steel Coating', 'Built-in Cable Hanger & Holster'],
    bestFor: 'Driveway & open car park installations',
    seaiApproved: false
  },
  {
    id: 'hw-rfid-cards',
    name: 'Industrial Fleet RFID Cards (10 Pack)',
    category: 'hardware',
    categoryLabel: 'Fleet Access Hardware',
    modelCode: 'RFID-FLT-10PK',
    price: 49,
    originalPrice: 69,
    rating: 4.8,
    reviewsCount: 120,
    powerOutput: '13.56 MHz High Security',
    connectorType: 'MIFARE Classic / DESFire',
    warranty: '2 Year Warranty',
    ipRating: 'Waterproof PVC Fobs',
    imageUrl: FleetRfidCards,
    imageFit: 'contain',
    badgeText: 'Pre-Programmed Pack',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    inStock: true,
    description: 'Encrypted RFID keycards and fobs for commercial station access control, driver authentication, and fleet billing integration.',
    features: ['10x Encrypted Driver RFID Fobs', 'Compatible with all ChargeUP stations', 'Custom Laser Numbering'],
    bestFor: 'Commercial fleets & staff authentication',
    seaiApproved: false
  },
  {
    id: 'hw-cable-retractor',
    name: 'Liquid-Cooled Retractor Arm System',
    category: 'hardware',
    categoryLabel: 'Cable Management',
    modelCode: 'RTR-ARM-HEAVY',
    price: 420,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 45,
    powerOutput: 'Supports Heavy DC Cables',
    connectorType: 'Spring-Tension Counterbalance',
    warranty: '3 Year Commercial Warranty',
    ipRating: 'Heavy Duty Anodized Aluminum',
    imageUrl: CableRetractor,
    imageFit: 'contain',
    badgeText: 'Zero Ground Drag',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    inStock: true,
    description: 'Overhead spring retractor system that suspends heavy liquid-cooled DC fast charging cables to prevent ground damage and driver strain.',
    features: ['Spring Counterbalance Retraction', 'Prevents Cable Ground Wear & Trips', 'Adjustable Overhead Height'],
    bestFor: 'High-power DC charging plazas',
    seaiApproved: false
  }
];

export const Products: React.FC = () => {
  // Category Filtering State
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'ac' | 'dc' | 'hardware'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Individual Category Pagination States (2 Products Per Page Process)
  const [acPage, setAcPage] = useState(1);
  const [dcPage, setDcPage] = useState(1);
  const [hwPage, setHwPage] = useState(1);
  const PRODUCTS_PER_PAGE = 2;

  // E-Commerce Cart & Modal States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filtered lists for each category
  const acProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(p => p.category === 'ac');
  }, []);

  const dcProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(p => p.category === 'dc');
  }, []);

  const hwProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(p => p.category === 'hardware');
  }, []);

  // Paginated Slices (2 per page)
  const paginatedAc = useMemo(() => {
    const start = (acPage - 1) * PRODUCTS_PER_PAGE;
    return acProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [acProducts, acPage]);

  const paginatedDc = useMemo(() => {
    const start = (dcPage - 1) * PRODUCTS_PER_PAGE;
    return dcProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [dcProducts, dcPage]);

  const paginatedHw = useMemo(() => {
    const start = (hwPage - 1) * PRODUCTS_PER_PAGE;
    return hwProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [hwProducts, hwPage]);

  // Total pages
  const totalAcPages = Math.ceil(acProducts.length / PRODUCTS_PER_PAGE);
  const totalDcPages = Math.ceil(dcProducts.length / PRODUCTS_PER_PAGE);
  const totalHwPages = Math.ceil(hwProducts.length / PRODUCTS_PER_PAGE);

  // Cart Helper Operations
  const addToCart = (product: ProductItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Product Card Renderer Component
  const renderProductCard = (product: ProductItem) => (
    <div
      key={product.id}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Product Image Header */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full ${
              product.imageFit === 'contain'
                ? 'object-contain p-3 group-hover:scale-105'
                : 'object-cover group-hover:scale-108'
            } transition-transform duration-500`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

          {/* Top Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${product.badgeBg}`}>
              {product.badgeText}
            </span>
          </div>

          {/* Rating Tag */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-slate-700/60 shadow-xs">
            <FaStar className="w-3 h-3 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </div>

          {/* Quick View Floating Button */}
          <button
            onClick={() => setSelectedProduct(product)}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white backdrop-blur-md transition-colors cursor-pointer shadow-md"
            title="Quick Spec View"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Model: {product.modelCode}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              <FaCheck className="w-3 h-3" /> In Stock
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Power & Connector Spec Box */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Power Output</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{product.powerOutput}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Warranty</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{product.warranty}</span>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="mt-4 space-y-1.5">
            {product.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & E-Commerce Action Footer */}
      <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                €{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 line-through font-semibold">
                €{product.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
              Save €{(product.originalPrice - product.price).toLocaleString()} • Or €{Math.round(product.price / 4)}/mo
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {product.ipRating}
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FaCartShopping className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={() => {
              addToCart(product);
              setIsCheckoutOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FaBolt className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-white font-sans pt-20 pb-24 relative bg-cover bg-center bg-no-repeat transition-colors duration-300"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Light/Dark Overlay for background readability */}
      <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/92 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER SECTION & CART FLOATING TRIGGER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-2">
              <span>⚡</span>
              <span>Official ChargeUP Hardware E-Commerce Store</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              EV Charging Store & Hardware
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-normal">
              CE & SEAI certified charging hardware engineered for single and 3-phase European electricity grids with fast shipping across Ireland.
            </p>
          </div>

          {/* Floating Shopping Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-3 cursor-pointer shrink-0"
          >
            <FaCartShopping className="w-5 h-5" />
            <span>View Cart</span>
            {cartCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-700 font-extrabold text-xs shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* CATEGORY SWITCHER TABS & SEARCH BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Products (14)', icon: <FaBox className="w-3.5 h-3.5" /> },
              { id: 'ac', label: 'AC Chargers (4)', icon: <FaPlug className="w-3.5 h-3.5 text-emerald-500" /> },
              { id: 'dc', label: 'DC Fast Chargers (4)', icon: <FaBolt className="w-3.5 h-3.5 text-amber-500" /> },
              { id: 'hardware', label: 'Hardware & Gear (6)', icon: <FaWrench className="w-3.5 h-3.5 text-sky-500" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeCategoryTab === tab.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search chargers or accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>

        {/* SECTION 1: AC CHARGERS (4 PRODUCTS • 2 PER PAGE SLIDER) */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'ac') && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FaPlug className="w-5 h-5" />
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">AC Chargers (4 Products)</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  7.4kW - 22kW Home & Commercial AC Smart Chargers with SEAI Grant support
                </p>
              </div>

              {/* PAGINATION CONTROLS (2 PRODUCTS PER PAGE) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">
                  Page {acPage} of {totalAcPages}
                </span>

                <button
                  onClick={() => setAcPage(p => Math.max(1, p - 1))}
                  disabled={acPage === 1}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    acPage === 1
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title="Previous 2 Products"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>

                {[...Array(totalAcPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAcPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      acPage === idx + 1
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setAcPage(p => Math.min(totalAcPages, p + 1))}
                  disabled={acPage === totalAcPages}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    acPage === totalAcPages
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title="Next 2 Products"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2 Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
              {paginatedAc.map(product => renderProductCard(product))}
            </div>
          </section>
        )}

        {/* SECTION 2: DC FAST CHARGERS (4 PRODUCTS • 2 PER PAGE SLIDER) */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'dc') && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <FaBolt className="w-5 h-5" />
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">DC Fast Chargers (4 Products)</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  50kW - 350kW High-Power Commercial & Highway DC Fast Chargers
                </p>
              </div>

              {/* PAGINATION CONTROLS (2 PRODUCTS PER PAGE) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">
                  Page {dcPage} of {totalDcPages}
                </span>

                <button
                  onClick={() => setDcPage(p => Math.max(1, p - 1))}
                  disabled={dcPage === 1}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    dcPage === 1
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title="Previous 2 Products"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>

                {[...Array(totalDcPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDcPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      dcPage === idx + 1
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setDcPage(p => Math.min(totalDcPages, p + 1))}
                  disabled={dcPage === totalDcPages}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    dcPage === totalDcPages
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title="Next 2 Products"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2 Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
              {paginatedDc.map(product => renderProductCard(product))}
            </div>
          </section>
        )}

        {/* SECTION 3: EV RELATED HARDWARE EQUIPMENT (6 PRODUCTS • 2 PER PAGE SLIDER) */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'hardware') && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <FaWrench className="w-5 h-5" />
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">EV Hardware Equipment (6 Products)</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Adapters, 10m TPU Cables, Load Balancers, Mounting Pedestals & RFID Fobs
                </p>
              </div>

              {/* PAGINATION CONTROLS (2 PRODUCTS PER PAGE) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">
                  Page {hwPage} of {totalHwPages}
                </span>

                <button
                  onClick={() => setHwPage(p => Math.max(1, p - 1))}
                  disabled={hwPage === 1}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    hwPage === 1
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title="Previous 2 Products"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>

                {[...Array(totalHwPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHwPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      hwPage === idx + 1
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setHwPage(p => Math.min(totalHwPages, p + 1))}
                  disabled={hwPage === totalHwPages}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    hwPage === totalHwPages
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title="Next 2 Products"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2 Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
              {paginatedHw.map(product => renderProductCard(product))}
            </div>
          </section>
        )}

      </div>

      {/* SLIDE-OUT E-COMMERCE CART DRAWER */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsCartOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FaCartShopping className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Shopping Cart</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    {cartCount} Items
                  </span>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full cursor-pointer"
                >
                  <FaXmark className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Banner */}
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <FaTruckFast className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Free Express Shipping included on all Ireland orders over €100!</span>
              </div>

              {/* Cart List */}
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <FaCartShopping className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Your shopping cart is empty.</p>
                  <p className="text-xs text-slate-400 mt-1">Browse AC, DC or hardware gear above to add products.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className={`w-14 h-14 rounded-xl ${
                          item.product.imageFit === 'contain'
                            ? 'object-contain p-1 bg-slate-100 dark:bg-slate-800'
                            : 'object-cover'
                        } shrink-0`}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">{item.product.powerOutput}</span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          €{item.product.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 rounded-xl">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                          <FaMinus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                          <FaPlus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                        title="Remove item"
                      >
                        <FaTrashCan className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Subtotal</span>
                  <span>€{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm font-black text-slate-900 dark:text-white">
                  <span>Estimated Total</span>
                  <span className="text-xl text-emerald-600 dark:text-emerald-400">€{cartTotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaLock className="w-3.5 h-3.5" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* QUICK PRODUCT SPEC VIEW MODAL */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer"
            >
              <FaXmark className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className={`w-24 h-24 rounded-2xl ${
                  selectedProduct.imageFit === 'contain'
                    ? 'object-contain p-1.5 bg-slate-100 dark:bg-slate-800'
                    : 'object-cover'
                } shrink-0`}
              />
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedProduct.badgeBg}`}>
                  {selectedProduct.badgeText}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedProduct.name}</h3>
                <span className="text-xs text-slate-500 font-semibold block mt-0.5">Model Code: {selectedProduct.modelCode}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {selectedProduct.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Power Rating</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">{selectedProduct.powerOutput}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Connector</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{selectedProduct.connectorType}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Weather Protection</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{selectedProduct.ipRating}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Warranty</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{selectedProduct.warranty}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">€{selectedProduct.price.toLocaleString()}</span>
                <span className="text-xs text-slate-400 line-through ml-2">€{selectedProduct.originalPrice.toLocaleString()}</span>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                Add to Cart 🛒
              </button>
            </div>

          </div>
        </div>
      )}

      {/* E-COMMERCE CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsCheckoutOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer"
            >
              <FaXmark className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold">
                <FaLock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Secure E-Commerce Checkout</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ChargeUP Hardware Store • 256-Bit SSL Encryption</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-300">Order Items ({cartCount})</span>
                <span className="font-black text-slate-900 dark:text-white">€{cartTotal.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam O'Connor"
                  defaultValue="Liam O'Connor"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Shipping Address (Ireland)</label>
                <input
                  type="text"
                  placeholder="Street Address, City, Eircode"
                  defaultValue="42 Grand Canal Dock, Dublin 2, D02 F890"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment Option</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-2">
                    <FaCreditCard /> Credit / Debit Card
                  </button>
                  <button className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2">
                    <FaTag /> Klarna (4x €{Math.round(cartTotal / 4)})
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('🎉 Order Placed Successfully! Your ChargeUP Hardware shipment confirmation has been sent to your email.');
                setCart([]);
                setIsCheckoutOpen(false);
              }}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaCheck className="w-4 h-4" />
              <span>Complete Order (€{cartTotal.toLocaleString()})</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Products;