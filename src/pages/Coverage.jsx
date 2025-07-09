import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';

const Coverage = () => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Color coding for different regions
  const regionColors = {
    Dhaka: '#FF6B6B',
    Chattogram: '#4ECDC4',
    Sylhet: '#45B7D1',
    Rangpur: '#96CEB4',
    Khulna: '#FFEAA7',
    Rajshahi: '#DDA0DD',
    Barisal: '#F39C12',
    Mymensingh: '#E74C3C',
  };

  // Load locations data from public folder
  useEffect(() => {
    const loadLocationsData = async () => {
      try {
        const response = await fetch('/warehouse.json');
        if (!response.ok) {
          throw new Error('Failed to load locations data');
        }
        const data = await response.json();
        setLocationsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadLocationsData();
  }, []);

  // Filter locations based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = locationsData.filter(
      (location) =>
        location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredLocations(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchQuery, locationsData]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle location selection with animation
  const handleLocationSelect = (location) => {
    if (leafletMapRef.current && !isAnimating) {
      setIsAnimating(true);

      // Find the corresponding marker
      const targetMarker = markers.find(
        (marker) =>
          marker.location.latitude === location.latitude &&
          marker.location.longitude === location.longitude
      );

      if (targetMarker) {
        const map = leafletMapRef.current;
        const currentZoom = map.getZoom();
        const targetZoom = 12;
        const currentCenter = map.getCenter();
        const targetCenter = [location.latitude, location.longitude];

        // Calculate distance to determine animation duration
        const distance = currentCenter.distanceTo(
          window.L.latLng(targetCenter[0], targetCenter[1])
        );
        const duration = Math.min(Math.max(distance / 100000, 0.5), 3); // Between 0.5 and 3 seconds

        // Create smooth fly animation
        map.flyTo(targetCenter, targetZoom, {
          animate: true,
          duration: duration,
          easeLinearity: 0.1,
        });

        // Open popup after animation completes
        setTimeout(() => {
          targetMarker.marker.openPopup();
          setIsAnimating(false);
        }, duration * 1000 + 200);
      } else {
        setIsAnimating(false);
      }
    }

    setSearchQuery(location.district);
    setShowSuggestions(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (
      !mapRef.current ||
      leafletMapRef.current ||
      loading ||
      locationsData.length === 0
    )
      return;

    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href =
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!window.L || leafletMapRef.current) return;

      // Initialize map centered on Bangladesh
      const map = window.L.map(mapRef.current, {
        center: [23.685, 90.3563],
        zoom: 7,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        zoomControl: true,
      });

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add markers for all locations using Lucide icons
      const createdMarkers = [];

      locationsData.forEach((location) => {
        const color = regionColors[location.region] || '#45B7D1';

        // Create a custom icon using Lucide MapPin with animation classes
        const icon = window.L.divIcon({
          className: 'custom-location-icon',
          html: `
            <div class="marker-container" style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
              background: ${color};
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              transition: all 0.3s ease;
              animation: pulse 2s infinite;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const popupContent = `
          <div style="text-align: center; min-width: 200px;">
            <h3 style="margin: 0; color: ${color}; font-size: 16px;">${
          location.city
        }</h3>
            <p style="margin: 5px 0; color: #666; font-size: 12px;">${
              location.district
            } District</p>
            <p style="margin: 5px 0; color: #666; font-size: 12px;">${
              location.region
            } Region</p>
            <div style="margin-top: 8px;">
              <p style="margin: 2px 0; font-size: 11px; color: #888;">Coverage Areas:</p>
              <p style="margin: 2px 0; font-size: 11px; color: #555;">${location.covered_area.join(
                ', '
              )}</p>
            </div>
          </div>
        `;

        const marker = window.L.marker(
          [location.latitude, location.longitude],
          { icon }
        )
          .addTo(map)
          .bindPopup(popupContent);

        createdMarkers.push({ marker, location });
      });

      setMarkers(createdMarkers);

      // Add CSS animations to the map container
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        .marker-container:hover {
          transform: scale(1.2) !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.4) !important;
          z-index: 1000;
        }
        
        .leaflet-popup-content-wrapper {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .leaflet-container {
          transition: all 0.3s ease;
        }
        
        .search-loading {
          position: relative;
          overflow: hidden;
        }
        
        .search-loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          animation: searchShimmer 1.5s infinite;
        }
        
        @keyframes searchShimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `;
      document.head.appendChild(style);

      leafletMapRef.current = map;
    };

    loadLeaflet();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [locationsData, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
          <p className="text-gray-600">
            Please make sure locations-data.json exists in the public folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            We are available in 64 districts
          </h1>
          <p className="text-center mt-4 text-lg opacity-90">
            Showing {locationsData.length} locations across Bangladesh
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search districts or cities..."
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={isAnimating}
                className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  isAnimating
                    ? 'search-loading opacity-50 cursor-not-allowed'
                    : ''
                }`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && !isAnimating && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                  >
                    <div
                      className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-sm mr-3 transition-transform duration-200 hover:scale-110"
                      style={{
                        backgroundColor:
                          regionColors[location.region] || '#45B7D1',
                      }}
                    >
                      <MapPin size={12} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {location.city}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.district} District, {location.region}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading indicator during animation */}
            {isAnimating && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-600">
                    Navigating to location...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend Section */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Regional Coverage</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(regionColors).map(([region, color]) => (
              <div key={region} className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  <MapPin size={12} color="white" />
                </div>
                <span className="text-sm text-gray-700">{region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={mapRef} className="w-full" style={{ height: '600px' }} />
        </div>
      </div>
    </div>
  );
};

export default Coverage;
