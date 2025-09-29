import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import TourPackageCard from "../../../components/TourPackageCards";
import TourPackageModal from "../../../components/TourPackageModal";

const ManageTourPackagesPage = () => {
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setModalOpen(false);
  };

  const [newPackage, setNewPackage] = useState({
    id: null,
    title: "",
    summary: "",
    description: "",
    start_date: "",
    end_date: "",
    duration_days: "",
    base_price: "",
    currency: "",
    inclusions: "",
    exclusions: "",
    policies: "",
    max_capacity: "",
    is_active: true,
    destination: "",
    hotel: "",
    car: "",
    commission: 0,
    nights: 1,
    car_days: 1,
  });

  const [mainImage, setMainImage] = useState(null);

  const { data: destinations = [], isLoading: loadingDestinations } = useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const response = await api.catalog.getDestinations();
      return Array.isArray(response) ? response : response?.results || [];
    },
  });

  const { data: hotels = [], isLoading: loadingHotels } = useQuery({
    queryKey: ["hotels", newPackage.destination],
    queryFn: async () => {
      try {
        if (!newPackage.destination) return [];
        const dest = destinations.find(
          (d) => String(d.id) === String(newPackage.destination)
        );
        if (!dest) return [];
        const response = await api.inventory.searchHotels({ city: dest.name });
        return Array.isArray(response) ? response : response?.results || [];
      } catch (err) {
        console.error("Error fetching hotels:", err);
        return [];
      }
    },
    enabled: !!newPackage.destination && destinations.length > 0,
  });

  const { data: cars = [], isLoading: loadingCars } = useQuery({
    queryKey: ["cars", newPackage.destination],
    queryFn: async () => {
      try {
        if (!newPackage.destination) return [];
        const dest = destinations.find(
          (d) => String(d.id) === String(newPackage.destination)
        );
        if (!dest) return [];
        const response = await api.inventory.searchCars({ country: dest.country });
        return Array.isArray(response) ? response : response?.results || [];
      } catch (err) {
        console.error("Error fetching cars:", err);
        return [];
      }
    },
    enabled: !!newPackage.destination && destinations.length > 0,
  });

  const { data: packages = [], isLoading: loadingPackages } = useQuery({
    queryKey: ["organizer-packages"],
    queryFn: () => api.organizer.getPackages(),
  });

  const saveMutation = useMutation({
    mutationFn: async (pkg) => {
      const formData = new FormData();
      for (const key in pkg) {
        const value = pkg[key];
        if (value === null || value === undefined) continue;
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
          continue;
        }
        if (key === "destination") {
          if (value) formData.append("destination_id", value);
          continue;
        }
        if (key === "hotel") {
          if (value) formData.append("hotel_id", value);
          continue;
        }
        if (key === "car") {
          if (value) formData.append("car_id", value);
          continue;
        }
        if (value === "") continue;
        formData.append(key, value);
      }
      if (mainImage) formData.append("main_image", mainImage);
      return pkg.id 
        ? await api.organizer.updatePackage(pkg.id, formData)
        : await api.organizer.createPackage(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-packages"] });
      setNewPackage({
        id: null,
        title: "",
        summary: "",
        description: "",
        start_date: "",
        end_date: "",
        duration_days: "",
        base_price: "",
        currency: "",
        inclusions: "",
        exclusions: "",
        highlights: "",
        policies: "",
        max_capacity: "",
        is_active: true,
        destination: "",
        hotel: "",
        car: "",
        commission: 0,
        nights: 1,
        car_days: 1,
      });
      setMainImage(null);
    },
    onError: (error) => {
      console.error("❌ Backend validation error:", error);
      if (error.data) {
        alert("Validation failed:\n" + JSON.stringify(error.data, null, 2));
      } else {
        alert("Unexpected error. Status: " + error.status);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(newPackage);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!id) throw new Error("Cannot delete package: ID is missing");
      return api.organizer.deletePackage(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organizer-packages"] }),
  });

  const handleEdit = (pkg) => {
    setNewPackage({
      id: pkg.id,
      title: pkg.title || "",
      summary: pkg.summary || "",
      description: pkg.description || "",
      start_date: pkg.start_date || "",
      end_date: pkg.end_date || "",
      duration_days: pkg.duration_days || "",
      base_price: pkg.base_price || "",
      currency: pkg.currency || "",
      inclusions: pkg.inclusions || "",
      exclusions: pkg.exclusions || "",
      highlights: pkg.highlights || "",
      policies: pkg.policies || "",
      max_capacity: pkg.max_capacity || "",
      is_active: pkg.is_active !== undefined ? pkg.is_active : true,
      destination: pkg.destination?.id || "",
      hotel: pkg.hotel?.id || "",
      car: pkg.car?.id || "",
      commission: pkg.commission || 0,
      nights: pkg.nights || 1,
      car_days: pkg.car_days || 1,
    });
    setMainImage(null);
  };

  useEffect(() => {
    if (newPackage.start_date && newPackage.end_date) {
      const start = new Date(newPackage.start_date);
      const end = new Date(newPackage.end_date);
      if (end < start) {
        setNewPackage((prev) => ({ ...prev, end_date: "" }));
        alert("⚠️ End date cannot be earlier than start date.");
        return;
      }
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setNewPackage((prev) => ({
        ...prev,
        duration_days: diffDays,
        nights: Math.max(diffDays - 1, 0),
      }));
    }
  }, [newPackage.start_date, newPackage.end_date]);

  useEffect(() => {
    if (newPackage.destination) {
      setNewPackage((prev) => ({ ...prev, hotel: "", car: "" }));
    }
  }, [newPackage.destination]);

  const totalPrice = useMemo(() => {
    const base = parseFloat(newPackage.base_price) || 0;
    const hotelObj = hotels.find((h) => String(h.id) === String(newPackage.hotel));
    let hotelPricePerNight = 0;
    if (hotelObj && Array.isArray(hotelObj.room_types) && hotelObj.room_types.length > 0) {
      hotelPricePerNight = parseFloat(hotelObj.room_types[0].base_price) || 0;
    }
    const hotelTotal = hotelPricePerNight * (parseInt(newPackage.nights || 1));
    const carObj = cars.find((c) => String(c.id) === String(newPackage.car));
    const carDaily = carObj ? parseFloat(carObj.daily_rate || 0) : 0;
    const carTotal = carDaily * (parseInt(newPackage.car_days || 1));
    const subtotal = base + hotelTotal + carTotal;
    const commissionAmount = (subtotal * (parseFloat(newPackage.commission || 0))) / 100;
    return subtotal + commissionAmount;
  }, [newPackage, hotels, cars]);

  if (loadingDestinations || loadingPackages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Manage Tour Packages
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create and manage your tour packages with ease. Add destinations, hotels, cars, and set pricing all in one place.
          </p>
        </div>

        {/* Create/Edit Package Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-transparent hover:border-yellow-400 transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {newPackage.id ? "Edit Package" : "Create New Package"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Package Title *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Maasai Mara Safari Adventure"
                  value={newPackage.title}
                  onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Summary
                </label>
                <input
                  id="summary"
                  type="text"
                  placeholder="Brief description of the package"
                  value={newPackage.summary}
                  onChange={(e) => setNewPackage({ ...newPackage, summary: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                id="description"
                placeholder="Describe the package in detail..."
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            {/* Dates & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  id="start_date"
                  type="date"
                  value={newPackage.start_date}
                  onChange={(e) => setNewPackage({ ...newPackage, start_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  id="end_date"
                  type="date"
                  value={newPackage.end_date}
                  min={newPackage.start_date || undefined}
                  onChange={(e) => setNewPackage({ ...newPackage, end_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  id="duration_days"
                  type="number"
                  value={newPackage.duration_days}
                  readOnly
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price *
                </label>
                <input
                  id="base_price"
                  type="number"
                  placeholder="0.00"
                  value={newPackage.base_price}
                  onChange={(e) => setNewPackage({ ...newPackage, base_price: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <input
                  id="currency"
                  type="text"
                  placeholder="USD"
                  value={newPackage.currency}
                  onChange={(e) => setNewPackage({ ...newPackage, currency: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-2">
                  Commission %
                </label>
                <input
                  id="commission"
                  type="number"
                  placeholder="0"
                  value={newPackage.commission}
                  onChange={(e) => setNewPackage({ ...newPackage, commission: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Total Price  */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-lg font-bold text-gray-900 text-center">
                Total Package Price: <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </p>
            </div>

            {/* Destination Selection */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <select
                id="destination"
                value={newPackage.destination}
                onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                <option value="">Select Destination</option>
                {destinations?.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} ({dest.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Hotel and Car Selection */}
            {newPackage.destination && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TourPackageCard
                  label="Hotel"
                  items={hotels}
                  selectedItem={hotels.find((h) => String(h.id) === String(newPackage.hotel))}
                  setSelectedItem={(item) => setNewPackage({ ...newPackage, hotel: item?.id || "" })}
                  itemType="hotel"
                />

                <TourPackageCard
                  label="Car"
                  items={cars}
                  selectedItem={cars.find((c) => String(c.id) === String(newPackage.car))}
                  setSelectedItem={(item) => setNewPackage({ ...newPackage, car: item?.id || "" })}
                  itemType="car"
                />
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Capacity
                </label>
                <input
                  id="max_capacity"
                  type="number"
                  value={newPackage.max_capacity}
                  onChange={(e) => setNewPackage({ ...newPackage, max_capacity: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={!!newPackage.is_active}
                    onChange={(e) => setNewPackage({ ...newPackage, is_active: e.target.checked })}
                    className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active Package
                  </label>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
                <textarea
                  value={newPackage.inclusions}
                  onChange={(e) => setNewPackage({ ...newPackage, inclusions: e.target.value })}
                  placeholder="What's included in the package..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
                <textarea
                  value={newPackage.exclusions}
                  onChange={(e) => setNewPackage({ ...newPackage, exclusions: e.target.value })}
                  placeholder="What's not included in the package..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policies</label>
                <textarea
                  value={newPackage.policies}
                  onChange={(e) => setNewPackage({ ...newPackage, policies: e.target.value })}
                  placeholder="Package policies and terms..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
                Package Image
              </label>
              <input
                id="mainImage"
                type="file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saveMutation.isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg flex-1"
              >
                {saveMutation.isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    {newPackage.id ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  newPackage.id ? "Update Package" : "Create Package"
                )}
              </button>

              {newPackage.id && (
                <button
                  type="button"
                  onClick={() => setNewPackage({
                    id: null,
                    title: "",
                    summary: "",
                    description: "",
                    start_date: "",
                    end_date: "",
                    duration_days: "",
                    base_price: "",
                    currency: "",
                    inclusions: "",
                    exclusions: "",
                    highlights: "",
                    policies: "",
                    max_capacity: "",
                    is_active: true,
                    destination: "",
                    hotel: "",
                    car: "",
                    commission: 0,
                    nights: 1,
                    car_days: 1,
                  })}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Packages List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Tour Packages</h2>
          
          {loadingPackages ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading packages...</p>
            </div>
          ) : packages?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages yet</h3>
              <p className="text-gray-600">Create your first tour package to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {packages?.map((pkg) => (
                <div key={pkg.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-transparent hover:border-yellow-400 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Package Image */}
                    <div className="flex-shrink-0">
                      {(pkg.main_image_url || pkg.main_image) ? (
                        <img 
                          src={pkg.main_image_url || pkg.main_image} 
                          alt={pkg.title}
                          className="w-32 h-32 object-cover rounded-xl shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">🌴</span>
                        </div>
                      )}
                    </div>

                    {/* Package Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          pkg.is_active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {pkg.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{pkg.summary}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-semibold">Destination:</span>
                          <p className="text-gray-600">{pkg.destination?.name || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Duration:</span>
                          <p className="text-gray-600">{pkg.duration_days} days</p>
                        </div>
                        <div>
                          <span className="font-semibold">Capacity:</span>
                          <p className="text-gray-600">{pkg.max_capacity || "Unlimited"}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Price:</span>
                          <p className="text-blue-600 font-bold">${pkg.total_price || "0.00"}</p>
                        </div>
                      </div>

                      {/* Hotel & Car Info */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        {pkg.hotel?.name && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            🏨 {pkg.hotel.name}
                          </span>
                        )}
                        {pkg.car?.make && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            🚗 {pkg.car.make} {pkg.car.model}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(pkg.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openModal(pkg)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedPackage && (
        <TourPackageModal
          isOpen={modalOpen}
          onClose={closeModal}
          packageData={selectedPackage}
        />
      )}
    </div>
  );
};

export default ManageTourPackagesPage;