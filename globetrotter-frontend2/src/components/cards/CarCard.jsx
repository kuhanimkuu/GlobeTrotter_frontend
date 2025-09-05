import { Car, MapPin, Users, Fuel } from 'lucide-react';

const CarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Car Image */}
      <div className="h-48 bg-gray-200 relative">
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <Car className="w-12 h-12 text-white" />
          </div>
        )}
        {!car.available && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {car.make} {car.model}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{car.destination?.name}</span>
        </div>

        {/* Car Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-1 text-gray-400" />
            <span>{car.category}</span>
          </div>
          <div className="flex items-center text-sm">
            <Fuel className="w-4 h-4 mr-1 text-gray-400" />
            <span>Automatic</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-green-600">
              ${car.daily_rate}
              <span className="text-sm font-normal text-gray-600">/day</span>
            </div>
            <div className="text-sm text-gray-500">{car.currency}</div>
          </div>
        </div>

        <button
          className={`w-full py-2 rounded transition-colors ${
            car.available
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!car.available}
        >
          {car.available ? 'Rent Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default CarCard;