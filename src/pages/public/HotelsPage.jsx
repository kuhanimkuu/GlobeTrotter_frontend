// src/pages/public/HotelsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import HotelCard from '../../components/cards/HotelCard';
import ReviewList from '../../components/reviews/ReviewList';
import ReviewForm from '../../components/reviews/ReviewForm';
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
  const [backendUrl] = useState('http://localhost:8000'); // adjust if different

  useEffect(() => {
    loadHotels();
  }, []);

const normalizeHotels = (data) => {
  return data.map(h => ({
    id: h.id || h.pk,
    name: h.name || 'Unnamed Hotel',
    description: h.description || '',
      image: h.cover_image_url
      ? `${backendUrl}${h.cover_image_url}` // prepend backend URL
      : `${backendUrl}/placeholder/400/250`, // fallback placeholder
    city: h.city || '',
    country: h.country || '',
    rating: h.rating || 0,
    price: h.price || 0,
    available_rooms: h.available_rooms || 0,
    room_types: h.room_types?.map(r => ({
      id: r.id,
      name: r.name,
      capacity: r.capacity,
      base_price: r.base_price,
      currency: r.currency,
      quantity: r.quantity,
      image_url: r.image_url,
    })) || [],
  }));
};

  const loadHotels = async () => {
    setLoading(true);
    try {
      const response = await api.inventory.getHotels();
      let data = Array.isArray(response)
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
    try {
      const response = await api.inventory.searchHotels(filters);
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

  const openModal = (hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHotel(null);
    setIsModalOpen(false);
  };

  const bookHotel = () => {
    if (!selectedHotel) return;
    navigate('/booking-wizard', {
      state: {
        type: 'hotel',
        data: {
          hotel_id: selectedHotel.id,
          hotel_name: selectedHotel.name,
          location: `${selectedHotel.city}, ${selectedHotel.country}`,
          price: selectedHotel.price,
        },
      },
    });
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
      <h1 className="text-3xl font-bold mb-8">Hotels</h1>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="City or Hotel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-in</label>
            <input
              type="date"
              value={filters.check_in}
              onChange={(e) => setFilters({ ...filters, check_in: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-out</label>
            <input
              type="date"
              value={filters.check_out}
              onChange={(e) => setFilters({ ...filters, check_out: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Search Hotels
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} onView={() => openModal(hotel)} />
        ))}
      </div>

      {hotels.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <h3 className="text-lg font-medium text-gray-900">No hotels found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

{/* Hotel Modal */}
{isModalOpen && selectedHotel && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full sm:w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto p-6 relative">

      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
      >
        ✕
      </button>

      {/* Hotel Image */}
      <img
        src={selectedHotel.image}
        alt={selectedHotel.name}
        className="w-full h-48 sm:h-56 object-cover rounded mb-4"
      />

      {/* Hotel Info */}
      <h2 className="text-2xl font-bold mb-1">{selectedHotel.name}</h2>
      <p className="text-gray-500 mb-1">{selectedHotel.city}, {selectedHotel.country}</p>
      <p className="text-gray-700 mb-4">{selectedHotel.description}</p>

      {/* Room Types */}
      {selectedHotel.room_types?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Room Types & Prices</h3>
          <div className="space-y-2">
            {selectedHotel.room_types.map(room => (
              <div key={room.id} className="flex justify-between bg-gray-50 p-2 rounded items-center text-sm">
                <div>
                  <span className="font-semibold">{room.name}</span> – {room.capacity} pax
                </div>
                <div className="text-right">
                  <span className="font-semibold">${room.base_price}</span>
                  <span className="text-gray-500 ml-2">Available: {room.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Now Button */}
      <button
        onClick={bookHotel}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mb-4"
      >
        Book Now
      </button>

      {/* Reviews Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Reviews</h3>

        {/* Review List */}
        {selectedHotel.reviews?.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
            {selectedHotel.reviews.map((review) => (
              <div key={review.id} className="border p-2 rounded text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{review.user.username}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                </div>
                {review.title && <p className="font-medium">{review.title}</p>}
                <p>{review.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4 text-sm">No reviews yet.</p>
        )}

        {/* Review Form */}
        <ReviewForm
          type="hotel"
          objectId={selectedHotel.id}
          onSuccess={async () => {
            try {
              const res = await api.reviews.list({ content_type: 'hotel', object_id: selectedHotel.id });
              setSelectedHotel((prev) => ({
                ...prev,
                reviews: res.results || [],
              }));
            } catch (err) {
              console.error("Failed to reload reviews:", err);
            }
          }}
        />
      </div>
    </div>
  </div>
)}
    </div>
)}


export default HotelsPage;
