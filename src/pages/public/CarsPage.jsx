import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import CarCard from '../../components/cards/CarCard';

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    start_date: '',
    end_date: '',
    type: ''
  });

  const fetchCars = async (params = {}) => {
    try {
      const response =
        params && Object.keys(params).length > 0
          ? await api.inventory.searchCars(params)
          : await api.inventory.getCars();

      console.log("Cars API response:", response);

      setCars(response?.results || response || []);
      setError('');
    } catch (err) {
      console.error("Cars fetch error:", err);
      setError(err.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchCars(filters);
  };

  const handleReset = () => {
    setFilters({ location: '', start_date: '', end_date: '', type: '' });
    setLoading(true);
    fetchCars();
  };

  const carTypes = [
    { value: 'suv', label: 'SUV', icon: '' },
    { value: 'sedan', label: 'Sedan', icon: '' },
    { value: 'truck', label: 'Truck', icon: '' },
    { value: 'van', label: 'Van', icon: '' },
    { value: 'luxury', label: 'Luxury', icon: '' },
    { value: 'sports', label: 'Sports', icon: '' },
    { value: 'compact', label: 'Compact', icon: '' },
    { value: 'convertible', label: 'Convertible', icon: '' }
  ];

  const features = [
    { icon: '🔑', title: 'Easy Booking', description: 'Instant confirmation' },
    { icon: '💰', title: 'Best Prices', description: 'Guaranteed lowest rates' },
    { icon: '🛡️', title: 'Full Coverage', description: 'Comprehensive insurance' },
    { icon: '📞', title: '24/7 Support', description: 'Always here to help' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Homepage */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-yellow-400">Ride</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the perfect vehicle for your journey. From economy to luxury, we have cars for every adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/destinations"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
               Browse All Cars
            </Link>
            <Link
              to="/tour-packages"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
               Special Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Search Filters - Updated Design */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Ideal Car
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search through our extensive fleet of well-maintained vehicles
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Pick-up Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="City or Airport"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date
                  </label>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Car Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {carTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                   Search Cars
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold px-8 py-4 rounded-xl transition-all duration-200"
                >
                   Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose Us</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Experience the best car rental service with these amazing features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Types Grid */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Browse by Type</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Find the perfect vehicle for your specific needs
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {carTypes.map((type) => (
              <div
                key={type.value}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400 cursor-pointer group"
                onClick={() => {
                  setFilters({ ...filters, type: type.value });
                  setLoading(true);
                  fetchCars({ ...filters, type: type.value });
                }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h3 className="font-bold text-gray-900">{type.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Grid Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Vehicles
            </h2>
            <p className="text-xl text-gray-600">
              {cars.length} cars found matching your criteria
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
                <p className="text-gray-600">Loading available cars...</p>
              </div>
            </div>
          )}

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {/* Empty State */}
          {cars.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-8xl mb-6">🚗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars available</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all vehicles</p>
              <button
                onClick={handleReset}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Show All Cars
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your perfect car today and start your adventure with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
               Contact for Special Rates
            </Link>
            <button
              onClick={handleReset}
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
               Clear Filters
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarsPage;