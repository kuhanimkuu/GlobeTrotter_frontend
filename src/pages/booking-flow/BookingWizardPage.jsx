import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { api } from '../../services/api';


export default function BookingWizardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookingType = state?.type; 
  const passedData = state?.data || state?.booking || null;
  const passedId = passedData?.id || state?.id || state?.itemId || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itemData, setItemData] = useState(passedData || null);
  const [flightOptions, setFlightOptions] = useState([]);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [formData, setFormData] = useState(() => ({
    customer_country:passedData?.customer_country || '',
    passengers: [
      {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
      },
    ],
    weBookFlights: false,
    special_requests: '',
  }));

  const steps = formData.weBookFlights
    ? ['Passenger Details', 'Select Flight', 'Review & Confirm', 'Payment']
    : ['Passenger Details', 'Review & Confirm', 'Payment'];
  useEffect(() => {
    if (itemData) return; 
    if (!passedId || !bookingType) return;

    const fetchItem = async () => {
      try {
        let res = null;
        if (bookingType === 'tour' || bookingType === 'package') {
          if (api.packages && api.packages.retrieve) res = await api.packages.retrieve(passedId);
        } else if (bookingType === 'hotel') {
          if (api.inventory?.hotels?.retrieve) res = await api.inventory.hotels.retrieve(passedId);
          else if (api.hotels?.retrieve) res = await api.hotels.retrieve(passedId);
        } else if (bookingType === 'car') {
          if (api.inventory?.cars?.retrieve) res = await api.inventory.cars.retrieve(passedId);
          else if (api.cars?.retrieve) res = await api.cars.retrieve(passedId);
        } else if (bookingType === 'flight') {
          if (api.flights?.retrieve) res = await api.flights.retrieve(passedId);
        }

        if (!res) {
          setError('Could not fetch item details (no endpoint available).');
        } else {
          setItemData(res);
        }
      } catch (err) {
        console.error('Failed to fetch booking item', err);
        setError('Failed to load booking information.');
      }
    };

    fetchItem();
  }, [passedId, bookingType]);

  useEffect(() => {
    if (passedData) {
      setItemData(passedData);
      setFormData((prev) => ({
        ...prev,
        customer_country: passedData.customer_country || prev.customer_country,
      }));
    }
  }, [passedData]);

  useEffect(() => {
    setFormData((prev) => {
      const passengers = (prev.passengers && prev.passengers.length > 0) ? prev.passengers : [{
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
      }];

      const newPassengers = passengers.map((p, i) => {
        if (i === 0) {
          return {
            ...p,
            first_name: user?.first_name || p.first_name,
            last_name: user?.last_name || p.last_name,
            email: user?.email || p.email,
            phone: user?.phone || p.phone,
          };
        }
        return p;
      });

      return {
        ...prev,
        customer_country: user?.country || prev.customer_country,
        passengers: newPassengers,
      };
    });
  }, [user]);

  if (!bookingType || (!itemData && !passedId && !passedData)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Booking Data</h2>
          <p className="text-gray-600">Please select a service to book</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-2">You need to be signed in</h3>
          <p className="text-gray-600 mb-4">Please sign in to continue with booking. We pre-fill your information for a faster checkout.</p>
          <div className="flex gap-2 justify-end">
            <button
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => navigate('/login', { state: { from: '/booking-wizard', bookingState: state } })}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }
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
        { first_name: '', last_name: '', email: '', phone: '', date_of_birth: '', gender: 'male' },
      ],
    }));
  };

  const removePassenger = (index) => {
    setFormData((prev) => ({
      ...prev,
      passengers: prev.passengers.filter((_, i) => i !== index),
    }));
  };
