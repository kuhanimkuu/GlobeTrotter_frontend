// src/pages/booking-flow/FlightBookingWizardPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { api } from "../../services/api";

export default function FlightBookingWizardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const flight = state?.data; // passed from "Book Now"
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    passengers: [
      {
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      },
    ],
    special_requests: "",
  });

  const updatePassenger = (index, patch) => {
    setFormData((prev) => {
      const passengers = [...prev.passengers];
      passengers[index] = { ...passengers[index], ...patch };
      return { ...prev, passengers };
    });
  };

  const addPassenger = () => {
    setFormData((prev) => ({
      ...prev,
      passengers: [...prev.passengers, { first_name: "", last_name: "", email: "", phone: "" }],
    }));
  };

  const removePassenger = (index) => {
    setFormData((prev) => ({
      ...prev,
      passengers: prev.passengers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        provider: flight?.provider || "fake", 
        offer_id: flight?.offer_id || flight?.id,             
        passengers: formData.passengers,
        currency: flight?.currency || "USD",
        note: formData.special_requests,
      };

      const response = await api.booking.flight(payload); 
      navigate("/payment", {
        state: {
          booking: response,
          amount: response?.total_amount ?? normalizedPrice.amount,
          currency: response?.currency ?? normalizedPrice.currency,
        },
      });
    } catch (err) {
      console.error("Flight booking failed", err);
      setError(err?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError("");
    if (step === 2) {
      await handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const normalizedPrice = {
    amount: parseFloat(flight?.price) || 0,
    currency: flight?.currency || "USD",
  };

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 mb-12">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Book Your
            <span className="block text-yellow-400">Flight</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Complete your flight booking in just a few simple steps
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {["Passenger Details", "Review & Confirm"].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    step - 1 >= i
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-lg font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Passenger Details */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Passenger Details</h2>
              
              <div className="space-y-6">
                {formData.passengers.map((p, idx) => (
                  <div key={idx} className="p-6 border-2 border-gray-100 rounded-xl bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Passenger {idx + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        placeholder="First Name"
                        value={p.first_name}
                        onChange={(e) => updatePassenger(idx, { first_name: e.target.value })}
                        className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      />
                      <input
                        placeholder="Last Name"
                        value={p.last_name}
                        onChange={(e) => updatePassenger(idx, { last_name: e.target.value })}
                        className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Email"
                        value={p.email}
                        onChange={(e) => updatePassenger(idx, { email: e.target.value })}
                        className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      />
                      <input
                        placeholder="Phone"
                        value={p.phone}
                        onChange={(e) => updatePassenger(idx, { phone: e.target.value })}
                        className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      />
                    </div>
                    {formData.passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(idx)}
                        className="text-red-600 font-medium mt-4 hover:text-red-700 transition-colors duration-200"
                      >
                        Remove Passenger
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addPassenger}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-lg">+</span> Add Passenger
                </button>

                <div className="mt-6">
                  <label className="block text-lg font-medium mb-3 text-gray-900">
                    Special Requests
                  </label>
                  <textarea
                    className="border-2 border-gray-200 rounded-xl w-full p-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    rows="4"
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                    placeholder="Any special requirements or requests..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Review Flight Booking</h2>
              <div className="p-6 border-2 border-gray-100 rounded-xl bg-gray-50 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <strong className="text-gray-700 block mb-2">Flight Route:</strong>
                    <p className="text-xl font-semibold text-gray-900">
                      {flight?.origin} → {flight?.destination}
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-2">Departure:</strong>
                    <p className="text-xl font-semibold text-gray-900">{flight?.departure_date}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-2">Airline:</strong>
                    <p className="text-xl font-semibold text-gray-900">{flight?.airline || "Multiple Airlines"}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-2">Total Price:</strong>
                    <p className="text-2xl font-bold text-yellow-600">
                      {normalizedPrice.currency} {normalizedPrice.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Passengers</h4>
                  <div className="space-y-3">
                    {formData.passengers.map((p, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.first_name} {p.last_name}</p>
                          <p className="text-sm text-gray-600">{p.email} • {p.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl mt-6">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-100">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-8 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : step === 2
                ? "Complete Booking"
                : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}