import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import TourPackageCard from '../../components/cards/TourPackageCard';
import PackageDetailModal from '../../components/PackageDetailModal';
import LoginRequiredPopup from '../../components/LoginRequiredPopup'; 
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const TourPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [filters, setFilters] = useState({
    destination: '',
    duration: '',
    price_range: ''
  });
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const response = await api.catalog.getPackages();
      const data = Array.isArray(response) ? response : [];
      setPackages(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load tour packages. Please try again later.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadPackages();
  };

  const handleReset = () => {
    setFilters({ destination: '', duration: '', price_range: '' });
    loadPackages();
  };

  const handleBook = (pkg) => {
    if (user) {
      navigate(`/booking-wizard`);
    } else {
      setShowLoginPopup(true);
    }
  };

  const destinations = [
    { name: "Maasai Mara", icon: "🦁" },
    { name: "Diani Beach", icon: "🏖️" },
    { name: "Dubai", icon: "🏙️" },
    { name: "Paris", icon: "🗼" },
    { name: "Tokyo", icon: "🗾" },
    { name: "New York", icon: "🗽" }
  ];

  const packageTypes = [
    { icon: "🌴", title: "Beach Getaways", description: "Relaxing coastal escapes" },
    { icon: "🦁", title: "Safari Adventures", description: "Wildlife experiences" },
    { icon: "🏙️", title: "City Breaks", description: "Urban explorations" },
    { icon: "⛰️", title: "Mountain Treks", description: "Adventure hiking" }
  ];

  const activePackages = packages.filter(pkg => {
    if (!pkg.end_date) return true;
    return new Date(pkg.end_date) > new Date();
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Homepage */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Amazing
            <span className="block text-yellow-400">Tour Packages</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Curated travel experiences that create unforgettable memories. All-inclusive packages for every type of traveler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/destinations"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              🌍 Explore All Packages
            </Link>
            <button
              onClick={() => document.getElementById('packages-grid').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              📦 View Deals
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Popular Destinations</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our most sought-after travel destinations around the world
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setFilters({ ...filters, destination: dest.name })}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {dest.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{dest.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Filters - Updated Design */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Package
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Customize your search to discover packages that match your dream vacation
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌍 Destination
                  </label>
                  <input
                    type="text"
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Any destination"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⏱️ Duration
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Any duration</option>
                    <option value="1-3">1-3 days</option>
                    <option value="4-7">4-7 days</option>
                    <option value="8+">8+ days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💰 Price Range
                  </label>
                  <select
                    value={filters.price_range}
                    onChange={(e) => setFilters({ ...filters, price_range: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Any price</option>
                    <option value="0-500">Under $500</option>
                    <option value="500-1000">$500 - $1000</option>
                    <option value="1000+">Over $1000</option>
                  </select>
                </div>
                <div className="flex gap-2 items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    🔍 Search
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 rounded-xl transition-all duration-200"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Package Types */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Package Categories</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Find the perfect package type for your travel style
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packageTypes.map((type, index) => (
              <div key={index} className="text-center group">
                <div className="bg-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section id="packages-grid" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Tour Packages
            </h2>
            <p className="text-xl text-gray-600">
              {activePackages.length} packages available for booking
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading amazing packages...</p>
              </div>
            </div>
          )}

          {/* Packages Grid */}
          {activePackages.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-8xl mb-6">🌴</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all packages</p>
              <button
                onClick={handleReset}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Show All Packages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePackages.map((pkg) => (
                <TourPackageCard
                  key={pkg.id}
                  tourPackage={pkg}
                  onViewDetails={() => setSelectedPackage(pkg)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">🔥 Limited Time Offers!</h2>
          <p className="text-xl text-yellow-100 mb-6">Book now and get up to 30% off on selected packages</p>
          <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
            🎁 View Special Deals
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready for Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us help you create memories that will last a lifetime. Your dream vacation is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              📞 Contact Our Experts
            </Link>
            <button
              onClick={handleReset}
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              🌟 Custom Package
            </button>
          </div>
        </div>
      </section>

      {/* Package Details Modal */}
      {selectedPackage && (
        <PackageDetailModal
          tourPackage={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onBook={handleBook}
        />
      )}

      {/* Login Required Popup */}
      {showLoginPopup && (
        <LoginRequiredPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </div>
  );
};

export default TourPackagesPage;