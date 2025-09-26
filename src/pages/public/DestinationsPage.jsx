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

  const handleSearch = (e) => {
    e.preventDefault();
    loadDestinations(searchQuery);
  };

  const handleReset = () => {
    setSearchQuery('');
    loadDestinations();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching HomePage */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Explore Amazing
            <span className="block text-yellow-400">Destinations</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the world's most breathtaking places and start planning your next adventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/tour-packages"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              🌍 Start Exploring
            </Link>
            <Link
              to="/hotels"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              🏨 Find Stays
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Find Your Dream Destination</h2>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search destinations by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-6 py-4 rounded-xl transition-all duration-200"
                >
                  Reset
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

      {/* Destinations Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing places around the world for your next adventure
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading amazing destinations...</p>
            </div>
          ) : (
            <>
              {/* Destinations Grid */}
              {destinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {destinations.map(dest => (
                    <div
                      key={dest.id}
                      className="group cursor-pointer"
                      onClick={() => openModal(dest)}
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-2 border-transparent hover:border-yellow-400">
                        <div className="relative overflow-hidden">
                          <img
                            src={dest.cover_image_url}
                            alt={dest.name}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {dest.country && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                                {dest.country}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{dest.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{dest.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-600 font-semibold">Explore Packages</span>
                            <span className="text-2xl">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">🌍</div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">No destinations found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later for new destinations</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready for Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start planning your dream vacation today. Amazing experiences await in every corner of the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tour-packages"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              📦 View All Packages
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              💬 Get Advice
            </Link>
          </div>
        </div>
      </section>

      {/* Destination Modal */}
      {isModalOpen && selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
            >
              ✕
            </button>

            {/* Destination Image */}
            <div className="relative">
              <img
                src={selectedDestination.cover_image_url}
                alt={selectedDestination.name}
                className="w-full h-64 sm:h-80 object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-3xl font-bold">{selectedDestination.name}</h2>
                {selectedDestination.country && (
                  <p className="text-blue-200 text-lg">{selectedDestination.country}</p>
                )}
              </div>
            </div>

            {/* Destination Content */}
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">{selectedDestination.description}</p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Link
                  to={`/tour-packages?destination=${selectedDestination.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center text-lg"
                >
                  🎒 View Tour Packages
                </Link>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all duration-200 text-lg"
                >
                  Close Preview
                </button>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-6">
                <h3 className="text-2xl font-bold mb-4">Traveler Reviews</h3>

                {/* Review Form */}
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

                {/* Review List */}
                {selectedDestination.reviews?.length > 0 ? (
                  <div className="space-y-4 max-h-72 overflow-y-auto mb-4 pr-2">
                    {selectedDestination.reviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8 text-lg">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;