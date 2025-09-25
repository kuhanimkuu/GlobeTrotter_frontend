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
  const [openHotelDropdown, setOpenHotelDropdown] = useState(false);
  const [openCarDropdown, setOpenCarDropdown] = useState(false);

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
        const hotelsData = Array.isArray(response) ? response : response?.results || [];

        return hotelsData;
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
        const carsData = Array.isArray(response) ? response : response?.results || [];

        return carsData;
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
    let response;
    if (pkg.id) {
      response = await api.organizer.updatePackage(pkg.id, formData);
    } else {
      response = await api.organizer.createPackage(formData);
    }
    return response; 
  },

  onSuccess: (data) => {
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
    const diffTime = end - start;

    if (diffTime >= 0) {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      setNewPackage((prev) => ({
        ...prev,
        duration_days: diffDays,
        nights: Math.max(diffDays - 1, 0),
      }));
    } else {
      setNewPackage((prev) => ({ ...prev, duration_days: "", nights: "" }));
    }
  }
}, [newPackage.start_date, newPackage.end_date]);
 
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

  if (loadingDestinations || loadingPackages) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tour Packages</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={newPackage.title}
            onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <input
            id="summary"
            type="text"
            placeholder="Short summary"
            value={newPackage.summary}
            onChange={(e) => setNewPackage({ ...newPackage, summary: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description"
            value={newPackage.description}
            onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Dates & Duration */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              id="start_date"
              type="date"
              value={newPackage.start_date}
              onChange={(e) => setNewPackage({ ...newPackage, start_date: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
           <input
  id="end_date"
  type="date"
  value={newPackage.end_date}
  min={newPackage.start_date || undefined}   
  onChange={(e) => setNewPackage({ ...newPackage, end_date: e.target.value })}
  className="w-full border rounded px-3 py-2"
/>
          </div>
        </div>

        <div>
          <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-1">
    Duration (days)
  </label>
  <input
    id="duration_days"
    type="number"
    value={newPackage.duration_days}
    readOnly
    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
  />
        </div>

        {/* Base Price & Currency */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
            <input
              id="base_price"
              type="number"
              placeholder="Base Price"
              value={newPackage.base_price}
             onChange={(e) => setNewPackage({ ...newPackage, base_price: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="w-40">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              id="currency"
              type="text"
              placeholder="USD"
              value={newPackage.currency}
              onChange={(e) => setNewPackage({ ...newPackage, currency: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Inclusions / Exclusions / Highlights / Policies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions</label>
          <textarea
            value={newPackage.inclusions}
            onChange={(e) => setNewPackage({ ...newPackage, inclusions: e.target.value })}
            className="w-full border rounded px-3 py-2 mb-2"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions</label>
          <textarea
            value={newPackage.exclusions}
            onChange={(e) => setNewPackage({ ...newPackage, exclusions: e.target.value })}
            className="w-full border rounded px-3 py-2 mb-2"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
          <textarea
            value={newPackage.highlights}
            onChange={(e) => setNewPackage({ ...newPackage, highlights: e.target.value })}
            className="w-full border rounded px-3 py-2 mb-2"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Policies</label>
          <textarea
            value={newPackage.policies}
            onChange={(e) => setNewPackage({ ...newPackage, policies: e.target.value })}
            className="w-full border rounded px-3 py-2 mb-2"
          />
        </div>

        {/* Max capacity & Active */}
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
            <input
              type="number"
              value={newPackage.max_capacity}
              onChange={(e) => setNewPackage({ ...newPackage, max_capacity: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              checked={!!newPackage.is_active}
              onChange={(e) => setNewPackage({ ...newPackage, is_active: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="is_active" className="text-sm">Active</label>
          </div>
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <select
            id="destination"
            value={newPackage.destination}
            onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
            className="w-full border rounded px-3 py-2"
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

        {/* Hotel card */}
        {newPackage.destination && (
          <TourPackageCard
            label="Hotel"
            items={hotels}
            selectedItem={hotels.find((h) => String(h.id) === String(newPackage.hotel))}
            setSelectedItem={(item) => setNewPackage({ ...newPackage, hotel: item?.id || "" })}
            itemType="hotel"
          />
        )}

        {/* Car card */}
        {newPackage.destination && (
          <TourPackageCard
            label="Car"
            items={cars}
            selectedItem={cars.find((c) => String(c.id) === String(newPackage.car))}
            setSelectedItem={(item) => setNewPackage({ ...newPackage, car: item?.id || "" })}
            itemType="car"
          />
        )}

        {/* Commission, Nights, Car Days */}
        <div className="flex gap-2">
          <div className="w-1/3">
            <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-1">Commission %</label>
            <input
              id="commission"
              type="number"
              placeholder="Commission %"
              value={newPackage.commission}
              onChange={(e) => setNewPackage({ ...newPackage, commission: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="w-1/3">
             <label htmlFor="nights" className="block text-sm font-medium text-gray-700 mb-1">
    Nights
  </label>
  <input
    id="nights"
    type="number"
    value={newPackage.nights}
    readOnly
    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
  />
          </div>
          <div className="w-1/3">
            <label htmlFor="car_days" className="block text-sm font-medium text-gray-700 mb-1">Car Days</label>
            <input
              id="car_days"
              type="number"
              placeholder="Car Days"
              value={newPackage.car_days}
              onChange={(e) => setNewPackage({ ...newPackage, car_days: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            id="mainImage"
            type="file"
            accept="image/*"
            onChange={(e) => setMainImage(e.target.files[0])}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Total Price */}
        <p className="font-bold">Total Price: ${totalPrice.toFixed(2)}</p>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={saveMutation.isLoading}
          >
            {newPackage.id ? "Update Package" : "Create Package"}
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
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Existing packages list */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        {loadingPackages ? (
          <p>Loading packages...</p>
        ) : (
          packages?.map((pkg) => (
            <div key={pkg.id} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-3">
                {(pkg.main_image_url || pkg.main_image) && (
                  <img src={pkg.main_image_url || pkg.main_image} alt={pkg.title} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium">{pkg.title}</p>
                  <p className="text-sm text-gray-600">{pkg.destination?.name}</p>
                  <p className="text-sm font-bold">Total: ${pkg.total_price}</p>
                  <p className="text-xs text-gray-500">
                    Hotel: {pkg.hotel?.name || "None"}, Car: {pkg.car?.make || "None"} {pkg.car?.model || ""}
                  </p>
                  {pkg.duration_days && <p className="text-sm">Duration: {pkg.duration_days} days</p>}
                  {pkg.max_capacity && <p className="text-sm">Capacity: {pkg.max_capacity}</p>}
                  <p className="text-xs text-gray-500">{pkg.is_active ? "Active" : "Inactive"}</p>

                  {/* Images previews */}
                  {pkg.images?.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {pkg.images.map((img) => (
                        <img key={img.id} src={img.image_url} alt={img.caption} className="w-10 h-10 rounded object-cover" />
                      ))}
                    </div>
                  )}

                  {/* Inclusions / Exclusions */}
                  {pkg.inclusions && <p className="text-xs text-green-600 mt-1">✅ {pkg.inclusions}</p>}
                  {pkg.exclusions && <p className="text-xs text-red-600">❌ {pkg.exclusions}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(pkg.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => openModal(pkg)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                  View Details
              </button>
              </div>
            </div>
          ))
        )}
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