const ALL_AIRPORTS = [
  "NBO", "LOS", "CPT", "DXB", "DOH", "JNB", "ADD",
  "LAX", "SFO", "ORD", "ATL", "SEA",
  "CDG", "LHR", "FRA", "MAD", "BCN", "IST",
  "HND", "NRT", "ICN", "SYD", "MEL", "AKL"
];
const countryAirports = {
  Kenya: ["NBO"],
  Nigeria: ["LOS"],
  SouthAfrica: ["CPT", "JNB"],
  UAE: ["DXB"],
  Qatar: ["DOH"],
  Ethiopia: ["ADD"],
  USA: ["LAX", "SFO", "ORD", "ATL", "SEA"],
  France: ["CDG"],
  UK: ["LHR"],
  Germany: ["FRA"],
  Spain: ["MAD", "BCN"],
  Turkey: ["IST"],
  Japan: ["HND", "NRT"],
  SouthKorea: ["ICN"],
  Australia: ["SYD", "MEL"],
  NewZealand: ["AKL"],
};
const searchFlights = async () => {
  setFlightsLoading(true);
  setFlightOptions([]);
  setError('');

  try {
    const flights = await api.flights.search({});
    console.log('>>> Flights response:', flights);

    const options = Array.isArray(flights) ? flights : flights.results || [];
    let packageStart = itemData?.start_date ? new Date(itemData.start_date) : null;
    const filteredFlights = options.filter((f) => {
      const departRaw = f.departure_time || f.departure || (f.legs && f.legs[0]?.departure);
      if (!departRaw || !packageStart) return true; 

      const flightDepart = new Date(departRaw);
      return flightDepart <= packageStart;
    });

    setFlightOptions(filteredFlights);

    if (filteredFlights.length === 0) {
      setError('No flight options available before the tour start date.');
    }
  } catch (err) {
    console.error('Flight search error:', err);
    setError(err.message || 'Failed to search flights.');
  } finally {
    setFlightsLoading(false);
  }
};

  const handleNext = async () => {
    setError('');
    if (currentStep === 1) {
      const ok = formData.passengers.every((p) => p.first_name && p.last_name && p.email);
      if (!ok) {
        setError('Please fill first name, last name and email for each passenger.');
        return;
      }
      if (!formData.customer_country) {
        setError('Please provide your country (used for flight search).');
        return;
      }
      if (formData.weBookFlights) {
        setCurrentStep(2);
        setTimeout(() => {
          searchFlights();
        }, 0);
        return;
      }

      setCurrentStep(2);
      return;
    }
    if (formData.weBookFlights && steps[currentStep - 1] === 'Select Flight') {
      if (!selectedFlight) {
        setError('Please select a flight to continue.');
        return;
      }
      setCurrentStep((s) => s + 1);
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrev = () => {
    setError('');
    if (currentStep === 1) return;
    setCurrentStep((s) => s - 1);
  };

  const getItemTotal = (item) => {
    if (!item) return 0;
    if (item.total_price !== undefined && item.total_price !== null) return Number(item.total_price);
    if (item.total !== undefined && item.total !== null) return Number(item.total);
    if (item.base_price !== undefined && item.base_price !== null) return Number(item.base_price);
    if (item.price !== undefined && item.price !== null) return Number(item.price);
    if (item.daily_rate !== undefined && item.daily_rate !== null) {
      const days = item.days || item.nights || item.car_days || 1;
      return Number(item.daily_rate) * Number(days);
    }
    return 0;
  };

const handleSubmit = async () => {
  setLoading(true);
  setError('');

  try {
    const isPackageBooking = bookingType === 'tour' || bookingType === 'package';
    const numberOfPassengers = formData.passengers?.length || 1;

    const payload = {
      currency: itemData?.currency || 'USD',
      items: [],
      note: formData.special_requests || '',
    };

    if (isPackageBooking) {
      payload.items.push({
        type: 'package',
        id: itemData.id,
      });
    } else {
      payload.items.push({
        type: bookingType,
        id: itemData.id,
        start_date: itemData.start_date,
        end_date: itemData.end_date,
        quantity: 1,
        unit_price: itemData.price || 0,
      });
    }

    const packagePricePerPerson = Number(itemData.price || itemData.total_price || 0);
    const extrasTotal = itemData?.extras?.reduce((acc, e) => acc + Number(e.price || 0), 0) || 0;
    const flightTotal = selectedFlight ? Number(selectedFlight.price || 0) * numberOfPassengers : 0;

    const totalAmount = packagePricePerPerson * numberOfPassengers + extrasTotal + flightTotal;

    const response = await api.booking.create(payload);

    navigate('/payment', {
      state: {
        booking: response,
        amount: totalAmount,
        currency: itemData?.currency || 'USD',
        itemData,
        selectedFlight: selectedFlight || null,
        passengers: formData.passengers || [],
      },
    });
  } catch (err) {
    console.error('Booking error', err);
    if (err?.response?.data) setError(JSON.stringify(err.response.data));
    else if (err?.message) setError(err.message);
    else setError('Failed to create booking');
  } finally {
    setLoading(false);
  }
};

  const renderPassengerStep = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Country (for flight search)</label>
          <input
            value={formData.customer_country}
            onChange={(e) => setFormData((p) => ({ ...p, customer_country: e.target.value }))}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="Country (e.g. Kenya)"
          />
        </div>

        <div className="space-y-3">
          {formData.passengers.map((p, idx) => (
            <div key={idx} className="p-3 border rounded">
              <div className="flex gap-2">
                <input
                  placeholder="First name"
                  value={p.first_name}
                  onChange={(e) => updatePassenger(idx, { first_name: e.target.value })}
                  className="border px-2 py-1 rounded flex-1"
                />
                <input
                  placeholder="Last name"
                  value={p.last_name}
                  onChange={(e) => updatePassenger(idx, { last_name: e.target.value })}
                  className="border px-2 py-1 rounded flex-1"
                />
              </div>
              <div className="flex gap-2 mt-2">
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
              <div className="flex gap-2 mt-2 items-center">
                <label className="text-sm">DOB</label>
                <input
                  type="date"
                  value={p.date_of_birth}
                  onChange={(e) => updatePassenger(idx, { date_of_birth: e.target.value })}
                  className="border px-2 py-1 rounded"
                />
                <label className="ml-4 text-sm">Gender</label>
                <select
                  value={p.gender}
                  onChange={(e) => updatePassenger(idx, { gender: e.target.value })}
                  className="border px-2 py-1 rounded ml-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end mt-2">
                {formData.passengers.length > 1 && (
                  <button
                    className="text-sm text-red-600"
                    onClick={() => removePassenger(idx)}
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <div>
            <button type="button" onClick={addPassenger} className="text-sm text-blue-600">+ Add another passenger</button>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.weBookFlights}
              onChange={(e) => setFormData((p) => ({ ...p, weBookFlights: e.target.checked }))}
            />
            <span className="text-sm">Yes — please search & book flights for us (optional)</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderFlightsStep = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Flights</h2>

      <div className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <button
            className="bg-gray-100 px-3 py-2 rounded mr-2"
            onClick={searchFlights}
            disabled={flightsLoading}
          >
            {flightsLoading ? 'Searching...' : 'Search flights again'}
          </button>
        </div>

        {flightsLoading && <p className="text-sm text-gray-600">Searching flights…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-3">
          {flightOptions.length === 0 && !flightsLoading && <p className="text-sm text-gray-600">No flight options found.</p>}

          {flightOptions.map((f) => {
  const id = f.id || f.offer_id;
  const depart = f.departure_time ? new Date(f.departure_time) : null;
  const arrive = f.arrival_time ? new Date(f.arrival_time) : null;
  const price = f.price || 'N/A';
  const seats = f.seats_available || 0;

  return (
    <div
      key={id}
      className={`p-3 border rounded flex justify-between items-center ${
        selectedFlight === f ? 'ring-2 ring-blue-200' : ''
      }`}
    >
      <div>
        <div className="font-medium">{f.airline || 'Unknown Airline'}</div>
        <div className="text-sm text-gray-700">
          {f.origin} → {f.destination}
        </div>
        <div className="text-sm text-gray-600">
          Departure: {depart ? depart.toLocaleString() : 'N/A'}
        </div>
        <div className="text-sm text-gray-600">
          Arrival: {arrive ? arrive.toLocaleString() : 'N/A'}
        </div>
        <div className="text-sm text-gray-600">
          Seats available: {seats}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-lg font-bold">{f.currency} {price}</div>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => setSelectedFlight(f)}
        >
          Select
        </button>
      </div>
    </div>
  );
})}

        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
  const pkg = itemData || {};
  const numberOfPassengers = formData.passengers?.length || 1;

  const packagePricePerPerson = Number(pkg.price || pkg.total_price || 0);
  const extrasTotal = pkg?.extras?.reduce((acc, e) => acc + Number(e.price || 0), 0) || 0;
  const flightTotal = selectedFlight ? Number(selectedFlight.price || 0) * numberOfPassengers : 0;

  const pkgTotal = packagePricePerPerson * numberOfPassengers + extrasTotal;
  const grandTotal = pkgTotal + flightTotal;
  const currency = pkg.currency || 'USD';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review & Confirm</h2>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <h4 className="font-medium">{bookingType === 'tour' ? 'Package' : bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}</h4>
          <p>{pkg.title || pkg.name}</p>
          <p className="text-sm text-gray-600">{pkg.summary}</p>
          {pkg.hotel && <p className="text-sm">Hotel: {pkg.hotel?.name || 'N/A'}</p>}
          {pkg.car && <p className="text-sm">Car: {pkg.car?.make || ''} {pkg.car?.model || ''}</p>}
          <p className="text-sm">Package total for {numberOfPassengers} passenger(s): {currency} {pkgTotal.toFixed(2)}</p>
        </div>

        {selectedFlight && (
          <div>
            <h4 className="font-medium">Selected Flight</h4>
            <p className="text-sm">{selectedFlight.title || selectedFlight.airline || 'Flight'}</p>
            <p className="text-sm">Flight total for {numberOfPassengers} passenger(s): {currency} {flightTotal.toFixed(2)}</p>
          </div>
        )}

        <div>
          <h4 className="font-medium">Passengers</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {formData.passengers.map((p, i) => (
              <li key={i}>{p.first_name} {p.last_name} — {p.email}</li>
            ))}
          </ul>
        </div>

        <div className="font-bold text-lg">Grand Total: {currency} {grandTotal.toFixed(2)}</div>
      </div>
    </div>
  );
};


  const renderPaymentStep = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-600 mb-4">You will be redirected to the payment page to complete the booking.</p>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-6">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep - 1 >= idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {idx + 1}
              </div>
              <span className="ml-2 text-sm hidden md:block">{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {currentStep === 1 && renderPassengerStep()}
          {formData.weBookFlights && currentStep === 2 && renderFlightsStep()}
          {!formData.weBookFlights && currentStep === 2 && renderReviewStep()}
          {formData.weBookFlights && currentStep === 3 && renderReviewStep()}
          {((formData.weBookFlights && currentStep === 4) || (!formData.weBookFlights && currentStep === 3)) && renderPaymentStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button
                onClick={handleNext}
                disabled={loading || flightsLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {currentStep === steps.length ? 'Complete Booking' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
