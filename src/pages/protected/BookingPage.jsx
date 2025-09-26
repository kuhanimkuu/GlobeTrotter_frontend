import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const BookingPage = () => {
  const { state } = useLocation();
  const { user } = useAuth();

  const bookingType = state?.type;
  const bookingData = state?.data;

  const getBookingIcon = () => {
    switch (bookingType) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'car': return '🚗';
      case 'package': return '🌴';
      default: return '📋';
    }
  };

  const getBookingTitle = () => {
    switch (bookingType) {
      case 'flight': return 'Flight Booking';
      case 'hotel': return 'Hotel Reservation';
      case 'car': return 'Car Rental';
      case 'package': return 'Tour Package';
      default: return 'Booking';
    }
  };

  const getBookingDetails = () => {
    switch (bookingType) {
      case 'flight':
        return {
          title: `${bookingData?.origin} → ${bookingData?.destination}`,
          details: [
            { label: 'Airline', value: bookingData?.airline },
            { label: 'Flight Number', value: bookingData?.flightNumber },
            { label: 'Departure', value: bookingData?.departureTime },
            { label: 'Duration', value: bookingData?.duration },
            { label: 'Price', value: bookingData?.price, highlight: true }
          ]
        };
      case 'hotel':
        return {
          title: bookingData?.name,
          details: [
            { label: 'Location', value: bookingData?.location },
            { label: 'Check-in', value: bookingData?.checkIn },
            { label: 'Check-out', value: bookingData?.checkOut },
            { label: 'Guests', value: bookingData?.guests },
            { label: 'Total Price', value: bookingData?.price, highlight: true }
          ]
        };
      case 'car':
        return {
          title: `${bookingData?.brand} ${bookingData?.model}`,
          details: [
            { label: 'Rental Period', value: bookingData?.rentalPeriod },
            { label: 'Pick-up Location', value: bookingData?.pickupLocation },
            { label: 'Drop-off Location', value: bookingData?.dropoffLocation },
            { label: 'Features', value: bookingData?.features?.join(', ') },
            { label: 'Total Price', value: bookingData?.price, highlight: true }
          ]
        };
      case 'package':
        return {
          title: bookingData?.name,
          details: [
            { label: 'Destination', value: bookingData?.destination },
            { label: 'Duration', value: bookingData?.duration },
            { label: 'Includes', value: bookingData?.includes?.join(', ') },
            { label: 'Travelers', value: bookingData?.travelers },
            { label: 'Package Price', value: bookingData?.price, highlight: true }
          ]
        };
      default:
        return { title: 'Booking Details', details: [] };
    }
  };

  const bookingDetails = getBookingDetails();

  if (!bookingType || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Booking Data</h2>
            <p className="text-gray-600 mb-6">Please select a service to book first</p>
            <Link
              to="/services"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 inline-block"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">{getBookingIcon()}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Your {getBookingTitle()}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Review your details and complete the booking process
          </p>
        </div>

        {/* Main Booking Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-white hover:border-yellow-400 transition-all duration-300">
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{bookingDetails.title}</h2>
            <div className="flex items-center text-gray-600">
              <span className="mr-2">{getBookingIcon()}</span>
              <span>{getBookingTitle()}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {bookingDetails.details.map((detail, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm font-medium">{detail.label}</p>
                <p className={`font-semibold text-lg ${detail.highlight ? 'text-blue-600' : 'text-gray-900'}`}>
                  {detail.value || 'Not specified'}
                </p>
              </div>
            ))}
          </div>

          {/* User Information */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Traveler Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="font-semibold text-gray-900">{user?.name || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-gray-900">{user?.email || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Traveler Type</p>
                <p className="font-semibold text-gray-900 capitalize">{user?.travelerType || 'Standard'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Action Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h3>
          
          {/* Price Summary */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{bookingData?.price || '$0.00'}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-semibold">$25.00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Taxes</span>
              <span className="font-semibold">$15.00</span>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  {bookingData?.price ? `$${(parseFloat(bookingData.price.replace('$', '')) + 40).toFixed(2)}` : '$0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Select Payment Method</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Credit Card', 'PayPal', 'Google Pay', 'Apple Pay'].map((method) => (
                <button
                  key={method}
                  className="border-2 border-gray-300 hover:border-blue-500 p-4 rounded-xl text-center transition-all duration-200"
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
              💳 Confirm & Pay Now
            </button>
            <Link
              to="/services"
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-4 px-6 rounded-xl text-center transition-all duration-200"
            >
              ← Back to Services
            </Link>
          </div>
        </div>

        {/* Security & Support */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 text-gray-600">
            <span className="mr-2">🔒</span>
            <span>Your payment is secure and encrypted</span>
          </div>
          <p className="text-gray-600">
            Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;