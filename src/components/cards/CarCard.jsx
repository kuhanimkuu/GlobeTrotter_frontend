import React, { useState } from "react";
import { Car, MapPin, Users, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleRentNow = () => {
    navigate("/cars-booking-wizard", { state: { data: car } });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        {/* Car Image */}
        <div className="h-48 bg-gray-200 relative">
          {car.image_url ? (
            <img
              src={car.image_url}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center">
              <Car className="w-12 h-12 text-white" />
            </div>
          )}
          {!car.available && (
            <span className="absolute top-2 left-2 bg-red-100 text-red-700 px-2 py-1 text-xs rounded">
              Unavailable
            </span>
          )}
        </div>

        {/* Car Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
            <div className="flex items-center text-sm text-gray-500 my-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{car.destination?.name || "N/A"}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" /> {car.category || "N/A"}
              </div>
              <div className="flex items-center">
                <Fuel className="w-4 h-4 mr-1 text-gray-400" /> Automatic
              </div>
            </div>
            <p className="mt-2 font-bold text-green-600 text-lg">
              ${car.daily_rate} <span className="text-sm text-gray-600">/day</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleRentNow}
              disabled={!car.available}
              className={`flex-1 py-2 rounded text-white transition-colors ${
                car.available ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Rent Now
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-full overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{car.make} {car.model}</h2>
            <img
              src={car.image_url || ""}
              alt={`${car.make} ${car.model}`}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="space-y-2 text-gray-700">
              <p><strong>Category:</strong> {car.category || "N/A"}</p>
              <p><strong>Destination:</strong> {car.destination?.name || "N/A"}</p>
              <p><strong>Daily Rate:</strong> ${car.daily_rate} {car.currency}</p>
              {car.driver_name && <p><strong>Driver:</strong> {car.driver_name}</p>}
              {car.driver_contact && <p><strong>Contact:</strong> {car.driver_contact}</p>}
              {car.description && <p><strong>Description:</strong> {car.description}</p>}
              <p><strong>Available:</strong> {car.available ? "Yes" : "No"}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleRentNow}
                disabled={!car.available}
                className={`flex-1 py-2 rounded text-white transition-colors ${
                  car.available ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Rent Now
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarCard;
