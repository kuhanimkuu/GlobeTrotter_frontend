import React, { useState } from "react";
import { Car, MapPin, Users, Fuel, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleRentNow = () => {
    navigate("/cars-booking-wizard", { state: { data: car } });
  };

  // Car type icons matching your CarsPage
  const carTypeIcons = {
    suv: "🚙",
    sedan: "🚗", 
    truck: "🚚",
    van: "🚐",
    luxury: "🏎️",
    sports: "🚓",
    compact: "🚘",
    convertible: "🚜"
  };

  return (
    <>
      {/* Car Card - Matching CarsPage Theme */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border-2 border-transparent hover:border-yellow-400 group">
        
        {/* Car Image */}
        <div className="h-48 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
          {car.image_url ? (
            <img
              src={car.image_url}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Car className="w-12 h-12 text-blue-600" />
            </div>
          )}
          
          {/* Availability Badge */}
          {!car.available && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">
              Unavailable
            </span>
          )}
          
          {/* Car Type Icon */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md">
            {carTypeIcons[car.type] || "🚗"}
          </div>
        </div>

        {/* Car Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg text-gray-900">
              {car.make} {car.model}
            </h3>
            <div className="text-right">
              <p className="font-bold text-2xl text-green-600">
                ${car.daily_rate}
              </p>
              <p className="text-sm text-gray-500">/day</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">{car.destination?.name || "N/A"}</span>
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-gray-600 mb-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-sm">{car.seats || car.category || "5 seats"}</span>
            </div>
            <div className="flex items-center">
              <Fuel className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-sm">{car.fuel_type || "Petrol"}</span>
            </div>
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded-lg">
              <span className="text-sm font-medium">{car.transmission || "Automatic"}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleRentNow}
              disabled={!car.available}
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${
                car.available 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {car.available ? "Rent Now" : "Unavailable"}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal - Matching Theme */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-gray-50 to-blue-50">
                {car.image_url ? (
                  <img
                    src={car.image_url}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-16 h-16 text-blue-600" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {car.make} {car.model}
              </h2>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span>{car.destination?.name || "N/A"}</span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">${car.daily_rate}</p>
                  <p className="text-gray-600">per day</p>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="font-bold text-sm">{car.seats || "5"} Seats</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <Fuel className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="font-bold text-sm">{car.fuel_type || "Petrol"}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <span className="text-lg">⚙️</span>
                  <p className="font-bold text-sm">{car.transmission || "Automatic"}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <Star className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="font-bold text-sm">{car.rating || "4.5"} Rating</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3 text-gray-700">
                {car.driver_name && (
                  <p><strong>Driver:</strong> {car.driver_name}</p>
                )}
                {car.driver_contact && (
                  <p><strong>Contact:</strong> {car.driver_contact}</p>
                )}
                {car.description && (
                  <p><strong>Description:</strong> {car.description}</p>
                )}
                <p><strong>Available:</strong> {car.available ? "Yes" : "No"}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRentNow}
                  disabled={!car.available}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${
                    car.available 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {car.available ? "Rent Now" : "Not Available"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarCard;