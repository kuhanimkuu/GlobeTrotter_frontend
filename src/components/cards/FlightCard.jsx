import React from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { format } from '../../utils/format';

const FlightCard = ({ flight, onBook }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookFlight = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/flights' } });
      return;
    }

    if (onBook) {
      onBook(flight);
    } else {
      navigate('/protected/booking', {
        state: { type: 'flight', data: flight }
      });
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      {/* Airline + Price */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
          <p className="text-sm text-gray-600">Offer ID: {flight.offer_id}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {format.currency(Number(flight.price), flight.currency)}
          </div>
          <p className="text-sm text-gray-600">per passenger</p>
        </div>
      </div>

      {/* Route Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {formatTime(flight.departure_time)}
          </div>
          <div className="text-sm text-gray-600">{flight.origin}</div>
        </div>

        <div className="flex-1 mx-4">
          <div className="border-t-2 border-gray-300 border-dashed relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 
                  1.414l-4 4a1 1 0 01-1.414-1.414L12.586 
                  11H5a1 1 0 110-2h7.586l-2.293-2.293a1 
                  1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {formatTime(flight.arrival_time)}
          </div>
          <div className="text-sm text-gray-600">{flight.destination}</div>
        </div>
      </div>

      {/* Seats */}
      <div className="text-sm text-green-600 mb-3">
        Seats available: {flight.seats_available}
      </div>

      {/* Book Now Button */}
      <div className="flex justify-end">
        <button
          onClick={handleBookFlight}
          disabled={flight.expired}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 ${
            flight.expired ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Book Now
        </button>
      </div>

      {/* Provider Badge */}
      {flight.provider && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            Via {flight.provider.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
