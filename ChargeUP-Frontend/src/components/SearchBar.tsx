// src/components/SearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'station' | 'product' | 'price' | 'page' | 'feature';
  path: string;
  badgeText?: string;
  icon?: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Charging Stations
  {
    id: 'st-1',
    title: 'Grand Canal Dock Hub',
    subtitle: 'Dublin 2 • 150 kW Rapid (CCS/CHAdeMO)',
    category: 'station',
    path: '/locations?search=Grand+Canal',
    badgeText: 'Available',
    icon: '⚡'
  },
  {
    id: 'st-2',
    title: 'Grafton Street Mall Station',
    subtitle: 'Dublin 2 • 50 kW Fast Charger',
    category: 'station',
    path: '/locations?search=Grafton',
    badgeText: 'Available',
    icon: '⚡'
  },
  {
    id: 'st-3',
    title: 'Red Cow Supercharger',
    subtitle: 'Dublin 22 • 350 kW Ultra-Fast CCS',
    category: 'station',
    path: '/locations?search=Red+Cow',
    badgeText: 'Available',
    icon: '🚀'
  },
  {
    id: 'st-4',
    title: 'Dundrum Town Centre Hub',
    subtitle: 'Dublin 14 • 150 kW Rapid Charger',
    category: 'station',
    path: '/locations?search=Dundrum',
    badgeText: 'Available',
    icon: '⚡'
  },
  {
    id: 'st-5',
    title: 'Blanchardstown Hub',
    subtitle: 'Dublin 15 • 220 kW High-Power Charging',
    category: 'station',
    path: '/locations?search=Blanchardstown',
    badgeText: 'Available',
    icon: '⚡'
  },
  {
    id: 'st-6',
    title: 'Dublin Airport T2 Express',
    subtitle: 'Co. Dublin • 350 kW Ultra-Fast',
    category: 'station',
    path: '/locations?search=Dublin+Airport',
    badgeText: 'Available',
    icon: '✈️'
  },
  {
    id: 'st-7',
    title: 'Sandyford Business Hub',
    subtitle: 'Dublin 18 • 150 kW CCS Charger',
    category: 'station',
    path: '/locations?search=Sandyford',
    badgeText: 'Available',
    icon: '⚡'
  },
  {
    id: 'st-8',
    title: 'Phoenix Park Gate Point',
    subtitle: 'Dublin 8 • 50 kW Type 2',
    category: 'station',
    path: '/locations?search=Phoenix+Park',
    badgeText: 'Occupied',
    icon: '🌲'
  },

  // Products
  {
    id: 'pr-1',
    title: 'Nectar Smart Home Charger',
    subtitle: '7.4 kW / 22 kW • SEAI Grant Approved',
    category: 'product',
    path: '/products',
    badgeText: '€549',
    icon: '🏠'
  },
  {
    id: 'pr-2',
    title: 'Charge-UP AC Portable Pro',
    subtitle: '3.3 kW / 7.4 kW • Emergency Irish Plug',
    category: 'product',
    path: '/products',
    badgeText: '€299',
    icon: '🔌'
  },
  {
    id: 'pr-3',
    title: 'AdWall Commercial Hub',
    subtitle: '22 kW Dual Port • Built-in Screen',
    category: 'product',
    path: '/products',
    badgeText: '€2,499',
    icon: '🏬'
  },
  {
    id: 'pr-4',
    title: 'DC Portable Ranger',
    subtitle: '30 kW Rapid Suitcase Charger',
    category: 'product',
    path: '/products',
    badgeText: '€6,850',
    icon: '💼'
  },

  // Prices & Plans
  {
    id: 'pc-1',
    title: 'Pay As You Go Plan',
    subtitle: '€0.45 / kWh • Standard Rapid Rate',
    category: 'price',
    path: '/prices',
    badgeText: 'Popular',
    icon: '💳'
  },
  {
    id: 'pc-2',
    title: 'Monthly Saver Subscription',
    subtitle: '€9.99 / mo • 15% Station Discount',
    category: 'price',
    path: '/prices',
    badgeText: 'Best Value',
    icon: '⭐'
  },

  // Pages
  {
    id: 'pg-1',
    title: 'Charging Locations Map',
    subtitle: 'Real-time Dublin EV charger map',
    category: 'page',
    path: '/locations',
    badgeText: 'Map',
    icon: '🗺️'
  },
  {
    id: 'pg-2',
    title: 'Products Store',
    subtitle: 'Shop smart home & portable chargers',
    category: 'page',
    path: '/products',
    badgeText: 'Store',
    icon: '🛒'
  },
  {
    id: 'pg-3',
    title: 'Pricing & Plans',
    subtitle: 'Compare charging rates & subscriptions',
    category: 'page',
    path: '/prices',
    badgeText: 'Rates',
    icon: '💰'
  },
  {
    id: 'pg-4',
    title: 'Customer Reviews',
    subtitle: 'Read genuine EV driver ratings',
    category: 'page',
    path: '/reviews',
    badgeText: '4.9 ★',
    icon: '🌟'
  },
  {
    id: 'pg-5',
    title: 'Support & Contact',
    subtitle: '24/7 Irish EV customer service',
    category: 'page',
    path: '/contact',
    badgeText: 'Help',
    icon: '📞'
  },
  {
    id: 'pg-6',
    title: 'Vehicle Dashboard',
    subtitle: 'Monitor EV battery % & range live',
    category: 'page',
    path: '/dashboard',
    badgeText: 'App',
    icon: '🚗'
  }
];

