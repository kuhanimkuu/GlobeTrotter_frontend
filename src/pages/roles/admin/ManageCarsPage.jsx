// src/pages/dashboard/admin/ManageCarsPage.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/api";

const ManageCarsPage = () => {
  const queryClient = useQueryClient();

  const [newCar, setNewCar] = useState({
    id: null,
    make: "",
    model: "",
    category: "",
    daily_rate: "",
    currency: "USD",
    description: "",
    city: "",
    destination_id: "",
  });

  const [carImage, setCarImage] = useState(null);

  const { data: cars, isLoading: carsLoading } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: api.inventory.getCars,
  });

  const { data: destinations = [], isLoading: destinationsLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: api.catalog.getDestinations,
  });

  const saveCarMutation = useMutation({
    mutationFn: async (carData) => {
      let destId = carData.destination_id;

      // Fallback: use city to find or create destination
      if (!destId && carData.city) {
        const existing = destinations.find(
          (d) => d.name.toLowerCase() === carData.city.toLowerCase()
        );
        if (existing) {
          destId = existing.id;
        } else {
          const newDest = await api.catalog.createDestination({ name: carData.city });
          destId = newDest.id;
        }
      }

      // FormData for the car
      const formData = new FormData();
      formData.append("make", carData.make);
      formData.append("model", carData.model);
      formData.append("category", carData.category);
      formData.append("daily_rate", Number(carData.daily_rate));
      formData.append("currency", carData.currency);
      formData.append("description", carData.description);
      if (destId) formData.append("destination_id", destId);
      if (carImage) formData.append("carimage", carImage);

      return carData.id
        ? api.inventory.updateCar(carData.id, formData)
        : api.inventory.createCar(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cars"]);
      setNewCar({
        id: null,
        make: "",
        model: "",
        category: "",
        daily_rate: "",
        currency: "USD",
        description: "",
        city: "",
        destination_id: "",
      });
      setCarImage(null);
    },
  });

  const deleteCar = useMutation({
    mutationFn: (id) => api.inventory.deleteCar(id),
    onSuccess: () => queryClient.invalidateQueries(["admin-cars"]),
  });

  const handleEdit = (car) => {
    setNewCar({
      id: car.id,
      make: car.make,
      model: car.model,
      category: car.category || "",
      daily_rate: car.daily_rate,
      currency: car.currency,
      description: car.description,
      city: car.destination?.name || "",
      destination_id: car.destination?.id || "",
    });
    setCarImage(null);
  };

  if (carsLoading || destinationsLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Cars</h1>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to="/dashboard/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Admin Dashboard
        </Link>
        <Link
          to="/dashboard/admin/destinations"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          Manage Destinations
        </Link>
        <Link
          to="/dashboard/admin/hotels"
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition"
        >
          Manage Hotels
        </Link>
      </div>

      {/* Car Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveCarMutation.mutate(newCar);
        }}
        className="mb-6 grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <input
  type="text"
  placeholder="Driver Name"
  value={newCar.driver_name || ""}
  onChange={(e) => setNewCar({ ...newCar, driver_name: e.target.value })}
  className="border px-3 py-2 rounded"
/>

<input
  type="text"
  placeholder="Driver Contact"
  value={newCar.driver_contact || ""}
  onChange={(e) => setNewCar({ ...newCar, driver_contact: e.target.value })}
  className="border px-3 py-2 rounded"
/>
        <input
          type="text"
          placeholder="Make"
          value={newCar.make}
          onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={newCar.model}
          onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        {/* Category */}
        <select
          value={newCar.category}
          onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}
          className="border px-3 py-2 rounded col-span-2"
          required
        >
          <option value="">Select Category</option>
          <option value="Economy">Economy</option>
          <option value="Compact">Compact</option>
          <option value="SUV">SUV</option>
          <option value="Luxury">Luxury</option>
        </select>
        <input
          type="number"
          placeholder="Daily Rate"
          value={newCar.daily_rate}
          onChange={(e) => setNewCar({ ...newCar, daily_rate: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Currency"
          value={newCar.currency}
          onChange={(e) => setNewCar({ ...newCar, currency: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        {/* City */}
        <input
          type="text"
          placeholder="City"
          value={newCar.city}
          onChange={(e) => setNewCar({ ...newCar, city: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        {/* Destination */}
        <select
          value={newCar.destination_id}
          onChange={(e) => setNewCar({ ...newCar, destination_id: e.target.value })}
          className="border px-3 py-2 rounded col-span-2"
        >
          <option value="">Select Destination (optional)</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={newCar.description}
          onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
          className="border px-3 py-2 rounded col-span-2"
        />
        {/* Image Upload */}
        <label className="col-span-2 flex flex-col border rounded px-3 py-2 cursor-pointer text-gray-700">
          {carImage ? carImage.name : "Upload Car Image"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCarImage(e.target.files[0])}
            className="hidden"
          />
        </label>
        {carImage && (
          <img
            src={URL.createObjectURL(carImage)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded col-span-2"
          />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-2 hover:bg-blue-700 transition"
        >
          {newCar.id ? "Update Car" : "Add Car"}
        </button>
      </form>

      {/* Cars List */}
      <ul className="space-y-2">
     {cars?.map((car) => (
  <li key={car.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
    <div className="flex items-center gap-3">
      {car.image_url && (
        <img
          src={car.image_url}
          alt={`${car.make} ${car.model}`}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div>
        <p className="font-medium">{car.make} {car.model}</p>
        <p className="text-sm">{car.daily_rate} {car.currency}</p>
        <p className="text-xs text-gray-500">{car.description}</p>
        <p className="text-xs text-gray-400">
          Destination: {car.destination?.name || "N/A"}
        </p>
        <p className="text-xs text-gray-400">
          Category: {car.category || "N/A"}
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => handleEdit(car)}
        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
      >
        Edit
      </button>
      <button
        onClick={() => deleteCar.mutate(car.id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        Delete
      </button>
    </div>
  </li>
))}


      </ul>
    </div>
  );
};

export default ManageCarsPage;
