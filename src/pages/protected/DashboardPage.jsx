import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { api } from '../../services/api';
import { format } from '../../utils/format';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsResponse] = await Promise.all([
        api.booking.listMine()
      ]);

      const bookings = bookingsResponse.data || bookingsResponse.results || [];
      
      setStats({
        totalBookings: bookings.length,
        upcomingTrips: bookings.filter(b => b.status === 'CONFIRMED').length,
        totalSpent: bookings.reduce((sum, booking) => sum + parseFloat(booking.total), 0)
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.first_name}!</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">{stats.upcomingTrips}</div>
          <div className="text-gray-600">Upcoming Trips</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-purple-600">{format.currency(stats.totalSpent)}</div>
          <div className="text-gray-600">Total Spent</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/flights" className="bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700">
          Book Flight
        </Link>
        <Link to="/hotels" className="bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700">
          Book Hotel
        </Link>
        <Link to="/cars" className="bg-purple-600 text-white text-center py-3 px-4 rounded-lg hover:bg-purple-700">
          Rent Car
        </Link>
        <Link to="/tour-packages" className="bg-orange-600 text-white text-center py-3 px-4 rounded-lg hover:bg-orange-700">
          Tour Packages
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-gray-600">No recent bookings</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Booking #{booking.id}</p>
                    <p className="text-gray-600">{format.date(booking.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{format.currency(booking.total, booking.currency)}</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;