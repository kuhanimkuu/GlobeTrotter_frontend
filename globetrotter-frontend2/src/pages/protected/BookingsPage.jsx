import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { format } from '../../utils/format';
import { useAuth } from '../../contexts/useAuth';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

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

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
          <p className="text-gray-600">Start exploring our services to make your first booking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Booking #{booking.id}</h3>
                  <p className="text-gray-600">{format.date(booking.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-semibold">{format.currency(booking.total, booking.currency)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-semibold capitalize">{booking.booking_type}</p>
                </div>
              </div>

              {booking.status === 'PENDING' && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;