import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import { Link } from "react-router-dom";

const ManageHotelsPage = () => {
  const queryClient = useQueryClient();
  const [newHotel, setNewHotel] = useState({
    id: null,
    name: "",
    address: "",
    city: "",
    country: "",
    destination: "",
    description: "",
    rating: "",
  });
  const [hotelImage, setHotelImage] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    api.catalog.getDestinations().then(setDestinations).catch(() => setDestinations([]));
  }, []);

  const { data: hotels, isLoading } = useQuery({
    queryKey: ["admin-hotels"],
    queryFn: api.inventory.getHotels,
  });

  const saveHotel = useMutation({
    mutationFn: (hotelData) => {
      const formData = new FormData();
      formData.append("name", hotelData.name);
      formData.append("address", hotelData.address);
      formData.append("city", hotelData.city);
      formData.append("country", hotelData.country);
      formData.append("description", hotelData.description);
      formData.append("rating", hotelData.rating || "");

      const destinationValue = hotelData.destination || hotelData.city;
      formData.append("destination", destinationValue);

      if (hotelImage) formData.append("cover_image", hotelImage);

      return hotelData.id
        ? api.inventory.updateHotel(hotelData.id, formData)
        : api.inventory.createHotel(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-hotels"]);
      resetForm();
    },
  });

  const deleteHotel = useMutation({
    mutationFn: (id) => api.inventory.deleteHotel(id),
    onSuccess: () => queryClient.invalidateQueries(["admin-hotels"]),
  });

  const resetForm = () => {
    setNewHotel({
      id: null,
      name: "",
      address: "",
      city: "",
      country: "",
      destination: "",
      description: "",
      rating: "",
    });
    setHotelImage(null);
    setIsEditing(false);
  };

  const handleEditHotel = (hotel) => {
    setNewHotel({
      id: hotel.id,
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      destination: hotel.destination,
      description: hotel.description,
      rating: hotel.rating,
    });
    setHotelImage(null);
    setIsEditing(true);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading hotels...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Manage Hotels</h1>
          <p className="text-xl text-blue-100">Add, edit, and manage hotel inventory worldwide</p>
        </div>
      </section>

      {/* Navigation */}
      <section className="max-w-7xl mx-auto px-4 py-6 -mt-8 relative z-10">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/dashboard/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ← Admin Dashboard
          </Link>
          <Link
            to="/dashboard/admin/destinations"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🌍 Manage Destinations
          </Link>
          <Link
            to="/dashboard/admin/cars"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🚗 Manage Cars
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Hotel Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Hotel" : "Add New Hotel"}
              </h2>
              <span className="text-3xl">🏨</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveHotel.mutate(newHotel);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Hotel Name"
                  value={newHotel.name}
                  onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newHotel.address}
                  onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newHotel.city}
                  onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newHotel.country}
                  onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Rating (0-5)"
                  value={newHotel.rating}
                  onChange={(e) => setNewHotel({ ...newHotel, rating: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <select
                  value={newHotel.destination}
                  onChange={(e) => setNewHotel({ ...newHotel, destination: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select Destination (optional)</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.name}>{d.name} ({d.country})</option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Hotel Description"
                value={newHotel.description}
                onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors w-full h-32"
                rows="5"
              />

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors w-full">
                    <span className="text-2xl mb-2">📷</span>
                    <span className="text-gray-600">
                      {hotelImage ? hotelImage.name : "Click to upload hotel image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setHotelImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                {hotelImage && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(hotelImage)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saveHotel.isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 flex-1 disabled:opacity-50"
                >
                  {saveHotel.isLoading ? "Saving..." : (isEditing ? "Update Hotel" : "Add Hotel")}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-4 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Hotels List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Hotels Inventory</h2>
              <span className="text-2xl text-gray-500">{hotels?.length || 0} hotels</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {hotels?.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  destinations={destinations}
                  queryClient={queryClient}
                  deleteHotel={deleteHotel}
                  onEdit={handleEditHotel}
                />
              ))}
              {(!hotels || hotels.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🏨</span>
                  <p>No hotels added yet. Start by adding your first hotel!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl text-blue-600 mb-2">🏨</div>
            <h3 className="text-lg font-bold text-gray-900">Total Hotels</h3>
            <p className="text-3xl font-bold text-blue-600">{hotels?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl text-green-600 mb-2">🏙️</div>
            <h3 className="text-lg font-bold text-gray-900">Cities Covered</h3>
            <p className="text-3xl font-bold text-green-600">
              {new Set(hotels?.map(h => h.city)).size || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl text-purple-600 mb-2">⭐</div>
            <h3 className="text-lg font-bold text-gray-900">Average Rating</h3>
            <p className="text-3xl font-bold text-purple-600">
              {hotels?.length ? (hotels.reduce((acc, h) => acc + parseFloat(h.rating || 0), 0) / hotels.length).toFixed(1) : '0.0'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const HotelCard = ({ hotel, destinations, queryClient, deleteHotel, onEdit }) => {
  const [roomTypeForm, setRoomTypeForm] = useState({
    id: null,
    name: "",
    capacity: 2,
    base_price: "",
    currency: "USD",
    quantity: 1,
  });
  const [roomImage, setRoomImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const addRoomType = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append("hotel_id", hotel.id);
      formData.append("name", data.name);
      formData.append("capacity", data.capacity);
      formData.append("base_price", data.base_price);
      formData.append("currency", data.currency);
      formData.append("quantity", data.quantity);
      if (roomImage) formData.append("image", roomImage);
      return data.id
        ? api.inventory.updateRoomType(data.id, formData)
        : api.inventory.createRoomType(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-hotels"]);
      setRoomTypeForm({ id: null, name: "", capacity: 2, base_price: "", currency: "USD", quantity: 1 });
      setRoomImage(null);
    },
  });

  const deleteRoomType = useMutation({
    mutationFn: (id) => api.request(`/inventory/room-types/${id}/`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(["admin-hotels"]),
  });

  const handleDeleteHotel = (id) => {
    if (window.confirm("Are you sure you want to delete this hotel? This will also delete all room types.")) {
      deleteHotel.mutate(id);
    }
  };

  const totalRooms = hotel.room_types?.reduce((sum, room) => sum + (room.quantity || 0), 0) || 0;

  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200 border">
      <div className="flex items-center gap-4">
        {hotel.cover_image_url && (
          <img
            src={hotel.cover_image_url}
            alt={hotel.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{hotel.name}</h3>
              <p className="text-blue-600 font-semibold">
                {hotel.city}, {hotel.country}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {hotel.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  ⭐ {hotel.rating || "N/A"}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {totalRooms} rooms
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {hotel.room_types?.length || 0} room types
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(hotel)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteHotel(hotel.id)}
                disabled={deleteHotel.isLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                {isExpanded ? "▲" : "▼"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Room Management Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-bold text-gray-900 mb-3">Room Types Management</h4>
          
          {/* Room Type Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addRoomType.mutate(roomTypeForm);
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-4 bg-white rounded-lg"
          >
            <input
              type="text"
              placeholder="Room Type Name"
              value={roomTypeForm.name}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, name: e.target.value })}
              className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={roomTypeForm.capacity}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, capacity: e.target.value })}
              className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-blue-500"
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Base Price"
              value={roomTypeForm.base_price}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, base_price: e.target.value })}
              className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={roomTypeForm.quantity}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, quantity: e.target.value })}
              className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-blue-500"
              min="1"
              required
            />
            <div className="md:col-span-2">
              <label className="flex items-center border-2 border-gray-200 px-3 py-2 rounded-lg cursor-pointer">
                {roomImage ? roomImage.name : "Select room image..."}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRoomImage(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg col-span-2 md:col-span-1"
            >
              {roomTypeForm.id ? "Update Room" : "Add Room Type"}
            </button>
            {roomTypeForm.id && (
              <button
                type="button"
                onClick={() => setRoomTypeForm({ id: null, name: "", capacity: 2, base_price: "", currency: "USD", quantity: 1 })}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Room Types List */}
          <div className="space-y-2">
            {hotel.room_types?.map((room) => (
              <div key={room.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {room.image_url && (
                    <img src={room.image_url} alt={room.name} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div>
                    <span className="font-medium">{room.name}</span>
                    <div className="text-sm text-gray-600">
                      {room.capacity} pax • {room.base_price} {room.currency} • Qty: {room.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setRoomTypeForm({
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        base_price: room.base_price,
                        currency: room.currency,
                        quantity: room.quantity,
                      });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRoomType.mutate(room.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {(!hotel.room_types || hotel.room_types.length === 0) && (
              <p className="text-center text-gray-500 py-4">No room types added yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHotelsPage;