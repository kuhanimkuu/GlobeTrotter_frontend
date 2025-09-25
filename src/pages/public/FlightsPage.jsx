import React, { useState, useEffect } from 'react';
import FlightCard from '../../components/cards/FlightCard';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const FlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    passengers: 1,
  });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const normalizeFlights = (flights) =>
    flights.map((f) => ({
      ...f,
      price: f.price || {
        currency: f.currency || 'USD',
        amount: f.total_price || f.amount || 0,
      },
    }));

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await api.flights.search({});
        console.log('Flights loaded:', resp);
        setFlights(Array.isArray(resp) ? resp : []);
      } catch (err) {
        console.error('Failed to load flights:', err);
        setError('Could not load flights');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const searchFlights = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlights([]);
    console.log('🚀 Sending flight search request with:', searchParams);

    try {
      const data = await api.flights.search(searchParams);
      console.log('✅ Flight search response:', data);
      setFlights(normalizeFlights(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error('❌ Flight search failed:', err);
      setError(err.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flight) => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/flights' } });
      return;
    }

    if (flight.expired) {
      alert('This flight offer has expired.');
      return;
    }

    navigate('/flights-booking-wizard', {
      state: { type: 'flight', data: flight },
    });
  };

  const resetForm = async () => {
    setSearchParams({
      origin: '',
      destination: '',
      departure_date: '',
      passengers: 1,
    });
    setError('');
    setLoading(true);
    try {
      const resp = await api.flights.search({});
      setFlights(Array.isArray(resp) ? resp : []);
    } catch (err) {
      console.error('Failed to load flights:', err);
      setError('Could not load flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Search Box */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Search Flights</h2>
        <form
          onSubmit={searchFlights}
          noValidate
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              required={false} 
              value={searchParams.origin}
              onChange={(e) =>
                setSearchParams({ ...searchParams, origin: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="City or Airport"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="text"
              required={false} 
              value={searchParams.destination}
              onChange={(e) =>
                setSearchParams({ ...searchParams, destination: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="City or Airport"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Departure</label>
            <input
              type="date"
              required={false} 
              value={searchParams.departure_date}
              onChange={(e) =>
                setSearchParams({ ...searchParams, departure_date: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Passengers</label>
            <input
              type="number"
              min="1"
              required={false} 
              value={searchParams.passengers}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  passengers: Number(e.target.value),
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
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

      {/* Flight Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onBook={handleBookFlight}
          />
        ))}
      </div>

      {/* No Results */}
      {!loading && flights.length === 0 && !error && (
        <p className="text-center text-gray-600 mt-8">
          No flights found. Try a different search.
        </p>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching for flights...</p>
        </div>
      )}
    </div>
  );
};

export default FlightsPage;
