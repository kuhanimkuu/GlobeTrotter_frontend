import React from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { format } from '../../utils/format';
import { Plane, Clock, Users, MapPin, ArrowRight, Shield } from 'lucide-react';

const FlightCard = ({ flight, onBook }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookFlight = () => {
  if (onBook) {
    onBook(flight);   
  }
};


  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-yellow-400 group">
      {/* Airline + Price */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Plane className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {flight.airline}
            </h3>
            <p className="text-sm text-gray-600">Flight • {flight.flight_number || flight.offer_id?.slice(-6)}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">
            {format.currency(Number(flight.price), flight.currency)}
          </div>
          <p className="text-sm text-gray-600">per passenger</p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(flight.departure_time)}
            </div>
            <div className="text-sm text-gray-600 font-medium">{flight.origin}</div>
            <div className="text-xs text-gray-500 mt-1">
              {flight.departure_date && new Date(flight.departure_date).toLocaleDateString()}
            </div>
          </div>

          {/* Flight Path */}
          <div className="flex-1 mx-4 relative">
            <div className="flex items-center justify-center">
              <div className="border-t-2 border-blue-300 border-dashed w-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(flight.duration)}
              </div>
              {flight.stops > 0 && (
                <div className="text-xs text-orange-600">
                  {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(flight.arrival_time)}
            </div>
            <div className="text-sm text-gray-600 font-medium">{flight.destination}</div>
            <div className="text-xs text-gray-500 mt-1">
              {flight.arrival_date && new Date(flight.arrival_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Flight Details Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="font-bold text-sm text-gray-900">{flight.seats_available}</p>
          <p className="text-xs text-gray-600">Seats Left</p>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="font-bold text-sm text-gray-900">Insured</p>
          <p className="text-xs text-gray-600">Full Coverage</p>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <span className="text-lg">🎫</span>
          <p className="font-bold text-sm text-gray-900">E-Ticket</p>
          <p className="text-xs text-gray-600">Instant</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex flex-wrap gap-2 mb-6">
        {flight.cabin_class && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium">
            {flight.cabin_class}
          </span>
        )}
        {flight.refundable && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
            Refundable
          </span>
        )}
        {flight.baggage_allowance && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
            {flight.baggage_allowance}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleBookFlight}
          disabled={flight.expired || flight.seats_available === 0}
          className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
            flight.expired || flight.seats_available === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {flight.expired ? 'Expired' : 
           flight.seats_available === 0 ? 'Sold Out' : 
           ' Book Flight'}
        </button>
        
      </div>

      {/* Provider Badge */}
      {flight.provider && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
              Via {flight.provider.toUpperCase()}
            </span>
            {flight.rating && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Rated {flight.rating}/5
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;