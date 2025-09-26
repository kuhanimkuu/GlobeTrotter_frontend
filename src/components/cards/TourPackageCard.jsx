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
   <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 relative group">
  {/* Image */}
  <div className="h-48 p-2 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden rounded-2xl">
  {main_image_url ? (
    <img 
      src={main_image_url} 
      alt={title} 
      className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300" 
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-xl">
      <span className="text-white font-semibold text-4xl">🌴</span>
    </div>
  )}

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Availability or Expired */}
    <div className="absolute top-3 left-3">
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
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

    {/* Price Badge */}
    <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm">
      ${Number(total_price || base_price).toFixed(0)}
    </div>
  </div>

  {/* Content */}
  <div className="p-6 md:p-8 space-y-4">
    <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
      {summary}
    </p>

    {/* Destination */}
    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-1">
      <MapPin className="w-4 h-4 text-blue-500" />
      <span className="font-medium">{destination?.name || "Unknown destination"}</span>
      {destination?.country && (
        <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
          {destination.country}
        </span>
      )}
    </div>

    {/* Dates */}
    {(startDate || endDate) && (
      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-1">
        <Calendar className="w-4 h-4 text-green-500" />
        <span className="text-xs">
          {startDate && `${startDate.toLocaleDateString()}`}
          {endDate && ` - ${endDate.toLocaleDateString()}`}
        </span>
      </div>
    )}

    {/* Duration & Capacity */}
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 space-x-2">
      <div className="flex items-center bg-blue-50 px-3 py-2 rounded-full">
        <Calendar className="w-4 h-4 mr-1 text-blue-600" />
        <span className="text-xs font-medium">{duration_days}d/{nights}n</span>
      </div>
      <div className="flex items-center bg-green-50 px-3 py-2 rounded-full">
        <Users className="w-4 h-4 mr-1 text-green-600" />
        <span className="text-xs font-medium">Max {max_capacity}</span>
      </div>
    </div>

    {/* Hotel & Car Info */}
    <div className="space-y-2 mb-4">
      {hotel && (
        <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Hotel className="w-3 h-3 mr-2 text-purple-500" />
          <span className="font-medium">Stay: {hotel.name}</span>
        </div>
      )}
      {car && (
        <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Car className="w-3 h-3 mr-2 text-orange-500" />
          <span className="font-medium">
            {car.make} {car.model}
            {car.driver_name && ` • Driver: ${car.driver_name}`}
          </span>
        </div>
      )}
    </div>

    {/* Rating & Price */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm font-bold text-gray-900">4.8</span>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-green-600">
          ${Number(total_price || base_price).toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 font-medium">{currency}</div>
      </div>
    </div>

    {/* Action Button */}
    <button
      onClick={onViewDetails}
      disabled={isExpired}
      className={`w-full text-center py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
        isExpired
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-blue shadow-lg hover:shadow-xl"
      }`}
    >
      {isExpired ? "Package Expired" : "View Details & Book"}
    </button>
  </div>
</div>

  );
};

export default TourPackageCard;