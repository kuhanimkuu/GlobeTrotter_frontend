import React, { useState, useEffect } from 'react';
import FlightCard from '../../components/cards/FlightCard';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';

const FlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    passengers: 1
  });
  const { isAuthenticated } = useAuth();

  const searchFlights = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.flights.search(searchParams);
      setFlights(response.data || response.results || []);
    } catch (err) {
      setError(err.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flight) => {
    if (!isAuthenticated) {
      alert('Please login to book flights');
      return;
    }
    console.log('Booking flight:', flight);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Search Flights</h2>
        <form onSubmit={searchFlights} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              value={searchParams.origin}
              onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="City or Airport"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="text"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="City or Airport"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Departure</label>
            <input
              type="date"
              value={searchParams.departure_date}
              onChange={(e) => setSearchParams({...searchParams, departure_date: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Flights'}
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
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onBook={handleBookFlight}
          />
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for flights...</p>
        </div>
      )}
    </div>
  );
};

export default FlightsPage;