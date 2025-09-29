import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import HotelCard from '../../components/cards/HotelCard';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewCard from '../../components/cards/ReviewCard';
import LoginRequiredPopup from '../../components/LoginRequiredPopup'; 
import { useAuth } from '../../contexts/useAuth';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    check_in: '',
    check_out: '',
    guests: 1,
  });
  const navigate = useNavigate();
  const [backendUrl] = useState('http://localhost:8000');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadHotels();
  }, []);

  const normalizeHotels = (data) =>
    data.map((h) => ({
      id: h.id || h.pk,
      name: h.name || 'Unnamed Hotel',
      description: h.description || '',
      image: h.cover_image_url
        ? (h.cover_image_url.startsWith("http") 
            ? h.cover_image_url 
            : `${backendUrl}${h.cover_image_url}`)
        : `${backendUrl}/placeholder/400/250`,
      city: h.city || '',
      country: h.country || '',
      rating: h.rating || 0,
      price: h.price || 0,
      available_rooms: h.available_rooms || 0,
      room_types:
        h.room_types?.map((r) => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          base_price: r.base_price,
          currency: r.currency,
          quantity: r.quantity,
          image_url: r.image_url,
        })) || [],
      reviews: h.reviews || [],
    }));

  const loadHotels = async () => {
    setLoading(true);
    try {
      const response = await api.inventory.getHotels();
      console.log('Hotels response:', response); 
      const data = Array.isArray(response)
        ? response
        : response?.results
        ? response.results
        : response?.data || [];
      setHotels(normalizeHotels(data));
    } catch (err) {
      console.error(err);
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {};
      if (filters.location) payload.location = filters.location;
      if (filters.check_in) payload.check_in = filters.check_in;
      if (filters.check_out) payload.check_out = filters.check_out;
      if (filters.guests && filters.guests > 1) payload.guests = filters.guests;

      const response = await api.inventory.searchHotels(payload);
      let data = Array.isArray(response)
        ? response
        : response?.results
        ? response.results
        : response?.data || [];
      setHotels(normalizeHotels(data));
    } catch (err) {
      console.error(err);
      setError('Failed to search hotels');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({ location: '', check_in: '', check_out: '', guests: 1 });
    setError('');
    setLoading(true);
    try {
      const response = await api.inventory.getHotels();
      const data = Array.isArray(response)
        ? response
        : response?.results
        ? response.results
        : response?.data || [];
      setHotels(normalizeHotels(data));
    } catch (err) {
      console.error(err);
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);

    try {
      const reviews = await api.reviews.list({
        content_type: 'hotel',
        object_id: hotel.id,
      });
      setSelectedHotel((prev) => ({
        ...prev,
        reviews: reviews?.filter((r) => r.is_approved) || [],
      }));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const closeModal = () => {
    setSelectedHotel(null);
    setIsModalOpen(false);
  };

  const bookHotel = () => {
  if (!selectedHotel) return;

  if (user) {
    navigate("/hotels-booking-wizard", {
      state: { data: selectedHotel },
    });
  } else {
    setShowLoginPopup(true);
  }
};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Luxury Hotels &
            <span className="block text-yellow-400">Amazing Stays</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the perfect accommodation for your journey. From luxury resorts to cozy boutique hotels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/tour-packages"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
               Find Your Stay
            </Link>
            <Link
              to="/destinations"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
               Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Stay</h2>
            
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                   Destination
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="City or Hotel"
                />
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                   Check-in
                </label>
                <input
                  type="date"
                  value={filters.check_in}
                  onChange={(e) => setFilters({ ...filters, check_in: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                   Check-out
                </label>
                <input
                  type="date"
                  value={filters.check_out}
                  onChange={(e) => setFilters({ ...filters, check_out: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                   Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={filters.guests}
                  onChange={(e) => setFilters({ ...filters, guests: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? ' Searching...' : 'Search Hotels'}
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={loading}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  Reset Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Hotels Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Hotels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing accommodations for your next adventure
            </p>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-2 border-transparent hover:border-yellow-400">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <p className="text-gray-500 mb-2">{hotel.city}, {hotel.country}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(hotel.rating))}
                        {"☆".repeat(5 - Math.floor(hotel.rating))}
                      </div>
                      <span className="text-gray-600 ml-2">({hotel.reviews?.length || 0} reviews)</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                    <div className="flex justify-between items-center">
                      
                      <button
                        onClick={() => openModal(hotel)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {!loading && hotels.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🏨</div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">No hotels found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading amazing hotels...</p>
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
            Ready to Book Your Stay?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find the perfect accommodation for your dream vacation. Luxury, comfort, and unforgettable experiences await.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tour-packages"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
               Explore All Hotels
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
               Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Hotel Modal */}
      {isModalOpen && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
            >
              ✕
            </button>

            {/* Hotel Image */}
            <div className="relative">
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                className="w-full h-64 sm:h-80 object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-3xl font-bold">{selectedHotel.name}</h2>
                <p className="text-blue-200">{selectedHotel.city}, {selectedHotel.country}</p>
              </div>
            </div>

            {/* Hotel Info */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-xl">
                  {"★".repeat(Math.floor(selectedHotel.rating))}
                  {"☆".repeat(5 - Math.floor(selectedHotel.rating))}
                </div>
                <span className="text-gray-600 ml-2">({selectedHotel.reviews?.length || 0} reviews)</span>
              </div>

              <p className="text-gray-700 mb-6 text-lg">{selectedHotel.description}</p>

              {/* Room Types */}
              {selectedHotel.room_types?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-4">Room Types & Prices</h3>
                  <div className="grid gap-4">
                    {selectedHotel.room_types.map((room) => (
                      <div
                        key={room.id}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-lg">{room.name}</span>
                            <span className="text-gray-600 ml-2">• {room.capacity} guests</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-blue-600 text-lg">${room.base_price}</span>
                            <span className="text-gray-500 block text-sm">Available: {room.quantity} rooms</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={bookHotel}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 mb-6 text-lg"
              >
                 Book Now
              </button>

              {/* Reviews Section */}
              <div className="border-t pt-6">
                <h3 className="text-2xl font-bold mb-4">Guest Reviews</h3>

                {/* Review Form */}
                <ReviewForm
                  type="hotel"
                  objectId={selectedHotel.id}
                  onSuccess={async () => {
                    try {
                      const reviews = await api.reviews.list({
                        content_type: 'hotel',
                        object_id: selectedHotel.id,
                      });
                      setSelectedHotel((prev) => ({
                        ...prev,
                        reviews: reviews?.filter((r) => r.is_approved) || [],
                      }));
                    } catch (err) {
                      console.error('Failed to reload reviews:', err);
                    }
                  }}
                />

                {/* Review List */}
                {selectedHotel.reviews?.length > 0 ? (
                  <div className="space-y-4 max-h-72 overflow-y-auto mb-4 pr-2">
                    {selectedHotel.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
                  {showLoginPopup && (
                    <LoginRequiredPopup onClose={() => setShowLoginPopup(false)} />
                  )}


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;