import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { format } from '../../utils/format';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const response = await api.catalog.getDestinations();
      setDestinations(response.data || response.results || []);
    } catch (err) {
      setError('Failed to load destinations');
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-3xl font-bold mb-8">Popular Destinations</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer">
            <div className="relative">
              <img 
                src={destination.image || '/api/placeholder/400/250'} 
                alt={destination.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {destination.country}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    {format.currency(destination.starting_price)}
                  </span>
                  <span className="text-gray-600 text-sm"> starting from</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-400">
                    {'★'.repeat(Math.floor(destination.rating || 4))}
                    <span className="text-gray-600 ml-1">({destination.review_count || 0})</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/tour-packages?destination=${destination.id}`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center block"
              >
                View Packages
              </Link>
            </div>
          </div>
        ))}
      </div>

      {destinations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌍</div>
          <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
          <p className="text-gray-600">Check back later for new destinations</p>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;