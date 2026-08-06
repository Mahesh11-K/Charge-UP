// src/pages/Locations.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import LiveVehicleStatus from '../components/LiveVehicleStatus';
import API from '../api/axios';

interface EVStation {
  id: number;
  name: string;
  city: string;
  kwSpeed: string;
  connectors: string;
  status: 'Available' | 'Occupied';
  lat: number;
  lng: number;
  pricePerKwh?: string;
}

// Rich Dataset of Dublin City EV Charging Stations
const DUBLIN_DUMMY_STATIONS: EVStation[] = [
  { id: 201, name: "Grand Canal Dock Rapid Charging Hub", city: "Dublin 2", kwSpeed: "150 kW", connectors: "CCS / CHAdeMO", status: "Available", lat: 53.3438, lng: -6.2398, pricePerKwh: "0.45" },
  { id: 202, name: "Grafton Street Mall Charging Station", city: "Dublin 2", kwSpeed: "50 kW", connectors: "Type 2 / CCS", status: "Available", lat: 53.3412, lng: -6.2598, pricePerKwh: "0.40" },
  { id: 203, name: "Red Cow Interchange Supercharger", city: "Dublin 22", kwSpeed: "350 kW", connectors: "CCS", status: "Available", lat: 53.3175, lng: -6.3712, pricePerKwh: "0.50" },
  { id: 204, name: "Ballsbridge Herbert Park EV Point", city: "Dublin 4", kwSpeed: "22 kW", connectors: "Type 2", status: "Occupied", lat: 53.3283, lng: -6.2291, pricePerKwh: "0.35" },
  { id: 205, name: "Dundrum Town Centre Fast Charger", city: "Dublin 14", kwSpeed: "150 kW", connectors: "CCS / CHAdeMO", status: "Available", lat: 53.2878, lng: -6.2415, pricePerKwh: "0.45" },
  { id: 206, name: "Blanchardstown Shopping Hub", city: "Dublin 15", kwSpeed: "220 kW", connectors: "CCS", status: "Available", lat: 53.3922, lng: -6.3888, pricePerKwh: "0.48" },
  { id: 207, name: "Dublin Airport T2 Express Station", city: "Co. Dublin", kwSpeed: "350 kW", connectors: "CCS / CHAdeMO", status: "Available", lat: 53.4264, lng: -6.2499, pricePerKwh: "0.52" },
  { id: 208, name: "Phoenix Park Gate Charging Point", city: "Dublin 8", kwSpeed: "50 kW", connectors: "Type 2", status: "Occupied", lat: 53.3512, lng: -6.2911, pricePerKwh: "0.38" },
  { id: 209, name: "Sandyford Business Park Hub", city: "Dublin 18", kwSpeed: "150 kW", connectors: "CCS", status: "Available", lat: 53.2778, lng: -6.2081, pricePerKwh: "0.45" }
];

