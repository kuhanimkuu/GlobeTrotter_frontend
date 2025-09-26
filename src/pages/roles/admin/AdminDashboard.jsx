import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/api";
import { useAuth } from "../../../contexts/useAuth";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDestinations: 0,
    totalHotels: 0,
    totalCars: 0
  });

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dests, hots, crs] = await Promise.all([
          api.catalog.getDestinations(),
          api.inventory.getHotels(),
          api.inventory.getCars()
        ]);

        setDestinations(dests || []);
        setHotels(hots || []);
        setCars(crs || []);
        setStats({
          totalDestinations: dests?.length || 0,
          totalHotels: hots?.length || 0,
          totalCars: crs?.length || 0
        });
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (!isAdmin) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin data...</p>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${color} hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  const AdminCard = ({ item, type, link }) => (
    <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
      {item.image && (
        <img
          src={item.image}
          alt={item.name || `${item.make} ${item.model}`}
          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 truncate">
          {item.name || `${item.make} ${item.model}`}
        </h3>
        {type === "hotel" && <p className="text-gray-500 text-sm truncate">{item.city}, {item.country}</p>}
        {type === "car" && <p className="text-gray-500 text-sm">{item.daily_rate} {item.currency}/day</p>}
        {type === "destination" && <p className="text-gray-500 text-sm truncate">{item.description || "Popular destination"}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-xl text-blue-100">Welcome back, {user?.first_name}! Manage your travel platform.</p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Destinations" 
            value={stats.totalDestinations} 
            icon="🌍" 
            color="border-green-500" 
          />
          <StatCard 
            title="Total Hotels" 
            value={stats.totalHotels} 
            icon="🏨" 
            color="border-blue-500" 
          />
          <StatCard 
            title="Total Cars" 
            value={stats.totalCars} 
            icon="🚗" 
            color="border-yellow-500" 
          />
        </div>
      </section>

      {/* Management Sections */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Destinations Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Destinations</h2>
              <span className="text-2xl">🌍</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {destinations.slice(0, 3).map((d) => (
                <AdminCard key={d.id} item={d} type="destination" />
              ))}
            </div>
            
            <Link
              to="/admin/destinations"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 text-center block"
            >
              Manage Destinations
            </Link>
          </div>

          {/* Hotels Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Hotels</h2>
              <span className="text-2xl">🏨</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {hotels.slice(0, 3).map((h) => (
                <AdminCard key={h.id} item={h} type="hotel" />
              ))}
            </div>
            
            <Link
              to="/admin/hotels"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 text-center block"
            >
              Manage Hotels
            </Link>
          </div>

          {/* Cars Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Cars</h2>
              <span className="text-2xl">🚗</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {cars.slice(0, 3).map((c) => (
                <AdminCard key={c.id} item={c} type="car" />
              ))}
            </div>
            
            <Link
              to="/admin/cars"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 text-center block"
            >
              Manage Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Quick Actions</h2>
          <p className="text-blue-100 mb-6">Manage your travel platform efficiently</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admin/destinations/new"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all duration-200"
            >
              + Add Destination
            </Link>
            <Link
              to="/admin/hotels/new"
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              + Add Hotel
            </Link>
            <Link
              to="/admin/cars/new"
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              + Add Car
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2">Platform Analytics</h3>
            <p className="text-gray-600">View detailed insights and performance metrics</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p className="text-gray-600">Manage users and their permissions</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold mb-2">Settings</h3>
            <p className="text-gray-600">Configure platform settings and preferences</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;