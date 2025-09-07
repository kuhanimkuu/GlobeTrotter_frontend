// src/pages/dashboard/admin/AdminDashboard.jsx
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

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const dests = await api.catalog.getDestinations();
        const hots = await api.inventory.getHotels();
        const crs = await api.inventory.getCars();

        setDestinations(dests || []);
        setHotels(hots || []);
        setCars(crs || []);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (!isAdmin) return <p>Unauthorized</p>;
  if (loading) return <p>Loading admin data...</p>;

  const renderCard = (item, type) => (
    <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
      {item.image && (
        <img
          src={item.image}
          alt={item.name || `${item.make} ${item.model}`}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}
      <h3 className="font-semibold text-lg mb-1">
        {item.name || `${item.make} ${item.model}`}
      </h3>
      {type === "hotel" && <p className="text-gray-500 text-sm">{item.city}, {item.country}</p>}
      {type === "car" && <p className="text-gray-500 text-sm">{item.daily_rate} {item.currency}</p>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-700 mb-8">Welcome back, {user?.first_name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Destinations */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Destinations</h2>
          <div className="grid grid-cols-1 gap-3 mb-3">
            {destinations.slice(0, 5).map((d) => renderCard(d, "destination"))}
          </div>
          <Link
            to="/admin/destinations"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
          >
            Manage Destinations
          </Link>
        </div>

        {/* Hotels */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Hotels</h2>
          <div className="grid grid-cols-1 gap-3 mb-3">
            {hotels.slice(0, 5).map((h) => renderCard(h, "hotel"))}
          </div>
          <Link
            to="/admin/hotels"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
          >
            Manage Hotels
          </Link>
        </div>

        {/* Cars */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Cars</h2>
          <div className="grid grid-cols-1 gap-3 mb-3">
            {cars.slice(0, 5).map((c) => renderCard(c, "car"))}
          </div>
          <Link
            to="/admin/cars"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
          >
            Manage Cars
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
