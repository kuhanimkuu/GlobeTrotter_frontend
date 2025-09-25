import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Star } from "lucide-react";

const PackageDetailModal = ({ tourPackage, onClose }) => {
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
  } = tourPackage;

  const startDate = start_date ? new Date(start_date) : null;
  const endDate = end_date ? new Date(end_date) : null;
  const isExpired = endDate && new Date() > endDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl h-[90vh] overflow-y-auto relative p-6">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Image */}
        {main_image_url && (
          <img
            src={main_image_url}
            alt={title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <span
            className={`px-3 py-1 rounded text-sm font-semibold mt-2 md:mt-0 ${
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

        {/* Summary */}
        <p className="text-gray-700 mb-6">{summary || "No summary available."}</p>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <strong>Destination:</strong>{" "}
              {destination?.name || "N/A"} {destination?.country && `, ${destination.country}`}
            </p>
            {startDate && (
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <strong>Start Date:</strong> {startDate.toLocaleDateString()}
              </p>
            )}
            {endDate && (
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <strong>End Date:</strong> {endDate.toLocaleDateString()}
              </p>
            )}
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <strong>Duration:</strong> {duration_days} days / {nights} nights
            </p>
            <p className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <strong>Capacity:</strong> {max_capacity || "N/A"} people
            </p>
            <p className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <strong>Price:</strong> {total_price || base_price} {currency}
            </p>
          </div>

          {/* Optional Highlights / Policies */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Highlights:</strong> {tourPackage.highlights || "N/A"}</p>
            <p><strong>Policies:</strong> {tourPackage.policies || "N/A"}</p>
            <p><strong>Inclusions:</strong> {tourPackage.inclusions || "N/A"}</p>
            <p><strong>Exclusions:</strong> {tourPackage.exclusions || "N/A"}</p>
          </div>
        </div>

        {/* Hotel Info */}
        {hotel && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">🏨 Hotel Info</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {hotel.cover_image_url && (
                <img
                  src={hotel.cover_image_url}
                  alt={hotel.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <p><strong>Name:</strong> {hotel.name}</p>
              <p><strong>Address:</strong> {hotel.address}</p>
              <p><strong>City:</strong> {hotel.city}</p>
              <p><strong>Rating:</strong> ⭐ {hotel.rating || "N/A"}</p>

              {hotel.room_types?.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium mb-1">Room Types:</h4>
                  <ul className="space-y-2">
                    {hotel.room_types.map(room => (
                      <li key={room.id} className="flex items-center gap-3 bg-white p-2 rounded shadow-sm">
                        {room.image_url && (
                          <img
                            src={room.image_url}
                            alt={room.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{room.name}</p>
                          <p className="text-sm text-gray-600">Capacity: {room.capacity} pax</p>
                          <p className="text-sm text-gray-600">{room.base_price} {room.currency} (x{room.quantity})</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Car Info */}
        {car && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">🚐 Car & Driver</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {car.image_url && (
                <img
                  src={car.image_url}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <p><strong>Provider:</strong> {car.provider || "N/A"}</p>
              <p><strong>Make & Model:</strong> {car.make} {car.model}</p>
              <p><strong>Category:</strong> {car.category}</p>
              <p><strong>Daily Rate:</strong> {car.daily_rate} {car.currency}</p>
              <p><strong>City:</strong> {car.city || "N/A"}</p>
              <p><strong>Description:</strong> {car.description || "N/A"}</p>

              {/* Driver */}
              <div className="mt-2">
                <h4 className="font-medium mb-1">👨‍✈️ Driver Info</h4>
                <p><strong>Name:</strong> {car.driver_name || "N/A"}</p>
                <p><strong>Contact:</strong> {car.driver_contact || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Book Button */}
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            onClick={() =>
              navigate("/booking-wizard", { state: { type: "package", data: tourPackage } })
            }
            disabled={isExpired || !is_active}
          >
            {isExpired ? "Expired" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailModal;
