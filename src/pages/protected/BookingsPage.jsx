import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { format } from '../../utils/format';
import { useAuth } from '../../contexts/useAuth';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.booking.listMine();
      setBookings(response.data || response.results || []);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.booking.cancel(bookingId);
      loadBookings(); 
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handleViewDetails = (booking) => {
    // Navigate to booking details page with booking data
    navigate(`/bookings/${booking.id}`, { 
      state: { 
        bookingData: booking,
        type: booking.booking_type || 'general'
      } 
    });
  };

  const handleDownloadReceipt = async (bookingId) => {
    try {
      setDownloading(bookingId);
      
      // Try to download receipt via API if available
      if (api.booking.downloadReceipt) {
        const response = await api.booking.downloadReceipt(bookingId);
        
        if (response.data && response.data.downloadUrl) {
          window.open(response.data.downloadUrl, '_blank');
          return;
        }
      }
      
      // Fallback: Generate client-side receipt
      generateClientSideReceipt(bookingId);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      // Fallback to client-side receipt generation
      generateClientSideReceipt(bookingId);
    } finally {
      setDownloading(null);
    }
  };

  const generateClientSideReceipt = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const receiptContent = `
TRAVEL AGENCY - BOOKING RECEIPT
===============================

Booking ID: ${booking.id}
Date: ${new Date().toLocaleDateString()}
Status: ${booking.status}
Type: ${booking.booking_type}
Amount: ${format.currency(booking.total, booking.currency)}
Customer: ${user?.first_name} ${user?.last_name}
Email: ${user?.email}

Booking Details:
${booking.destination ? `Destination: ${booking.destination}` : ''}
${booking.dates ? `Dates: ${booking.dates}` : ''}
${booking.guests ? `Guests: ${booking.guests}` : ''}

Thank you for choosing Travel Agency!
For support: support@travelagency.com
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintReceipt = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - Booking #${booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 4px 0; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666; }
            .highlight { background-color: #f0f8ff; padding: 10px; border-radius: 5px; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌴 TRAVEL AGENCY</h1>
            <h2>BOOKING RECEIPT</h2>
          </div>
          
          <div class="details">
            <div class="detail-row"><strong>Booking ID:</strong> ${booking.id}</div>
            <div class="detail-row"><strong>Booking Date:</strong> ${format.date(booking.created_at)}</div>
            <div class="detail-row"><strong>Status:</strong> ${booking.status}</div>
            <div class="detail-row"><strong>Type:</strong> ${booking.booking_type}</div>
            
            ${booking.destination ? `<div class="detail-row"><strong>Destination:</strong> ${booking.destination}</div>` : ''}
            ${booking.dates ? `<div class="detail-row"><strong>Dates:</strong> ${booking.dates}</div>` : ''}
            ${booking.guests ? `<div class="detail-row"><strong>Guests:</strong> ${booking.guests}</div>` : ''}
            
            <div class="highlight">
              <div class="detail-row"><strong>Total Amount:</strong> ${format.currency(booking.total, booking.currency)}</div>
            </div>
          </div>
          
          <div class="details">
            <h3>Customer Information</h3>
            <div class="detail-row"><strong>Name:</strong> ${user?.first_name} ${user?.last_name}</div>
            <div class="detail-row"><strong>Email:</strong> ${user?.email}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for your booking!</p>
            <p>For any questions, please contact support@travelagency.com</p>
            <p>Printed on: ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (loading) return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold text-gray-900">Loading your bookings...</h2>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading bookings</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={loadBookings}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            My Bookings
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Manage your upcoming trips and view booking history
          </p>
        </div>
      </section>

      {/* Bookings Content */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start exploring our amazing destinations to make your first booking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/destinations"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
              >
                🌍 Explore Destinations
              </Link>
              <Link
                to="/tour-packages"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-200"
              >
                📦 View Packages
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Your Bookings</h2>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Booking #{booking.id}
                        </h3>
                        <p className="text-gray-600">
                          Created on {format.date(booking.created_at)}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border border-green-200' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                        <p className="font-bold text-lg text-gray-900">
                          {format.currency(booking.total, booking.currency)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-600 text-sm mb-1">Type</p>
                        <p className="font-bold text-lg text-gray-900 capitalize">
                          {booking.booking_type}
                        </p>
                      </div>
                    </div>

                    {/* Additional booking details */}
                    <div className="space-y-3 mb-6">
                      {booking.destination && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-3">📍</span>
                          <span>{booking.destination}</span>
                        </div>
                      )}
                      {booking.dates && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-3">📅</span>
                          <span>{booking.dates}</span>
                        </div>
                      )}
                      {booking.guests && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-3">👥</span>
                          <span>{booking.guests} guests</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            Cancel Booking
                          </button>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-200">
                            Modify
                          </button>
                        </>
                      )}

                      {booking.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-200"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(booking.id)}
                            disabled={downloading === booking.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            {downloading === booking.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Downloading...
                              </>
                            ) : (
                              'Download Receipt'
                            )}
                          </button>
                        </>
                      )}
                      
                      {/* Print receipt button for all statuses */}
                      <button
                        onClick={() => handlePrintReceipt(booking.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-200"
                      >
                        Print Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Support Section */}
      {bookings.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Help with Your Booking?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our travel experts are here to assist you with any questions or changes to your bookings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Contact Support
              </Link>
              <a
                href="tel:+1-555-123-4567"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-200"
              >
                Call Now: +254 799 626 531
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BookingsPage;