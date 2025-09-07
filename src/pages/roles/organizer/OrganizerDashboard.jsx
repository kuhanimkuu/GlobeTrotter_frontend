import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/api";
import { format } from "../../../utils/format";
import { useAuth } from "../../../contexts/useAuth";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPackages: 0,
    activeBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [packages, bookings] = await Promise.all([
        api.organizer.getPackages(),
        api.organizer.getBookings(),
      ]);

      setStats({
        totalPackages: packages.length,
        activeBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
        totalRevenue: bookings.reduce(
          (sum, b) => sum + parseFloat(b.total || 0),
          0
        ),
        averageRating:
          packages.reduce((sum, p) => sum + (p.rating || 0), 0) /
          (packages.length || 1),
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error("Failed to load organizer data:", error);
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
      <h1 className="text-3xl font-bold mb-8">Organizer Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome back, {user?.first_name}! Here's your business overview.
      </p>

      {/* Quick Actions */}
      <div className="flex space-x-4 mb-8">
        <Link
          to="/organizer/packages"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Manage Tour Packages
        </Link>
        <Link
           to="/organizer/packages"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Packages
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalPackages}
          </div>
          <div className="text-gray-600">Total Packages</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">
            {stats.activeBookings}
          </div>
          <div className="text-gray-600">Active Bookings</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-purple-600">
            {format.currency(stats.totalRevenue)}
          </div>
          <div className="text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-gray-600">No recent bookings</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Booking #{booking.id}</p>
                    <p className="text-gray-600">{booking.package?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {format.currency(booking.total, booking.currency)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
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

export default OrganizerDashboard;
