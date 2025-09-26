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
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Ready for your next adventure? Here's your travel dashboard.
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-yellow-400">
            <div className="text-4xl mb-4">📋</div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalBookings}</div>
            <div className="text-gray-600 text-lg font-semibold">Total Bookings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-green-400">
            <div className="text-4xl mb-4">✈️</div>
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.upcomingTrips}</div>
            <div className="text-gray-600 text-lg font-semibold">Upcoming Trips</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-purple-400">
            <div className="text-4xl mb-4">💰</div>
            <div className="text-4xl font-bold text-purple-600 mb-2">{format.currency(stats.totalSpent)}</div>
            <div className="text-gray-600 text-lg font-semibold">Total Spent</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link 
              to="/flights" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center group"
            >
              <div className="text-2xl mb-2">✈️</div>
              <span className="group-hover:text-yellow-200 transition-colors">Book Flight</span>
            </Link>
            <Link 
              to="/hotels" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center group"
            >
              <div className="text-2xl mb-2">🏨</div>
              <span className="group-hover:text-yellow-200 transition-colors">Book Hotel</span>
            </Link>
            <Link 
              to="/cars" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center group"
            >
              <div className="text-2xl mb-2">🚗</div>
              <span className="group-hover:text-yellow-200 transition-colors">Rent Car</span>
            </Link>
            <Link 
              to="/tour-packages" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center group"
            >
              <div className="text-2xl mb-2">🌴</div>
              <span className="group-hover:text-yellow-200 transition-colors">Tour Packages</span>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Bookings</h2>
            <Link 
              to="/bookings" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200"
            >
              View All Bookings
            </Link>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No recent bookings</h3>
              <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
              <Link 
                to="/destinations" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Explore Destinations
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border-2 border-gray-100 hover:border-yellow-400 rounded-xl p-6 transition-all duration-200 hover:shadow-lg">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Booking #{booking.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border border-green-200' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <span className="font-semibold">Created:</span> {format.date(booking.created_at)}
                      </p>
                      <p className="text-gray-600 capitalize">
                        <span className="font-semibold">Type:</span> {booking.booking_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {format.currency(booking.total, booking.currency)}
                      </p>
                      <Link 
                        to={`/bookings/${booking.id}`} 
                        className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Discover amazing destinations and create unforgettable memories with our curated travel experiences.
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
      </section>
    </div>
  );
};

export default DashboardPage;