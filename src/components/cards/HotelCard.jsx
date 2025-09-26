import { Star, MapPin, Wifi, Car, Utensils } from 'lucide-react';

const HotelCard = ({ hotel, onView }) => {
  console.log('HotelCard data:', hotel); 
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-2 border-transparent hover:border-yellow-400">
      {/* Hotel Image */}
      <div className="h-64 bg-gray-200 relative overflow-hidden">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900">{hotel.name}</h3>
          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold text-gray-900">{hotel.rating || 0}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{hotel.city}, {hotel.country}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description || hotel.address}</p>

        {/* Amenities */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
            <Wifi className="w-4 h-4 mr-1" />
            <span>WiFi</span>
          </div>
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
            <Car className="w-4 h-4 mr-1" />
            <span>Parking</span>
          </div>
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
            <Utensils className="w-4 h-4 mr-1" />
            <span>Restaurant</span>
          </div>
        </div>

        {/* Room Types */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Room Types</h4>
          <div className="space-y-2">
            {hotel.room_types?.slice(0, 2).map(room => (
              <div key={room.id} className="flex justify-between items-center text-sm bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-lg">
                <span className="font-medium">{room.name}</span>
                <span className="font-bold text-blue-600">${room.base_price || room.price}</span>
              </div>
            ))}
            {hotel.room_types?.length > 2 && (
              <div className="text-center text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                +{hotel.room_types.length - 2} more room types
              </div>
            )}
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-blue-600">${hotel.price || hotel.room_types?.[0]?.base_price || 'N/A'}</span>
            <span className="text-gray-500 text-sm block">starting from</span>
          </div>
          <button
            onClick={onView}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;