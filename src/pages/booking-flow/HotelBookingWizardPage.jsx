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
    booking:response, 
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {["Stay Details", "Review & Confirm"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step - 1 >= i
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {i + 1}
              </div>
              <span className="hidden md:inline text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Stay Details */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Stay Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Check-in Date</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={formData.check_in}
                  onChange={(e) =>
                    setFormData({ ...formData, check_in: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Check-out Date</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={formData.check_out}
                  onChange={(e) =>
                    setFormData({ ...formData, check_out: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Room Type</label>
                <select
                  className="border p-2 rounded w-full"
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

              <div>
                <h4 className="font-medium">Guests</h4>
                {formData.guests.map((g, idx) => (
                  <div key={idx} className="p-3 border rounded mt-2">
                    <div className="flex gap-2 mb-2">
                      <input
                        placeholder="First Name"
                        value={g.first_name}
                        onChange={(e) =>
                          updateGuest(idx, { first_name: e.target.value })
                        }
                        className="border px-2 py-1 rounded flex-1"
                      />
                      <input
                        placeholder="Last Name"
                        value={g.last_name}
                        onChange={(e) =>
                          updateGuest(idx, { last_name: e.target.value })
                        }
                        className="border px-2 py-1 rounded flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        placeholder="Email"
                        value={g.email}
                        onChange={(e) =>
                          updateGuest(idx, { email: e.target.value })
                        }
                        className="border px-2 py-1 rounded flex-1"
                      />
                      <input
                        placeholder="Phone"
                        value={g.phone}
                        onChange={(e) =>
                          updateGuest(idx, { phone: e.target.value })
                        }
                        className="border px-2 py-1 rounded flex-1"
                      />
                    </div>
                    {formData.guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(idx)}
                        className="text-sm text-red-600 mt-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGuest}
                  className="text-blue-600 text-sm mt-2"
                >
                  + Add guest
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium">Special Requests</label>
                <textarea
                  className="border rounded w-full p-2"
                  value={formData.special_requests}
                  onChange={(e) =>
                    setFormData({ ...formData, special_requests: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Hotel Booking</h2>
            <div className="p-4 border rounded space-y-2">
              <p>
                <strong>Hotel:</strong> {hotel?.name}
              </p>
              <p>
                <strong>Period:</strong> {formData.check_in} → {formData.check_out}
              </p>
              <p>
                <strong>Room:</strong>{" "}
                {hotel?.room_types?.find((r) => r.id == formData.room_type)?.name}
              </p>
              <p>
                <strong>Total Price:</strong> {hotel?.currency} {getRoomTotal().toFixed(2)}
              </p>
              <div>
                <h4 className="font-medium">Guests</h4>
                <ul className="list-disc list-inside text-sm">
                  {formData.guests.map((g, i) => (
                    <li key={i}>
                      {g.first_name} {g.last_name} ({g.email})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
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
