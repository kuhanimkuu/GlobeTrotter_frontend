import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Star, X, Hotel, Car, Shield, Utensils, Wifi } from "lucide-react";

const PackageDetailModal = ({ tourPackage, onClose, onBook }) => {
  if (!tourPackage) return null;

  const navigate = useNavigate();

  const {
    main_image_url,
    title,
    summary,
    destination,
    start_date,
    end_date,
    duration_days,
    nights,
    max_capacity,
    base_price,
    total_price,
    currency,
    is_active,
    hotel,
    car,
    highlights,
    policies,
    inclusions,
    exclusions
  } = tourPackage;

  const startDate = start_date ? new Date(start_date) : null;
  const endDate = end_date ? new Date(end_date) : null;
  const isExpired = endDate && new Date() > endDate;

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
<div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] overflow-y-auto relative p-6 md:p-8">
  {/* Close Button */}
  <button
    className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 transition-all duration-200 transform hover:scale-110 shadow-lg"
    onClick={onClose}
  >
    <X className="w-5 h-5" />
  </button>

  {/* Hero Image Section */}
  <div className="relative h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden mb-4">
    {main_image_url ? (
      <img
        src={main_image_url}
        alt={title}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <span className="text-4xl md:text-5xl">🌴</span>
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

    {/* Status Badge */}
    <div className="absolute top-3 left-3">
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
          isExpired
            ? "bg-red-500/90 text-white"
            : is_active
            ? "bg-green-500/90 text-white"
            : "bg-gray-500/90 text-white"
        }`}
      >
        {isExpired ? "✈️ Expired" : is_active ? "✅ Available" : "❌ Unavailable"}
      </span>
    </div>

    {/* Title Overlay */}
    <div className="absolute bottom-3 left-3 right-3">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
        {title}
      </h2>
      <div className="flex items-center gap-1 text-white/90 text-xs md:text-sm">
        <MapPin className="w-4 h-4" />
        <span>
          {destination?.name || "N/A"} {destination?.country && `, ${destination.country}`}
        </span>
      </div>
    </div>
  </div>

  {/* Content Section */}
  <div className="space-y-4 md:space-y-6">
    {/* Summary */}
    <div>
      <p className="text-gray-700 text-sm md:text-base leading-relaxed bg-blue-50/50 p-4 rounded-2xl border-l-4 border-yellow-500">
        {summary || "No summary available."}
      </p>
    </div>

    {/* Quick Info Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-2xl text-center">
        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mx-auto mb-1" />
        <p className="font-semibold text-gray-900 text-xs md:text-sm">{duration_days} Days</p>
        <p className="text-xs text-gray-600">{nights} Nights</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-2xl text-center">
        <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600 mx-auto mb-1" />
        <p className="font-semibold text-gray-900 text-xs md:text-sm">{max_capacity || "N/A"}</p>
        <p className="text-xs text-gray-600">Max Capacity</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-2xl text-center">
        <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mx-auto mb-1" />
        <p className="font-semibold text-gray-900 text-xs md:text-sm">{currency}</p>
        <p className="text-xs text-gray-600">Currency</p>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-2xl text-center">
        <div className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 mx-auto mb-1 text-xl">💰</div>
        <p className="font-semibold text-gray-900 text-xs md:text-sm">{formatPrice(total_price || base_price)}</p>
        <p className="text-xs text-gray-600">Total Price</p>
      </div>
    </div>
      {/* Detailed Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Trip Details */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Trip Dates
                </h3>
                <div className="space-y-3">
                  {startDate && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">Start Date:</span>
                      <span className="text-blue-600 font-semibold">{startDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  {endDate && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">End Date:</span>
                      <span className="text-blue-600 font-semibold">{endDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Highlights */}
              {highlights && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-600" />
                    Trip Highlights
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{highlights}</p>
                </div>
              )}
            </div>

            {/* Right Column - Policies & Inclusions */}
            <div className="space-y-6">
              {/* Inclusions */}
              {inclusions && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-green-600" />
                   Inclusions
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{inclusions}</p>
                </div>
              )}

              {/* Exclusions */}
              {exclusions && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-red-600" />
                    Exclusions
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{exclusions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Information */}
          {hotel && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Hotel className="w-7 h-7 text-blue-600" />
                  🏨 Accommodation
                </h3>
                
                {hotel.cover_image_url && (
                  <img
                    src={hotel.cover_image_url}
                    alt={hotel.name}
                    className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
                  />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p><strong className="text-gray-900">Name:</strong> {hotel.name}</p>
                    <p><strong className="text-gray-900">Address:</strong> {hotel.address}</p>
                    <p><strong className="text-gray-900">City:</strong> {hotel.city}</p>
                    <p><strong className="text-gray-900">Rating:</strong> ⭐ {hotel.rating || "N/A"}</p>
                  </div>
                  
                  {hotel.room_types?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-lg mb-3">Room Types</h4>
                      <div className="space-y-3">
                        {hotel.room_types.map(room => (
                          <div key={room.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                            {room.image_url && (
                              <img
                                src={room.image_url}
                                alt={room.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{room.name}</p>
                              <p className="text-sm text-gray-600">Capacity: {room.capacity} pax</p>
                              <p className="text-sm text-blue-600 font-medium">
                                {room.base_price} {room.currency} × {room.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Car Information */}
          {car && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Car className="w-7 h-7 text-gray-600" />
                  🚐 Transportation
                </h3>
                
                {car.image_url && (
                  <img
                    src={car.image_url}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
                  />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p><strong className="text-gray-900">Provider:</strong> {car.provider || "N/A"}</p>
                    <p><strong className="text-gray-900">Vehicle:</strong> {car.make} {car.model}</p>
                    <p><strong className="text-gray-900">Category:</strong> {car.category}</p>
                    <p><strong className="text-gray-900">Daily Rate:</strong> {car.daily_rate} {car.currency}</p>
                    <p><strong className="text-gray-900">City:</strong> {car.city || "N/A"}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg mb-3">👨‍✈️ Driver Information</h4>
                    <div className="space-y-2 bg-white p-4 rounded-xl">
                      <p><strong>Name:</strong> {car.driver_name || "N/A"}</p>
                      <p><strong>Contact:</strong> {car.driver_contact || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 transition-all duration-200"
            >
              Close Details
            </button>
            <button
              onClick={() => onBook ? onBook(tourPackage) : navigate(`/booking-wizard`, { state: { type: "package", data: tourPackage, id:tourPackage.id } })}
              disabled={isExpired || !is_active}
              className={`px-8 py-3 font-bold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                isExpired || !is_active
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-700 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isExpired ? "Package Expired" : "Book This Package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailModal;
