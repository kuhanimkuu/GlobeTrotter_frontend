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
      navigate('/protected/booking', { state: { type: 'flight', data: flight } });
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {flight.airline_logo && (
            <img 
              src={flight.airline_logo} 
              alt={flight.airline}
              className="w-8 h-8 mr-3 object-contain"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
            <p className="text-sm text-gray-600">{flight.flight_number}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {format.currency(flight.price, flight.currency)}
          </div>
          <p className="text-sm text-gray-600">per passenger</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {formatTime(flight.departure_time)}
          </div>
          <div className="text-sm text-gray-600">{flight.origin_code}</div>
          <div className="text-xs text-gray-500">{flight.origin_name}</div>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <div className="border-t-2 border-gray-300 border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            {formatDuration(flight.duration)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {formatTime(flight.arrival_time)}
          </div>
          <div className="text-sm text-gray-600">{flight.destination_code}</div>
          <div className="text-xs text-gray-500">{flight.destination_name}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
        </div>
        
        <button
          onClick={handleBookFlight}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Book Flight
        </button>
      </div>

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















{/* 
import React from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { format } from '../../utils/format';

const FlightCard = ({ flight, onBook }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookFlight = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/flights' } });
      return;
    }
    
    if (onBook) {
      onBook(flight);
    } else {
      // Default booking behavior
      navigate('/booking/flight', { state: { flight } });
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
       Airline & Price Header */}
       {/*
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {flight.airlineLogo && (
            <img 
              src={flight.airlineLogo} 
              alt={flight.airline}
              className="w-8 h-8 mr-3 object-contain"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
            <p className="text-sm text-gray-600">{flight.flightNumber}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {format.currency(flight.price, flight.currency)}
          </div>
          <p className="text-sm text-gray-600">per passenger</p>
        </div>
      </div>

       Flight Route */}{/*
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {formatTime(flight.departureTime)}
          </div>
          <div className="text-sm text-gray-600">{flight.originCode}</div>
          <div className="text-xs text-gray-500">{flight.originName}</div>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <div className="border-t-2 border-gray-300 border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white p-1">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            {formatDuration(flight.duration)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {formatTime(flight.arrivalTime)}
          </div>
          <div className="text-sm text-gray-600">{flight.destinationCode}</div>
          <div className="text-xs text-gray-500">{flight.destinationName}</div>
        </div>
      </div>

       Flight Details */}{/*
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          {flight.availableSeats} seats left
        </div>
        
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {flight.aircraftType}
        </div>
      </div>

       Booking Action */}{/*
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {flight.stops === 0 ? 'Non-stop' : 
           `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
        </div>
        
        <button
          onClick={handleBookFlight}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Book Flight
        </button>
      </div>

      Provider Badge */} {/*
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

// Default props for external API data structure
FlightCard.defaultProps = {
  flight: {
    airline: 'Unknown Airline',
    flightNumber: '',
    price: 0,
    currency: 'USD',
    departureTime: new Date(),
    arrivalTime: new Date(),
    originCode: '',
    originName: '',
    destinationCode: '',
    destinationName: '',
    duration: 0,
    availableSeats: 0,
    aircraftType: '',
    stops: 0,
    provider: 'amadeus',
    airlineLogo: null
  }
};

export default FlightCard; 
*/}
 