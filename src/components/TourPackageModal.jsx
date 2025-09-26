import React from "react";
import { format } from "../utils/format";

const TourPackageModal = ({ isOpen, onClose, packageData, onBook }) => {
  if (!isOpen || !packageData) return null;

  const {
    title,
    summary,
    description,
    highlights,
    policies,
    destination,
    hotel,
    car,
    images,
    main_image_url,
    total_price,
    average_rating,
    total_reviews,
    start_date,
    end_date,
    base_price,
    commission,
  } = packageData;

  // Calculate duration in days
  const getDuration = () => {
    if (!start_date || !end_date) return "-";
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " days";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        >
          ×
        </button>

        {/* Hero Image */}
        {main_image_url && (
          <div className="relative h-64 md:h-80">
            <img
              src={main_image_url}
              alt={title}
              className="w-full h-full object-cover rounded-t-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
              <p className="text-blue-100 text-lg">{summary}</p>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-center">
              <div className="text-gray-600 text-sm">📍 Destination</div>
              <div className="font-semibold">{destination?.name || "-"}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm">⏱️ Duration</div>
              <div className="font-semibold">{getDuration()}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm">⭐ Rating</div>
              <div className="font-semibold">{average_rating?.toFixed(1) || 0}/5</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm">💰 Price</div>
              <div className="font-semibold text-yellow-600">{format.currency(total_price)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => onBook && onBook(packageData)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
            >
              🎫 Book Now
            </button>
            <button className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold px-6 py-3 rounded-xl transition-all duration-200">
              💖 Save Package
            </button>
          </div>

          {/* Additional Images Grid */}
          {images?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">📸 Package Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.slice(0, 6).map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt={img.caption || title}
                    className="w-full h-24 md:h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Hotel Information */}
              {hotel && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">🏨 Accommodation</h3>
                  <p className="text-gray-700">{hotel.name}</p>
                  {hotel.rating && (
                    <p className="text-sm text-gray-600 mt-1">
                      Rating: {hotel.rating}/5 {hotel.rating && "⭐".repeat(Math.floor(hotel.rating))}
                    </p>
                  )}
                </div>
              )}

              {/* Transportation */}
              {car && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">🚗 Transportation</h3>
                  <p className="text-gray-700">{car.name}</p>
                  {car.type && (
                    <p className="text-sm text-gray-600 mt-1">Type: {car.type}</p>
                  )}
                </div>
              )}

              {/* Pricing Details */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-3">💰 Pricing Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>{format.currency(base_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission ({commission}%):</span>
                    <span>{format.currency((base_price * commission) / 100)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Price:</span>
                    <span className="text-yellow-600">{format.currency(total_price)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Dates */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-3">📅 Travel Dates</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="font-medium">{start_date || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="font-medium">{end_date || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Ratings & Reviews */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-3">⭐ Customer Reviews</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl font-bold text-yellow-600">
                    {average_rating?.toFixed(1) || 0}
                  </div>
                  <div className="flex">
                    {"⭐".repeat(Math.floor(average_rating || 0))}
                    {average_rating % 1 >= 0.5 && "⭐"}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Based on {total_reviews || 0} reviews
                </p>
              </div>

              {/* Commission */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-2">💸 Commission</h3>
                <p className="text-2xl font-bold text-purple-600">{commission}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  Earn {format.currency((base_price * commission) / 100)} per booking
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {highlights && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">✨ Highlights</h3>
              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{highlights}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">📖 Description</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            </div>
          )}

          {/* Policies */}
          {policies && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">📋 Policies</h3>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{policies}</p>
              </div>
            </div>
          )}

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to Book?</h3>
            <p className="text-blue-100 mb-4">Don't miss out on this amazing adventure!</p>
            <button
              onClick={() => onBook && onBook(packageData)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              🎫 Book This Package Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPackageModal;