import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { api } from "../../services/api";

export default function CarBookingWizardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const car = state?.data; 
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
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
        type: "car",
        object_id: car?.id,
        passengers: formData.passengers,
        start_date: formData.start_date,
        end_date: formData.end_date,
        special_requests: formData.special_requests,
      };

      const response = await api.booking.create(payload);
      navigate("/payment", {
        state: {
          booking: response,
          amount: response?.total || car?.total_price || car?.price || 0,
          currency: response?.currency || car?.currency || "USD",
        },
      });
    } catch (err) {
      console.error("Booking failed", err);
      setError(err?.message || "Failed to create booking");
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
      // final submit
      await handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {["Rental Details", "Review & Confirm"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step - 1 >= i ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {i + 1}
              </div>
              <span className="hidden md:inline text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Rental Details */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Rental Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Pick-up Date</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Drop-off Date</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div>
                <h4 className="font-medium">Passengers</h4>
                {formData.passengers.map((p, idx) => (
                  <div key={idx} className="p-3 border rounded mt-2">
                    <div className="flex gap-2 mb-2">
                      <input
                        placeholder="First Name"
                        value={p.first_name}
                        onChange={(e) => updatePassenger(idx, { first_name: e.target.value })}
                        className="border px-2 py-1 rounded flex-1"
                      />
                      <input
                        placeholder="Last Name"
                        value={p.last_name}
                        onChange={(e) => updatePassenger(idx, { last_name: e.target.value })}
                        className="border px-2 py-1 rounded flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        placeholder="Email"
                        value={p.email}
                        onChange={(e) => updatePassenger(idx, { email: e.target.value })}
                        className="border px-2 py-1 rounded flex-1"
                      />
                      <input
                        placeholder="Phone"
                        value={p.phone}
                        onChange={(e) => updatePassenger(idx, { phone: e.target.value })}
                        className="border px-2 py-1 rounded flex-1"
                      />
                    </div>
                    {formData.passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(idx)}
                        className="text-sm text-red-600 mt-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPassenger}
                  className="text-blue-600 text-sm mt-2"
                >
                  + Add passenger
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium">Special Requests</label>
                <textarea
                  className="border rounded w-full p-2"
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Car Booking</h2>
            <div className="p-4 border rounded space-y-2">
              <p>
                <strong>Car:</strong> {car?.make} {car?.model}
              </p>
              <p>
                <strong>Period:</strong> {formData.start_date} → {formData.end_date}
              </p>
              <p>
                <strong>Total Price:</strong> {car?.currency}{" "}
                {car?.total_price || car?.price}
              </p>
              <div>
                <h4 className="font-medium">Passengers</h4>
                <ul className="list-disc list-inside text-sm">
                  {formData.passengers.map((p, i) => (
                    <li key={i}>
                      {p.first_name} {p.last_name} ({p.email})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Errors */}
        {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {loading
              ? "Processing..."
              : step === 2
              ? "Complete Booking"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
