import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { api } from "../../services/api";

export default function CarBookingWizardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const car = state?.data || null;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    passengers: [
      {
        first_name: user?.first_name || user?.username || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      },
    ],
    special_requests: "",
  });

  useEffect(() => {
    if (!car) {
      navigate("/cars");
    }
  }, [car, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        passengers: [
          {
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
          },
        ],
      }));
    }
  }, [user]);

  const getCarTotal = () => {
    if (!car || !formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 1);
    return days * (car?.daily_rate || car?.price || 0);
  };

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
      passengers: [
        ...prev.passengers,
        { first_name: "", last_name: "", email: "", phone: "" },
      ],
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
        currency: car?.currency || "USD",
        note: formData.special_requests || "",
        items: [
          {
            type: "car",
            id: car?.id,
            start_date: formData.start_date,
            end_date: formData.end_date,
            quantity: 1,
            unit_price: car?.daily_rate || car?.price || 0,
          },
        ],
      };

      console.log("🚗 Sending car booking payload:", payload);

      const response = await api.booking.create(payload);
      navigate("/payment", {
        state: {
          booking: response,
        },
      });
    } catch (err) {
      console.error("Booking failed full error:", err);
      setError(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!formData.start_date || !formData.end_date) {
        setError("Please select rental dates.");
        return;
      }
      if (!formData.passengers[0].first_name || !formData.passengers[0].email) {
        setError("Please fill passenger details.");
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
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 mb-12">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Book Your
            <span className="block text-yellow-400">Car Rental</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Complete your booking in just a few simple steps
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {["Rental Details", "Review & Confirm"].map((label, i) => (
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

          {/* Step 1: Rental Details */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Rental Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium mb-3 text-gray-900">Pick-up Date</label>
                    <input
                      type="date"
                      className="border-2 border-gray-200 p-4 rounded-xl w-full focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-3 text-gray-900">Drop-off Date</label>
                    <input
                      type="date"
                      className="border-2 border-gray-200 p-4 rounded-xl w-full focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="border-2 border-gray-100 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Passengers</h4>
                  {formData.passengers.map((p, idx) => (
                    <div key={idx} className="p-4 border-2 border-gray-100 rounded-xl mt-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          placeholder="First Name"
                          value={p.first_name}
                          onChange={(e) =>
                            updatePassenger(idx, { first_name: e.target.value })
                          }
                          className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                        <input
                          placeholder="Last Name"
                          value={p.last_name}
                          onChange={(e) =>
                            updatePassenger(idx, { last_name: e.target.value })
                          }
                          className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          placeholder="Email"
                          value={p.email}
                          onChange={(e) =>
                            updatePassenger(idx, { email: e.target.value })
                          }
                          className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                        <input
                          placeholder="Phone"
                          value={p.phone}
                          onChange={(e) =>
                            updatePassenger(idx, { phone: e.target.value })
                          }
                          className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        />
                      </div>
                      {formData.passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(idx)}
                          className="text-red-600 font-medium mt-3 hover:text-red-700 transition-colors duration-200"
                        >
                          Remove Passenger
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPassenger}
                    className="text-blue-600 font-medium mt-4 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">+</span> Add Passenger
                  </button>
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-gray-900">
                    Special Requests
                  </label>
                  <textarea
                    className="border-2 border-gray-200 rounded-xl w-full p-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    rows="4"
                    value={formData.special_requests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        special_requests: e.target.value,
                      })
                    }
                    placeholder="Any special requirements or requests..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Review Car Booking</h2>
              <div className="p-6 border-2 border-gray-100 rounded-xl bg-gray-50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-gray-700">Car:</strong>
                    <p className="text-lg font-semibold text-gray-900">{car?.make} {car?.model}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Period:</strong>
                    <p className="text-lg font-semibold text-gray-900">{formData.start_date} → {formData.end_date}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Daily Rate:</strong>
                    <p className="text-lg font-semibold text-gray-900">{car?.currency} {car?.daily_rate}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Total Price:</strong>
                    <p className="text-2xl font-bold text-yellow-600">{car?.currency} {getCarTotal().toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Passengers</h4>
                  <div className="space-y-2">
                    {formData.passengers.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
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

          {/* Errors */}
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