const Locations: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') || searchParams.get('q') || '';

  const [stations, setStations] = useState<EVStation[]>(DUBLIN_DUMMY_STATIONS);
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery); 
  const [selectedStation, setSelectedStation] = useState<EVStation | null>(DUBLIN_DUMMY_STATIONS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: maplibregl.Marker }>({});

  // Sync searchQuery when URL query param changes
  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Dynamic Search Filtering
  const filteredStations = stations.filter((station) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      station.name.toLowerCase().includes(query) ||
      station.city.toLowerCase().includes(query) ||
      station.connectors.toLowerCase().includes(query) ||
      station.kwSpeed.toLowerCase().includes(query)
    );
  });

  // Maintain active selection
  useEffect(() => {
    if (filteredStations.length > 0) {
      const isStillVisible = filteredStations.some((s) => s.id === selectedStation?.id);
      if (!isStillVisible) {
        setSelectedStation(filteredStations[0]);
      }
    } else {
      setSelectedStation(null);
    }
  }, [searchQuery, stations, selectedStation?.id]);


  // Load Station Data
  useEffect(() => {
    const loadStationData = async () => {
      setIsLoading(true);

      try {
        const response = await API.get('/stations');
        if (response.data && response.data.length > 0) {
          setStations(response.data);
          setSelectedStation(response.data[0]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Backend server offline. Querying OpenChargeMap API / Geolocation...');
      }

      setStations(DUBLIN_DUMMY_STATIONS);
      setSelectedStation(DUBLIN_DUMMY_STATIONS[0]);
      setIsLoading(false);
    };

    loadStationData();
  }, []);

  // Initialize Map Instance conditionally when `showMap` becomes true
  useEffect(() => {
    if (!showMap || !mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: selectedStation ? [selectedStation.lng, selectedStation.lat] : [-6.2603, 53.3498],
        zoom: 13,
        maxZoom: 16,
        minZoom: 8,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      mapRef.current = map;

      map.on('load', () => {
        map.resize();
      });
    } else if (selectedStation) {
      mapRef.current.easeTo({
        center: [selectedStation.lng, selectedStation.lat],
        zoom: 13,
        duration: 1000,
      });
    }

    // Render Markers
    if (mapRef.current) {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      filteredStations.forEach((station) => {
        const isSelected = selectedStation?.id === station.id;
        const el = document.createElement('div');
        
        // CONDITIONAL STYLING FOR GLOW EFFECT
        if (isSelected) {
          el.className = 'w-6 h-6 rounded-full border-[3px] border-white bg-emerald-500 shadow-[0_0_15px_5px_rgba(16,185,129,0.7)] cursor-pointer z-50 animate-pulse';
        } else {
          el.className = 'w-4 h-4 rounded-full border-2 border-white shadow-sm bg-emerald-700 cursor-pointer opacity-60 hover:opacity-100 transition-opacity';
        }

        // Add a click listener so users can select stations directly from the map
        el.addEventListener('click', () => {
          setSelectedStation(station);
        });

        if (mapRef.current) {
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([station.lng, station.lat])
            .addTo(mapRef.current);

          markersRef.current[station.id] = marker;
        }
      });
    }
  }, [showMap, selectedStation, filteredStations]); // Make sure dependencies cover state used

  const handleSelectStation = (station: EVStation) => {
    setSelectedStation(station);
  };

  const handleNavigateToStation = (station: EVStation) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-16 sm:pt-18 pb-12 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-md">
            Dublin EV Network
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mt-3 mb-2">
            Dublin City Charging Hubs
          </h1>
          <p className="text-slate-500 max-w-2xl font-normal text-base">
            Find active charging hubs across Dublin City, view live vehicle battery stats, and navigate directly.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Station Search & Scrollable Station List */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Search Box */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search Dublin stations, areas, or connectors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scrollable Container with Fixed Height */}
            <div className="space-y-3.5 overflow-y-auto max-h-[680px] pr-2 rounded-2xl scrollbar-thin scrollbar-thumb-slate-200">
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 font-medium">Loading Dublin charging points...</div>
              ) : filteredStations.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-medium">
                  No stations found matching "<span className="text-slate-700">{searchQuery}</span>".
                </div>
              ) : (
                filteredStations.map((station) => (
                  <div
                    key={station.id}
                    onClick={() => handleSelectStation(station)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedStation?.id === station.id
                        ? 'border-emerald-500 bg-white shadow-md shadow-emerald-600/5 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight leading-snug">
                        {station.name}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          station.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {station.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 font-medium mb-3">
                      📍 {station.city}, Dublin, Ireland
                    </p>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 border-t border-slate-100 pt-3">
                      <div>⚡ Speed: <span className="text-slate-900">{station.kwSpeed}</span></div>
                      <div>🔌 Ports: <span className="text-slate-900">{station.connectors}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Live Vehicle Status Widget & Station Profile */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Live Vehicle Status Widget */}
            <LiveVehicleStatus mode="inline" />

            {/* 2. Selected Station Detailed Profile Card */}
            {selectedStation && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/80">
                      STATION PROFILE DETAILS
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-2.5">{selectedStation.name}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">📍 Location: {selectedStation.city}, Dublin, Ireland</p>
                  </div>

                  {/* Two Separate Medium Action Buttons */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className={`font-bold px-4 py-2.5 rounded-xl transition-all border text-xs tracking-wide uppercase inline-flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        showMap 
                          ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span>🗺️</span> {showMap ? 'Hide Map' : 'Show Map'}
                    </button>

                    <button
                      onClick={() => handleNavigateToStation(selectedStation)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4.5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-600/20 text-xs tracking-wide uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🧭</span> Navigate
                    </button>
                  </div>
                </div>

                {/* Station Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Charging Speed</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">{selectedStation.kwSpeed}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Connector Types</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">{selectedStation.connectors}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Rate / kWh</p>
                    <p className="text-base sm:text-lg font-bold text-emerald-600 mt-1">€{selectedStation.pricePerKwh || '0.45'}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Current Status</p>
                    <p className={`text-base sm:text-lg font-bold mt-1 ${
                      selectedStation.status === 'Available' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {selectedStation.status}
                    </p>
                  </div>
                </div>

                {/* Conditional Map View */}
                {showMap && (
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Interactive Dublin Map View</span>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-2 relative h-[380px] w-full overflow-hidden shadow-inner border border-slate-200">
                      <div 
                        ref={mapContainerRef} 
                        className="absolute inset-0 w-full h-full rounded-xl" 
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Locations;