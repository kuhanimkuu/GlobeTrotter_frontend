import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { api } from "../../services/api";

export default function HotelBookingWizardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const hotel = state?.data;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    room_type: "",
    guests: [
      {
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      },
    ],
    special_requests: "",
  });

  const getRoomTotal = () => {
    if (!hotel || !formData.room_type) return 0;

    const room = hotel.room_types?.find((r) => r.id == formData.room_type);
    if (!room) return 0;

    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);
    const nights = Math.max((checkOut - checkIn) / (1000 * 60 * 60 * 24), 1);

    const price = room.base_price || room.price || 0;

    return Number(price) * nights;
  };

  const updateGuest = (index, patch) => {
    setFormData((prev) => {
      const guests = [...prev.guests];
      guests[index] = { ...guests[index], ...patch };
      return { ...prev, guests };
    });
  };

  const addGuest = () => {
    setFormData((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        { first_name: "", last_name: "", email: "", phone: "" },
      ],
    }));
  };

  const removeGuest = (index) => {
    setFormData((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!hotel) throw new Error("Hotel data is missing");

      const payload = {
        room_type_id: Number(formData.room_type),
        check_in_date: formData.check_in,
        check_out_date: formData.check_out,
        rooms: 1,
        currency: hotel.currency || "USD",
        note: formData.special_requests || ""
      };

      const response = await api.booking.hotel(payload);
      console.log("Booking API response", response);

      if (!response || !response.id) throw new Error("Invalid booking response");

      navigate("/payment", {
        state: {
          booking: response, 
        }
      });
    } catch (err) {
      console.error("Hotel booking failed", err);
      setError(
        err?.response?.data?.detail || err.message || "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!formData.check_in || !formData.check_out || !formData.room_type) {
        setError("Please select check-in, check-out and room type.");
        return;
      }
    }
    if (step === 2) {
      await handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 mb-12">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Book Your
            <span className="block text-yellow-400">Hotel Stay</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Complete your booking in a few simple steps
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {["Stay Details", "Review & Confirm"].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    step - 1 >= i
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="hidden md:inline font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Stay Details */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Stay Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      value={formData.check_in}
                      onChange={(e) =>
                        setFormData({ ...formData, check_in: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      value={formData.check_out}
                      onChange={(e) =>
                        setFormData({ ...formData, check_out: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    value={formData.room_type}
                    onChange={(e) =>
                      setFormData({ ...formData, room_type: e.target.value })
                    }
                  >
                    <option value="">Select a room</option>
                    {hotel?.room_types?.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} — {room.base_price} {room.currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">Guests</h4>
                  {formData.guests.map((g, idx) => (
                    <div key={idx} className="p-4 border-2 border-gray-100 rounded-lg mb-4 last:mb-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          placeholder="First Name"
                          value={g.first_name}
                          onChange={(e) =>
                            updateGuest(idx, { first_name: e.target.value })
                          }
                          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                        <input
                          placeholder="Last Name"
                          value={g.last_name}
                          onChange={(e) =>
                            updateGuest(idx, { last_name: e.target.value })
                          }
                          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          placeholder="Email"
                          value={g.email}
                          onChange={(e) =>
                            updateGuest(idx, { email: e.target.value })
                          }
                          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                        <input
                          placeholder="Phone"
                          value={g.phone}
                          onChange={(e) =>
                            updateGuest(idx, { phone: e.target.value })
                          }
                          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                      </div>
                      {formData.guests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGuest(idx)}
                          className="text-red-600 hover:text-red-700 font-medium mt-3 transition-colors duration-200"
                        >
                          Remove Guest
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGuest}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    + Add Another Guest
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    rows="4"
                    value={formData.special_requests}
                    onChange={(e) =>
                      setFormData({ ...formData, special_requests: e.target.value })
                    }
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Hotel Information</h3>
                    <p className="text-gray-700">{hotel?.name}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Stay Period</h3>
                    <p className="text-gray-700">{formData.check_in} to {formData.check_out}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Room Type</h3>
                    <p className="text-gray-700">
                      {hotel?.room_types?.find((r) => r.id == formData.room_type)?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Total Price</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {hotel?.currency} {getRoomTotal().toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Guests</h3>
                  <div className="space-y-3">
                    {formData.guests.map((g, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{g.first_name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {g.first_name} {g.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{g.email}</p>
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
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-100">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : step === 2 ? (
                "Complete Booking"
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}