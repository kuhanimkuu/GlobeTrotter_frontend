import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import TourPackageCard from '../../components/cards/TourPackageCard';
const TourPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    destination: '',
    duration: '',
    price_range: ''
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await api.catalog.getPackages();
      setPackages(response.data || response.results || []);
    } catch (err) {
      setError('Failed to load tour packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.catalog.searchPackages(filters);
      setPackages(response.data || response.results || []);
    } catch (err) {
      setError('Failed to search packages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tour Packages</h1>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <input
              type="text"
              value={filters.destination}
              onChange={(e) => setFilters({...filters, destination: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Any destination"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <select
              value={filters.duration}
              onChange={(e) => setFilters({...filters, duration: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Any duration</option>
              <option value="1-3">1-3 days</option>
              <option value="4-7">4-7 days</option>
              <option value="8+">8+ days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <select
              value={filters.price_range}
              onChange={(e) => setFilters({...filters, price_range: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Any price</option>
              <option value="0-500">Under $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000+">Over $1000</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Search Packages
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <TourPackageCard key={pkg.id} package={pkg} />
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌴</div>
          <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default TourPackagesPage;