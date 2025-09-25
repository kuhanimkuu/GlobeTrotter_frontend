import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewCard from '../../components/cards/ReviewCard';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const backendUrl = 'http://localhost:8000';

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await api.catalog.getDestinations();
      console.log("API raw response:", response);
      let data = Array.isArray(response)
        ? response
        : response?.results || response?.data || [];

      if (query) {
        data = data.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));
      }

      const normalized = data.map(d => ({
        id: d.id || d.pk,
        name: d.name || 'Unnamed',
        description: d.description || '',
        cover_image_url: d.cover_image_url
          ? d.cover_image_url.replace("http://", "https://")
            ? d.cover_image_url
            : `${backendUrl}${d.cover_image_url}`
          : '/api/placeholder/400/250',
        country: d.country || '',
        reviews: [],
      }));

      setDestinations(normalized);
    } catch (err) {
      console.error(err);
      setError('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);

    try {
      const reviews = await api.reviews.list({
        content_type: 'destination',
        object_id: destination.id,
      });
      setSelectedDestination(prev => ({
        ...prev,
        reviews: reviews?.filter(r => r.is_approved) || [],
      }));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const closeModal = () => {
    setSelectedDestination(null);
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    loadDestinations(searchQuery);
  };

  const handleReset = () => {
    setSearchQuery('');
    loadDestinations();
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Destinations</h1>

      {/* Search + Reset */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map(dest => (
            <div
              key={dest.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
              onClick={() => openModal(dest)}
            >
              <div className="relative">
                <img
                  src={dest.cover_image_url}
                  alt={dest.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {dest.country && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">{dest.country}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{dest.description}</p>
                <Link
                  to={`/tour-packages?destination=${dest.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center block"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Tour Packages
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌍</div>
          <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
          <p className="text-gray-600">Check back later for new destinations</p>
        </div>
      )}

      {/* Modal */}
    {isModalOpen && selectedDestination && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative 
                    max-h-[80vh] overflow-y-auto">
      {/* Top-right Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full font-bold"
      >
        ✕ Close
      </button>

      {/* Cover Image */}
      <img
        src={selectedDestination.cover_image_url}
        alt={selectedDestination.name}
        className="w-full h-48 object-cover rounded mb-4"
      />

      {/* Content */}
      <h2 className="text-2xl font-bold mb-2">{selectedDestination.name}</h2>
      {selectedDestination.country && (
        <p className="text-gray-500 mb-2">{selectedDestination.country}</p>
      )}
      <p className="text-gray-700 mb-4">{selectedDestination.description}</p>

      <Link
        to={`/tour-packages?destination=${selectedDestination.id}`}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center block mb-4"
      >
        View Tour Packages
      </Link>

      {/* Footer Close Button */}
      <button
        onClick={closeModal}
        className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 mb-4"
      >
        Close
      </button>

      {/* Reviews Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Reviews</h3>

        <ReviewForm
          type="destination"
          objectId={selectedDestination.id}
          onSuccess={async () => {
            try {
              const reviews = await api.reviews.list({
                content_type: 'destination',
                object_id: selectedDestination.id,
              });
              setSelectedDestination(prev => ({
                ...prev,
                reviews: reviews?.filter(r => r.is_approved) || [],
              }));
            } catch (err) {
              console.error('Failed to reload reviews:', err);
            }
          }}
        />

        {selectedDestination.reviews?.length > 0 ? (
          <div className="space-y-4 max-h-48 overflow-y-auto mb-4 pr-2">
            {selectedDestination.reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4 text-sm">No reviews yet.</p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default DestinationsPage;
