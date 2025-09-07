import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Backend base URL for relative images
  const backendUrl = 'http://localhost:8000';

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const response = await api.catalog.getDestinations();
      let data = [];
      if (Array.isArray(response)) data = response;
      else if (response?.results) data = response.results;
      else if (response?.data) data = response.data;

      const normalized = data.map(d => ({
        id: d.id || d.pk,
        name: d.name || 'Unnamed',
        description: d.description || '',
        image: d.image
          ? d.image.startsWith('http')
            ? d.image
            : `${backendUrl}${d.image}`
          : '/api/placeholder/400/250',
        country: d.country || '',
      }));

      setDestinations(normalized);
    } catch (err) {
      console.error(err);
      setError('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDestination(null);
    setIsModalOpen(false);
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Destinations</h1>

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
                  src={dest.image}
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
                  onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking link
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
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <img
              src={selectedDestination.image}
              alt={selectedDestination.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedDestination.name}</h2>
            {selectedDestination.country && (
              <p className="text-gray-500 mb-2">{selectedDestination.country}</p>
            )}
            <p className="text-gray-700 mb-4">{selectedDestination.description}</p>
            <Link
              to={`/tour-packages?destination=${selectedDestination.id}`}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center block"
            >
              View Tour Packages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
