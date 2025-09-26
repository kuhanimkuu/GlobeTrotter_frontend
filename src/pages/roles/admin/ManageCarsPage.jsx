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
    driver_name: "",
    driver_contact: "",
  });

  const [carImage, setCarImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

      const formData = new FormData();
      formData.append("make", carData.make);
      formData.append("model", carData.model);
      formData.append("category", carData.category);
      formData.append("daily_rate", carData.daily_rate);
      formData.append("currency", carData.currency);
      formData.append("description", carData.description);
      if (destId) formData.append("destination_id", destId);
      if (carImage) formData.append("carimage", carImage);
      if (carData.driver_name) formData.append("driver_name", carData.driver_name);
      if (carData.driver_contact) formData.append("driver_contact", carData.driver_contact);

      return carData.id
        ? api.inventory.updateCar(carData.id, formData)
        : api.inventory.createCar(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cars"]);
      resetForm();
    },
  });

  const deleteCarMutation = useMutation({
    mutationFn: (carId) => api.inventory.deleteCar(carId),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cars"]);
    },
  });

  const resetForm = () => {
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
      driver_name: "",
      driver_contact: "",
    });
    setCarImage(null);
    setIsEditing(false);
  };

  const handleEdit = (car) => {
    setNewCar({
      id: car.id,
      make: car.make,
      model: car.model,
      category: car.category,
      daily_rate: car.daily_rate,
      currency: car.currency,
      description: car.description,
      city: car.destination?.name || "",
      destination_id: car.destination_id,
      driver_name: car.driver_name || "",
      driver_contact: car.driver_contact || "",
    });
    setIsEditing(true);
  };

  if (carsLoading || destinationsLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading car data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Manage Cars</h1>
          <p className="text-xl text-blue-100">Add, edit, and manage your car rental inventory</p>
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
            to="/dashboard/admin/hotels"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🏨 Manage Hotels
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Car Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Car" : "Add New Car"}
              </h2>
              <span className="text-3xl">🚗</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCarMutation.mutate(newCar);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Driver Name"
                  value={newCar.driver_name}
                  onChange={(e) => setNewCar({ ...newCar, driver_name: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />

                <input
                  type="text"
                  placeholder="Driver Contact"
                  value={newCar.driver_contact}
                  onChange={(e) => setNewCar({ ...newCar, driver_contact: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />

                <input
                  type="text"
                  placeholder="Make"
                  value={newCar.make}
                  onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />

                <input
                  type="text"
                  placeholder="Model"
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />

                <select
                  value={newCar.category}
                  onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />

                <input
                  type="text"
                  placeholder="Currency"
                  value={newCar.currency}
                  onChange={(e) => setNewCar({ ...newCar, currency: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />

                <input
                  type="text"
                  placeholder="City"
                  value={newCar.city}
                  onChange={(e) => setNewCar({ ...newCar, city: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />

                <select
                  value={newCar.destination_id}
                  onChange={(e) => setNewCar({ ...newCar, destination_id: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select Destination (optional)</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Description"
                value={newCar.description}
                onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors w-full h-24"
                rows="4"
              />

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Car Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors w-full">
                    <span className="text-2xl mb-2">📷</span>
                    <span className="text-gray-600">
                      {carImage ? carImage.name : "Click to upload car image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCarImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                {carImage && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(carImage)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saveCarMutation.isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 flex-1 disabled:opacity-50"
                >
                  {saveCarMutation.isLoading ? "Saving..." : (isEditing ? "Update Car" : "Add Car")}
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

          {/* Cars List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Car Inventory</h2>
              <span className="text-2xl text-gray-500">{cars?.length || 0} cars</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cars?.map((car) => (
                <div key={car.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200 border">
                  <div className="flex items-center gap-4">
                    {car.image_url && (
                      <img
                        src={car.image_url}
                        alt={`${car.make} ${car.model}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {car.make} {car.model}
                          </h3>
                          <p className="text-blue-600 font-semibold">
                            {car.daily_rate} {car.currency}/day
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{car.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {car.category}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {car.destination?.name || "No destination"}
                            </span>
                            {car.driver_name && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                Driver: {car.driver_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(car)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCarMutation.mutate(car.id)}
                            disabled={deleteCarMutation.isLoading}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!cars || cars.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🚗</span>
                  <p>No cars added yet. Start by adding your first car!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageCarsPage;