import React from 'react';
import { useLocation } from 'react-router-dom';
import { format } from '../../utils/format';

const ReceiptPage = () => {
  const { state } = useLocation();
  const booking = state?.booking;
  const payment = state?.payment;

  if (!booking || !payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Booking Found</h2>
            <p className="text-gray-600 mb-6">Please complete your booking first</p>
            <a
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 inline-block"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('PDF download functionality would be implemented here');
  };

  // --- Extract Details with Safe Fallbacks ---
  const bookingId = booking.id || 'N/A';
  const bookingType = booking.booking_type || booking.type || 'N/A';
  const bookingDate = booking.created_at
    ? format.date(booking.created_at)
    : booking.date
    ? format.date(booking.date)
    : 'N/A';

  const customerName =
    booking.customer_name ||
    booking.user?.name ||
    (booking.passengers?.[0]
      ? `${booking.passengers[0].first_name} ${booking.passengers[0].last_name}`
      : 'N/A');

  const customerEmail =
    booking.user_email ||
    booking.customer_email ||
    booking.user?.email ||
    booking.passengers?.[0]?.email ||
    'N/A';

  const customerPhone =
    booking.user_phone ||
    booking.customer_phone ||
    booking.user?.phone ||
    booking.passengers?.[0]?.phone ||
    'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Printable Receipt */}
        <div className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none border-2 border-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600">Your booking has been successfully processed</p>
          </div>

          {/* Booking Details */}
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Booking ID</p>
                <p className="font-bold text-lg">#{bookingId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Booking Type</p>
                <p className="font-bold text-lg capitalize">{bookingType}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-bold text-lg">{bookingDate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-bold text-lg text-green-600">Confirmed</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Amount Paid</p>
                <p className="font-bold text-lg text-blue-600">
                  {format.currency(payment.amount, payment.currency)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Payment Method</p>
                <p className="font-bold text-lg capitalize">{payment.method}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Transaction ID</p>
                <p className="font-bold text-lg">{payment.transaction_id}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Payment Status</p>
                <p className="font-bold text-lg text-green-600">Completed</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-gray-100">
            <h3 className="font-bold text-xl text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold text-gray-900">{customerName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-gray-900">{customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-semibold text-gray-900">{customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
            <p className="text-lg text-gray-700">
              Thank you for choosing our service! We wish you a wonderful journey. 🌟
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            📄 Download PDF
          </button>
          <a
            href="/dashboard"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            📊 Go to Dashboard
          </a>
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need help with your booking?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
            >
              Contact Support
            </a>
            <a
              href="/destinations"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
            >
              Explore More Destinations
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
