import React, { useEffect, useState } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { api } from '../../services/api';

export default function BookingWizardPage() {
  const { state } = useLocation();
  console.log('BookingWizardPage state:', state);
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
    customer_country: passedData?.customer_country || '',
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Booking Data</h2>
          <p className="text-gray-600 mb-8">Please select a service to book</p>
          <Link
            to="/destinations"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Explore Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h3>
            <p className="text-gray-600">Please sign in to continue with your booking</p>
          </div>
          <div className="flex gap-4">
            <button
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-3 rounded-xl transition-all duration-200"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200"
              onClick={() => navigate('/login', { state: { from: '/booking-wizard', bookingState: state } })}
            >
              Sign In
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Passenger Information</h2>
        <p className="text-gray-600">Enter details for all travelers</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Your Country (for flight search)</label>
          <input
            value={formData.customer_country}
            onChange={(e) => setFormData((p) => ({ ...p, customer_country: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Country (e.g. Kenya)"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Passenger Details</h3>
          {formData.passengers.map((p, idx) => (
            <div key={idx} className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-all duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    placeholder="First name"
                    value={p.first_name}
                    onChange={(e) => updatePassenger(idx, { first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    placeholder="Last name"
                    value={p.last_name}
                    onChange={(e) => updatePassenger(idx, { last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    placeholder="Email"
                    value={p.email}
                    onChange={(e) => updatePassenger(idx, { email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    placeholder="Phone"
                    value={p.phone}
                    onChange={(e) => updatePassenger(idx, { phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={p.date_of_birth}
                    onChange={(e) => updatePassenger(idx, { date_of_birth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={p.gender}
                    onChange={(e) => updatePassenger(idx, { gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                {formData.passengers.length > 1 && (
                  <button
                    className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                    onClick={() => removePassenger(idx)}
                    type="button"
                  >
                    Remove Passenger
                  </button>
                )}
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addPassenger}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-blue-600 font-medium"
          >
            + Add Another Passenger
          </button>
        </div>

        <div className="pt-4">
          <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.weBookFlights}
              onChange={(e) => setFormData((p) => ({ ...p, weBookFlights: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">✈️ Yes — please search & book flights for us (optional)</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderFlightsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Flights</h2>
        <p className="text-gray-600">Choose the best flight option for your journey</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
        <div className="mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
            onClick={searchFlights}
            disabled={flightsLoading}
          >
            {flightsLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching Flights...
              </span>
            ) : '🔍 Search Available Flights'}
          </button>
        </div>

        {flightsLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching for the best flight options...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {flightOptions.length === 0 && !flightsLoading && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✈️</div>
              <p className="text-gray-600">No flight options found for your search criteria.</p>
            </div>
          )}

          {flightOptions.map((f) => {
            const id = f.id || f.offer_id;
            const depart = f.departure_time ? new Date(f.departure_time) : null;
            const arrive = f.arrival_time ? new Date(f.arrival_time) : null;
            const price = f.price || 'N/A';
            const seats = f.seats_available || 0;

            return (
              <div
                key={id}
                className={`p-6 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  selectedFlight === f 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedFlight(f)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">✈️</div>
                      <div className="font-bold text-lg">{f.airline || 'Unknown Airline'}</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      {f.origin} → {f.destination}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>🛫 Departure: {depart ? depart.toLocaleString() : 'N/A'}</div>
                      <div>🛬 Arrival: {arrive ? arrive.toLocaleString() : 'N/A'}</div>
                      <div>💺 Seats available: {seats}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-2xl font-bold text-blue-600">
                      {f.currency} {price}
                    </div>
                    <button
                      className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                        selectedFlight === f
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {selectedFlight === f ? 'Selected ✓' : 'Select Flight'}
                    </button>
                  </div>
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
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
          <p className="text-gray-600">Please verify all details before proceeding to payment</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 space-y-6">
          {/* Package Details */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📦 {bookingType === 'tour' ? 'Package' : bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}
            </h4>
            <p className="text-lg font-semibold text-gray-800 mb-2">{pkg.title || pkg.name}</p>
            <p className="text-gray-600 mb-3">{pkg.summary}</p>
            {pkg.hotel && <p className="text-sm text-gray-700">🏨 Hotel: {pkg.hotel?.name || 'N/A'}</p>}
            {pkg.car && <p className="text-sm text-gray-700">🚗 Car: {pkg.car?.make || ''} {pkg.car?.model || ''}</p>}
            <div className="bg-blue-50 p-4 rounded-xl mt-3">
              <p className="font-semibold text-blue-900">
                Package total for {numberOfPassengers} passenger(s): {currency} {pkgTotal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Flight Details */}
          {selectedFlight && (
            <div className="border-b border-gray-200 pb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">✈️ Selected Flight</h4>
              <p className="font-semibold text-gray-800">{selectedFlight.title || selectedFlight.airline || 'Flight'}</p>
              <p className="text-gray-600">{selectedFlight.origin} → {selectedFlight.destination}</p>
              <div className="bg-green-50 p-4 rounded-xl mt-3">
                <p className="font-semibold text-green-900">
                  Flight total for {numberOfPassengers} passenger(s): {currency} {flightTotal.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Passenger Details */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">👥 Passengers</h4>
            <div className="grid gap-3">
              {formData.passengers.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">👤</div>
                  <div>
                    <p className="font-semibold text-gray-900">{p.first_name} {p.last_name}</p>
                    <p className="text-sm text-gray-600">{p.email} • {p.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Grand Total</span>
              <span className="text-3xl font-bold text-yellow-400">{currency} {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment</h2>
        <p className="text-gray-600">Secure payment processing</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment Gateway</h3>
          <p className="text-gray-600">You will be redirected to our secure payment page to complete your booking</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              '💰 Proceed to Secure Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Your Booking
          </h1>
          <p className="text-xl text-gray-600">Just a few steps to confirm your amazing journey</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10 mx-8"></div>
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                currentStep - 1 >= idx 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {idx + 1}
              </div>
              <span className={`mt-2 text-sm font-medium text-center max-w-24 ${
                currentStep - 1 >= idx ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-100">
          {currentStep === 1 && renderPassengerStep()}
          {formData.weBookFlights && currentStep === 2 && renderFlightsStep()}
          {!formData.weBookFlights && currentStep === 2 && renderReviewStep()}
          {formData.weBookFlights && currentStep === 3 && renderReviewStep()}
          {((formData.weBookFlights && currentStep === 4) || (!formData.weBookFlights && currentStep === 3)) && renderPaymentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-8 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl">
                {error}
              </div>
            )}
            <button
              onClick={handleNext}
              disabled={loading || flightsLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {currentStep === steps.length ? 'Complete Booking →' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}  