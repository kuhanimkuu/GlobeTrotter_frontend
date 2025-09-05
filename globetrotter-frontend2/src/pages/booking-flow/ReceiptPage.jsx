import React from 'react';
import { useLocation } from 'react-router-dom';
import { format } from '../../utils/format';

const ReceiptPage = () => {
  const { state } = useLocation();
  const booking = state?.booking;
  const payment = state?.payment;

  if (!booking || !payment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Booking Found</h2>
          <p className="text-gray-600">Please complete your booking first</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    alert('PDF download functionality would be implemented here');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Printable Receipt */}
        <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="text-gray-600">Your booking has been successfully processed</p>
          </div>

          {/* Booking Details */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-semibold">#{booking.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold text-green-600">Confirmed</p>
              </div>
              <div>
                <p className="text-gray-600">Booking Type</p>
                <p className="font-semibold capitalize">{booking.booking_type}</p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-semibold">{format.date(booking.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Amount Paid</p>
                <p className="font-semibold">{format.currency(payment.amount, payment.currency)}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-semibold capitalize">{payment.method}</p>
              </div>
              <div>
                <p className="text-gray-600">Transaction ID</p>
                <p className="font-semibold">{payment.transaction_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status</p>
                <p className="font-semibold text-green-600">Completed</p>
              </div>
            </div>
          </div>

          {/* Booking Specific Details */}
          {booking.booking_type === 'flight' && booking.flight && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">{booking.flight.airline} - {booking.flight.flight_number}</p>
                <p className="text-gray-600">
                  {booking.flight.origin_code} → {booking.flight.destination_code}
                </p>
                <p className="text-sm text-gray-600">
                  Departure: {format.dateTime(booking.flight.departure_time)}
                </p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">Email: {booking.user_email}</p>
            <p className="text-gray-600">Phone: {booking.user_phone || 'Not provided'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300"
          >
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;