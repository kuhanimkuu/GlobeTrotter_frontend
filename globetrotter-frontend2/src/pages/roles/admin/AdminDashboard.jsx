// src/pages/roles/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/useAuth';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/unauthorized');
    }
  }, [isAdmin, navigate]);

  const [tab, setTab] = useState('destinations');

  // Destination form
  const [destForm, setDestForm] = useState({
    name: '',
    country: '',
    description: '',
    slug: '',
  });
  const [hotelForm, setHotelForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    destination: '', // destination id
    description: '',
  });
  const [carForm, setCarForm] = useState({
    make: '',
    model: '',
    daily_rate: '',
    currency: 'USD',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    // load destinations for hotel form dropdown
    api.catalog.getDestinations()
      .then(data => setDestinations(data))
      .catch(() => setDestinations([]));
  }, []);

  // Handlers
  const handleDestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        name: destForm.name,
        country: destForm.country,
        description: destForm.description,
        slug: destForm.slug || undefined,
      };
      const res = await api.catalog.createDestination(payload);
      setMessage({ type: 'success', text: 'Destination created' });
      setDestForm({ name: '', country: '', description: '', slug: '' });
      // reload dest list
      const list = await api.catalog.getDestinations();
      setDestinations(list);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        name: hotelForm.name,
        address: hotelForm.address,
        city: hotelForm.city,
        country: hotelForm.country,
        description: hotelForm.description,
        destination: hotelForm.destination || null, // expects destination id or null
      };
      await api.inventory.createHotel(payload);
      setMessage({ type: 'success', text: 'Hotel created' });
      setHotelForm({ name: '', address: '', city: '', country: '', destination: '', description: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        make: carForm.make,
        model: carForm.model,
        daily_rate: carForm.daily_rate,
        currency: carForm.currency,
        description: carForm.description,
      };
      await api.inventory.createCar(payload);
      setMessage({ type: 'success', text: 'Car created' });
      setCarForm({ make: '', model: '', daily_rate: '', currency: 'USD', description: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4">
        <nav className="flex space-x-2">
          <button onClick={() => setTab('destinations')} className={`px-3 py-2 rounded ${tab==='destinations' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Destinations</button>
          <button onClick={() => setTab('hotels')} className={`px-3 py-2 rounded ${tab==='hotels' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Hotels</button>
          <button onClick={() => setTab('cars')} className={`px-3 py-2 rounded ${tab==='cars' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Cars</button>
        </nav>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {tab === 'destinations' && (
        <form onSubmit={handleDestSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input required value={destForm.name} onChange={(e) => setDestForm({...destForm, name: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input required value={destForm.country} onChange={(e) => setDestForm({...destForm, country: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Slug (optional)</label>
            <input value={destForm.slug} onChange={(e) => setDestForm({...destForm, slug: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={destForm.description} onChange={(e) => setDestForm({...destForm, description: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Saving...' : 'Create Destination'}
          </button>
        </form>
      )}

      {tab === 'hotels' && (
        <form onSubmit={handleHotelSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input required value={hotelForm.name} onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input value={hotelForm.address} onChange={(e) => setHotelForm({...hotelForm, address: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input value={hotelForm.city} onChange={(e) => setHotelForm({...hotelForm, city: e.target.value})} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              <input value={hotelForm.country} onChange={(e) => setHotelForm({...hotelForm, country: e.target.value})} className="w-full border rounded p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Destination (optional)</label>
            <select value={hotelForm.destination} onChange={(e) => setHotelForm({...hotelForm, destination: e.target.value})} className="w-full border rounded p-2">
              <option value="">-- none --</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name} ({d.country})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={hotelForm.description} onChange={(e) => setHotelForm({...hotelForm, description: e.target.value})} className="w-full border rounded p-2" />
          </div>

          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Saving...' : 'Create Hotel'}
          </button>
        </form>
      )}

      {tab === 'cars' && (
        <form onSubmit={handleCarSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Make</label>
            <input required value={carForm.make} onChange={(e) => setCarForm({...carForm, make: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Model</label>
            <input required value={carForm.model} onChange={(e) => setCarForm({...carForm, model: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Daily Rate</label>
              <input required value={carForm.daily_rate} onChange={(e) => setCarForm({...carForm, daily_rate: e.target.value})} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Currency</label>
              <input value={carForm.currency} onChange={(e) => setCarForm({...carForm, currency: e.target.value})} className="w-full border rounded p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={carForm.description} onChange={(e) => setCarForm({...carForm, description: e.target.value})} className="w-full border rounded p-2" />
          </div>

          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Saving...' : 'Create Car'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
