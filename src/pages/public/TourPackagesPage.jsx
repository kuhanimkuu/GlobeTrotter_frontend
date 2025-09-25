import React, { useState, useEffect } from 'react';
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
      navigate(`/book/${pkg.id}`);
    } else {
      setShowLoginPopup(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tour Packages</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <input
              type="text"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Any destination"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <select
              value={filters.duration}
              onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Any duration</option>
              <option value="1-3">1-3 days</option>
              <option value="4-7">4-7 days</option>
              <option value="8+">8+ days</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <select
              value={filters.price_range}
              onChange={(e) => setFilters({ ...filters, price_range: e.target.value })}
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
              Search
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

     {/* Packages */}
{packages.filter(pkg => {
    if (!pkg.end_date) return true;
    return new Date(pkg.end_date) > new Date();
  }).length === 0 ? (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">🌴</div>
    <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
    <p className="text-gray-600">Try adjusting your search criteria</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {packages
      .filter(pkg => {
        if (!pkg.end_date) return true;
        return new Date(pkg.end_date) > new Date();
      })
      .map((pkg) => (
        <TourPackageCard
          key={pkg.id}
          tourPackage={pkg}
          onViewDetails={() => setSelectedPackage(pkg)}
        />
      ))}
  </div>
)}


      {/*  Package Details Modal */}
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
