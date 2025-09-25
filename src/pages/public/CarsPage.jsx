import React, { useState, useEffect } from 'react';
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

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Overlay loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Car Rentals</h1>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="City or Airport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pick-up Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Drop-off Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Car Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="suv">SUV</option>
              <option value="sedan">Sedan</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div className="flex gap-2 items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* Empty State */}
      {cars.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚗</div>
          <h3 className="text-lg font-medium text-gray-900">No cars available</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default CarsPage;
