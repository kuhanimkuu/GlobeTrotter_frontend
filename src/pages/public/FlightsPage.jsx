import React, { useState, useEffect } from 'react';
import FlightCard from '../../components/cards/FlightCard';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plane, Users, Calendar, Navigation, RefreshCw } from 'lucide-react';
import LoginRequiredPopup from "../../components/LoginRequiredPopup";

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
   const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

 
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
    console.log(' Sending flight search request with:', searchParams);

    try {
      const data = await api.flights.search(searchParams);
      console.log(' Flight search response:', data);
      setFlights(normalizeFlights(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(' Flight search failed:', err);
      setError(err.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

const handleBookFlight = (flight) => {
  if (!user) {
    setShowLoginPopup(true);
    return;
  }

  if (flight.expired) {
    alert("This flight offer has expired.");
    return;
  }

  navigate("/flights-booking-wizard", {
    state: { type: "flight", data: flight },
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-yellow-400">Flight</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover amazing flight deals to destinations around the world. Your journey starts with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
               Search Flights
            </button>
            <Link
              to="/destinations"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-20 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-4xl font-bold text-center mb-6">Search Flights</h2>
          <form onSubmit={searchFlights} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Navigation className="w-4 h-4 inline mr-1 text-green-500" />
                  From
                </label>
                <input
                  type="text"
                  required={false}
                  value={searchParams.origin}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, origin: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="City or Airport"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Navigation className="w-4 h-4 inline mr-1 text-red-500" />
                  To
                </label>
                <input
                  type="text"
                  required={false}
                  value={searchParams.destination}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, destination: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="City or Airport"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1 text-blue-500" />
                  Departure
                </label>
                <input
                  type="date"
                  required={false}
                  value={searchParams.departure_date}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, departure_date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1 text-purple-500" />
                  Passengers
                </label>
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-8 py-4 rounded-xl transition-all duration-200 border border-gray-300 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">Searching for the best flights...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8 mt-8">
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Flight Search Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="mt-12">
          <h2 className="text-4xl font-bold text-center mb-4">
            Available Flights
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {flights.length > 0 
              ? `Found ${flights.length} amazing flight options for your journey`
              : "Discover the perfect flight for your next adventure"
            }
          </p>

          {/* Flight Results */}
          {flights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onBook={handleBookFlight}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            !loading && (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
                <div className="text-8xl mb-6"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No flights found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchParams.origin || searchParams.destination 
                    ? "Try adjusting your search criteria or browse all available flights."
                    : "Search for flights to see amazing deals to destinations worldwide!"
                  }
                </p>
                {(searchParams.origin || searchParams.destination) && (
                  <button
                    onClick={resetForm}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    Show All Flights
                  </button>
                )}
         
              </div>
            )
          )}
                 {showLoginPopup && (
          <LoginRequiredPopup onClose={() => setShowLoginPopup(false)} />
        )}

        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready for Takeoff?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your flight today and start your next adventure with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetForm}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              Browse All Flights
            </button>
            <Link
              to="/destinations"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlightsPage;