import { Star, MapPin, Calendar, Users, Car, Hotel } from "lucide-react";

const TourPackageCard = ({ tourPackage, onViewDetails }) => {
  if (!tourPackage) return null;

  const {
    main_image_url,
    title = "Untitled Package",
    summary = "No description available.",
    destination,
    duration_days = 0,
    nights = 0,
    max_capacity = 0,
    base_price = "0",
    total_price = "0",
    currency = "USD",
    is_active = false,
    hotel,
    car,
    start_date,
    end_date,
  } = tourPackage;


  const startDate = start_date ? new Date(start_date) : null;
  const endDate = end_date ? new Date(end_date) : null;
  const isExpired = endDate && new Date() > endDate;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Image */}
      <div className="h-48 bg-gray-200 relative">
        {main_image_url ? (
          <img src={main_image_url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-semibold">No Image</span>
          </div>
        )}

        {/* Availability or Expired */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              isExpired
                ? "bg-red-100 text-red-800"
                : is_active
                ? "bg-green-100 text-green-800"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isExpired ? "Expired" : is_active ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{summary}</p>

        {/* Destination Name */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{destination?.name || "Unknown destination"}</span>
        </div>

        {/* Destination Country */}
        {destination?.country && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{destination.country}</span>
          </div>
        )}

        {/* Dates */}
        {(startDate || endDate) && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {startDate && `Start: ${startDate.toLocaleDateString()}`}
              {endDate && ` • End: ${endDate.toLocaleDateString()}`}
            </span>
          </div>
        )}

        {/* Duration & Capacity */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {duration_days} days / {nights} nights
            </span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Max {max_capacity} people</span>
          </div>
        </div>

        {/* Hotel, Car & Driver Info */}
        <div className="flex flex-col text-sm text-gray-500 mb-2 space-y-1">
          {hotel && (
            <div className="flex items-center">
              <Hotel className="w-4 h-4 mr-1" />
              <span>{hotel.name}</span>
            </div>
          )}
          {car && (
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-1" />
              <span>{car.make} {car.model}</span>
            </div>
          )}
          {car?.driver_name && (
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-1" />
              <span>Driver: {car.driver_name}</span>
            </div>
          )}
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-green-600">
            ${Number(total_price || base_price).toFixed(2)}
            <span className="text-sm font-normal text-gray-600"> {currency}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold">4.8</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          disabled={isExpired}
          className={`w-full text-white text-center py-2 rounded transition-colors ${
            isExpired
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isExpired ? "Expired" : "View Details"}
        </button>
      </div>
    </div>
  );
};

export default TourPackageCard;
