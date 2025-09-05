import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const BookingPage = () => {
  const { state } = useLocation();
  const { user } = useAuth();

  const bookingType = state?.type;
  const bookingData = state?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {bookingType === 'flight' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Flight Booking</h2>
              <p>Booking flight from {bookingData?.origin} to {bookingData?.destination}</p>
            </div>
          )}

          {bookingType === 'hotel' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Hotel Booking</h2>
              <p>Booking hotel: {bookingData?.name}</p>
            </div>
          )}

          {bookingType === 'car' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Car Rental</h2>
              <p>Booking car: {bookingData?.model}</p>
            </div>
          )}

          {bookingType === 'package' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Tour Package</h2>
              <p>Booking package: {bookingData?.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;