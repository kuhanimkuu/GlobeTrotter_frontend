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
    },
  });

  const deleteHotel = useMutation({
    mutationFn: (id) => api.inventory.deleteHotel(id),
    onSuccess: () => queryClient.invalidateQueries(["admin-hotels"]),
  });

  if (isLoading) return <p>Loading hotels...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Hotels</h1>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to="/dashboard/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition w-full sm:w-auto text-center"
        >
          Admin Dashboard
        </Link>
        <Link
          to="/dashboard/admin/destinations"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition w-full sm:w-auto text-center"
        >
          Manage Destinations
        </Link>
        <Link
          to="/dashboard/admin/cars"
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition w-full sm:w-auto text-center"
        >
          Manage Cars
        </Link>
      </div>

      {/* Add / Edit Hotel Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveHotel.mutate(newHotel);
        }}
        className="mb-6 grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Hotel Name"
          value={newHotel.name}
          onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={newHotel.address}
          onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={newHotel.city}
          onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Country"
          value={newHotel.country}
          onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Rating (0-5)"
          value={newHotel.rating}
          onChange={(e) => setNewHotel({ ...newHotel, rating: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <select
          value={newHotel.destination}
          onChange={(e) => setNewHotel({ ...newHotel, destination: e.target.value })}
          className="border px-3 py-2 rounded col-span-2"
        >
          <option value="">-- Select Destination (optional, defaults to city) --</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.name}>{d.name} ({d.country})</option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={newHotel.description}
          onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
          className="border px-3 py-2 rounded col-span-2"
        />
        <div className="col-span-2">
          <label className="flex flex-col border px-3 py-2 rounded cursor-pointer text-gray-600 hover:bg-gray-100">
            {hotelImage ? hotelImage.name : "Select a cover image..."}
            <input type="file" accept="image/*" onChange={(e) => setHotelImage(e.target.files[0])} className="hidden" />
          </label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-2">
          {newHotel.id ? "Update Hotel" : "Add Hotel"}
        </button>
      </form>

      {/* Hotels List */}
      <div className="space-y-4">
        {hotels?.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            destinations={destinations}
            queryClient={queryClient}
            deleteHotel={deleteHotel}
            setNewHotel={setNewHotel}
            setHotelImage={setHotelImage}
          />
        ))}
      </div>
    </div>
  );
};

const HotelCard = ({ hotel, destinations, queryClient, deleteHotel, setNewHotel, setHotelImage }) => {
  const [roomTypeForm, setRoomTypeForm] = useState({
    id: null,
    name: "",
    capacity: 2,
    base_price: "",
    currency: "USD",
    quantity: 1,
  });
  const [roomImage, setRoomImage] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);

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
      setEditingRoomId(null);
    },
  });

  const deleteRoomType = useMutation({
    mutationFn: (id) => api.request(`/inventory/room-types/${id}/`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(["admin-hotels"]),
  });

  const handleDeleteHotel = (id) => {
    if (window.confirm("Are you sure you want to delete this hotel? This action cannot be undone.")) {
      deleteHotel.mutate(id);
    }
  };

  const handleEditHotel = () => {
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
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          {hotel.cover_image_url && (
            <img src={hotel.cover_image_url} alt={hotel.name} className="w-16 h-16 object-cover rounded" />
          )}
          <span className="font-medium">
            {hotel.name} – {hotel.city}, {hotel.country} – ⭐ {hotel.rating || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleEditHotel} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit Hotel</button>
          <button onClick={() => handleDeleteHotel(hotel.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </div>
      </div>

      {/* RoomType Form */}
<form
  onSubmit={(e) => {
    e.preventDefault();
    addRoomType.mutate(roomTypeForm);
  }}
  className="grid grid-cols-2 gap-2 border-t pt-2 mt-2"
>
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Room Type Name</label>
    <input
      type="text"
      placeholder="Room Type Name"
      value={roomTypeForm.name}
      onChange={(e) => setRoomTypeForm({ ...roomTypeForm, name: e.target.value })}
      className="border px-2 py-1 rounded"
      required
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Capacity (pax)</label>
    <input
      type="number"
      placeholder="Capacity"
      value={roomTypeForm.capacity}
      onChange={(e) => setRoomTypeForm({ ...roomTypeForm, capacity: e.target.value })}
      className="border px-2 py-1 rounded"
      min={1}
      required
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Base Price</label>
    <input
      type="number"
      placeholder="Base Price"
      value={roomTypeForm.base_price}
      onChange={(e) => setRoomTypeForm({ ...roomTypeForm, base_price: e.target.value })}
      className="border px-2 py-1 rounded"
      required
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Currency</label>
    <input
      type="text"
      placeholder="Currency"
      value={roomTypeForm.currency}
      onChange={(e) => setRoomTypeForm({ ...roomTypeForm, currency: e.target.value })}
      className="border px-2 py-1 rounded"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Quantity</label>
    <input
      type="number"
      placeholder="Quantity"
      value={roomTypeForm.quantity}
      onChange={(e) => setRoomTypeForm({ ...roomTypeForm, quantity: e.target.value })}
      className="border px-2 py-1 rounded"
      min={1}
      required
    />
  </div>

  <div className="col-span-2 flex flex-col">
    <label className="text-sm font-medium mb-1">Room Image</label>
    <label className="flex flex-col border px-2 py-1 rounded cursor-pointer text-gray-600 hover:bg-gray-100">
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
    className="bg-green-600 text-white px-4 py-2 rounded col-span-2"
  >
    {roomTypeForm.id ? "Update Room Type" : "Add Room Type"}
  </button>
</form>


      {/* Existing Room Types  */}
      <div className="mt-4 space-y-2">
        {hotel.room_types?.map((room) => (
          <div key={room.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <div className="flex items-center gap-3">
              {room.image_url && (
                <img src={room.image_url} alt={room.name} className="w-12 h-12 object-cover rounded" />
              )}
              <span>
                {room.name} – {room.capacity} pax – {room.base_price} {room.currency} – Qty: {room.quantity}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingRoomId(room.id);
                  setRoomTypeForm({
                    id: room.id,
                    name: room.name,
                    capacity: room.capacity,
                    base_price: room.base_price,
                    currency: room.currency,
                    quantity: room.quantity,
                  });
                  setRoomImage(null);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteRoomType.mutate(room.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageHotelsPage;