const POPULAR_SEARCHES = [
  { label: 'Grand Canal', path: '/locations?search=Grand+Canal' },
  { label: 'Supercharger', path: '/locations?search=Supercharger' },
  { label: 'Home Charger', path: '/products' },
  { label: 'Prices', path: '/prices' }
];

export const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    return SEARCH_DATABASE.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badgeText && item.badgeText.toLowerCase().includes(q))
    );
  }, [query]);

  // Handle global Cmd/Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        setQuery('');
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        if (!query) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
        handleSelectResult(filteredResults[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/locations?search=${encodeURIComponent(query.trim())}`);
        closeSearch();
      }
    }
  };

  const handleSelectResult = (result: SearchResultItem) => {
    navigate(result.path);
    closeSearch();
  };

  const closeSearch = () => {
    setIsExpanded(false);
    setIsFocused(false);
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleExpandClick = () => {
    setIsExpanded(true);
    setIsFocused(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const getCategoryBadgeClass = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'station':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'product':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'price':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'page':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'feature':
        return 'bg-teal-50 text-teal-700 border-teal-200/60';
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Search Bar Pill matching reference navbar screenshot */}
      <div 
        className={`relative flex items-center h-10.5 px-3.5 rounded-full transition-all duration-300 ease-out border ${
          isExpanded || isFocused
            ? 'w-56 sm:w-72 md:w-84 bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
            : 'w-44 sm:w-56 md:w-68 bg-slate-100/90 border-slate-200/80 hover:bg-slate-200/70 hover:border-slate-300'
        }`}
      >
        {/* Soft Purple/Cyan Accent Search Icon Box */}
        <button
          type="button"
          onClick={handleExpandClick}
          className="w-6.5 h-6.5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:scale-105"
          aria-label="Search"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            setIsExpanded(true);
            setIsFocused(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search stations, cities..."
          className="w-full pl-2.5 pr-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            title="Clear search"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Live Animated Search Results Panel */}
      {isFocused && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-84 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Quick Suggestions when query is empty */}
          {!query.trim() && (
            <div className="p-3.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Quick Suggestions</span>
                <span className="text-[10px] text-slate-400 font-normal">Esc to close</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      closeSearch();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold border border-slate-200/60 transition-all duration-150 flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span className="text-[10px]">⚡</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Search Results */}
          {query.trim().length > 0 && (
            <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
              {filteredResults.length > 0 ? (
                <div>
                  <div className="px-3.5 py-1.5 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Results ({filteredResults.length})</span>
                    <span>Use ↑ ↓ to navigate</span>
                  </div>

                  {filteredResults.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group px-3.5 py-2.5 flex items-center gap-2.5 cursor-pointer transition-all duration-150 ${
                          isSelected 
                            ? 'bg-emerald-50/90 border-l-3 border-emerald-600 pl-3 translate-x-0.5' 
                            : 'hover:bg-slate-50/80 hover:translate-x-0.5'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center text-sm shrink-0 transition-colors">
                          {item.icon || '⚡'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                              {item.title}
                            </h4>
                            {item.badgeText && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 flex items-center gap-1 ${getCategoryBadgeClass(item.category)}`}>
                                {item.badgeText === 'Available' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                                {item.badgeText}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 text-center">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-base">
                    🔍
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">No results for "{query}"</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto mb-3">
                    Try searching for <span className="text-emerald-600 font-semibold">"Dublin"</span>, <span className="text-emerald-600 font-semibold">"Home Charger"</span>, or <span className="text-emerald-600 font-semibold">"Prices"</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/locations?search=${encodeURIComponent(query.trim())}`);
                      closeSearch();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Search on Map ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer Bar */}
          <div className="px-3.5 py-1.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Press <kbd className="px-1 py-0.2 bg-white border border-slate-200 rounded font-mono text-[9px] text-slate-500">↵ Enter</kbd> to search</span>
            <button 
              type="button"
              onClick={closeSearch}
              className="hover:text-slate-600 font-semibold cursor-pointer"
            >
              Close [Esc]
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default SearchBar;
