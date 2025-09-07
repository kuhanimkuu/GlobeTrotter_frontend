import { Star, MapPin, Wifi, Car, Utensils } from 'lucide-react';

const HotelCard = ({ hotel, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Hotel Image */}
      <div className="h-48 bg-gray-200 relative">
        {hotel.cover_image_url ? (
          <img
            src={hotel.cover_image_url}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-white font-semibold">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{hotel.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold">{hotel.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{hotel.destination?.name}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.address}</p>

        {/* Amenities */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Wifi className="w-4 h-4 mr-1" />
            <span>WiFi</span>
          </div>
          <div className="flex items-center">
            <Car className="w-4 h-4 mr-1" />
            <span>Parking</span>
          </div>
          <div className="flex items-center">
            <Utensils className="w-4 h-4 mr-1" />
            <span>Restaurant</span>
          </div>
        </div>

        {/* Room Types */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Room Types</h4>
          <div className="space-y-1">
            {hotel.room_types?.slice(0, 3).map(room => (
              <div key={room.id} className="flex justify-between text-sm">
                <span>{room.name}</span>
                <span className="font-semibold">${room.base_price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VIEW HOTEL BUTTON */}
        <button
          onClick={onView} // <-- Add this line
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
        >
          View Hotel
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
