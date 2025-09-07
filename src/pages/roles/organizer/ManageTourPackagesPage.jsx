import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";

const ManageTourPackagesPage = () => {
  const queryClient = useQueryClient();

  const [newPackage, setNewPackage] = useState({
    id: null,
    title: "",
    description: "",
    base_price: "",
    destination: "",
    hotel: "",
    car: "",
    flight: "",
  });
  const [mainImage, setMainImage] = useState(null);

  const [openHotelDropdown, setOpenHotelDropdown] = useState(false);
  const [openCarDropdown, setOpenCarDropdown] = useState(false);
  const [openFlightDropdown, setOpenFlightDropdown] = useState(false);

  const { data: destinations, isLoading: loadingDestinations } = useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const response = await api.catalog.getDestinations();
      return response.data || response.results || [];
    },
  });

  const { data: hotels } = useQuery({
    queryKey: ["hotels", newPackage.destination],
    queryFn: () => api.getHotels(newPackage.destination),
    enabled: !!newPackage.destination,
  });

  const { data: cars } = useQuery({
    queryKey: ["cars", newPackage.destination],
    queryFn: () => api.getCars(newPackage.destination),
    enabled: !!newPackage.destination,
  });

  const { data: flights } = useQuery({
    queryKey: ["flights", newPackage.destination],
    queryFn: () => api.getFlights(newPackage.destination),
    enabled: !!newPackage.destination,
  });

  const { data: packages, isLoading: loadingPackages } = useQuery({
    queryKey: ["organizer-packages"],
    queryFn: () => api.organizer.getPackages(),
  });

  const saveMutation = useMutation({
    mutationFn: (pkg) => {
      const formData = new FormData();
      for (const key in pkg) formData.append(key, pkg[key]);
      if (mainImage) formData.append("main_image", mainImage);
      return pkg.id
        ? api.organizer.updatePackage(pkg.id, formData)
        : api.organizer.createPackage(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-packages"] });
      setNewPackage({
        id: null,
        title: "",
        description: "",
        base_price: "",
        destination: "",
        hotel: "",
        car: "",
        flight: "",
      });
      setMainImage(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.organizer.deletePackage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organizer-packages"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(newPackage);
  };

  const handleEdit = (pkg) => {
    setNewPackage({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      base_price: pkg.base_price,
      destination: pkg.destination?.id || "",
      hotel: pkg.hotel?.id || "",
      car: pkg.car?.id || "",
      flight: pkg.flight?.id || "",
    });
    setMainImage(null);
  };

  useEffect(() => {
    if (newPackage.destination) {
      setNewPackage({ ...newPackage, hotel: "", car: "", flight: "" });
    }
  }, [newPackage.destination]);

  if (loadingDestinations || loadingPackages) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tour Packages</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={newPackage.title}
          onChange={(e) =>
            setNewPackage({ ...newPackage, title: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={newPackage.description}
          onChange={(e) =>
            setNewPackage({ ...newPackage, description: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Base Price"
          value={newPackage.base_price}
          onChange={(e) =>
            setNewPackage({ ...newPackage, base_price: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          required
        />

        {/* Destination */}
        <select
          value={newPackage.destination}
          onChange={(e) =>
            setNewPackage({ ...newPackage, destination: e.target.value })
          }
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

        {/* Hotel Dropdown with image previews */}
        {hotels?.length > 0 && (
          <div className="relative">
            <div
              className="border rounded px-3 py-2 cursor-pointer flex justify-between items-center"
              onClick={() => setOpenHotelDropdown(!openHotelDropdown)}
            >
              {newPackage.hotel
                ? hotels.find((h) => h.id === newPackage.hotel)?.name
                : "Select Hotel"}
              <span>▼</span>
            </div>
            {openHotelDropdown && (
              <div className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNewPackage({ ...newPackage, hotel: hotel.id });
                      setOpenHotelDropdown(false);
                    }}
                  >
                    {hotel.main_image && (
                      <img
                        src={hotel.main_image}
                        alt={hotel.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span>{hotel.name} ({hotel.rooms_available} rooms)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Car Dropdown */}
        {cars?.length > 0 && (
          <div className="relative">
            <div
              className="border rounded px-3 py-2 cursor-pointer flex justify-between items-center"
              onClick={() => setOpenCarDropdown(!openCarDropdown)}
            >
              {newPackage.car
                ? `${cars.find((c) => c.id === newPackage.car)?.make} ${cars.find((c) => c.id === newPackage.car)?.model}`
                : "Select Car"}
              <span>▼</span>
            </div>
            {openCarDropdown && (
              <div className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNewPackage({ ...newPackage, car: car.id });
                      setOpenCarDropdown(false);
                    }}
                  >
                    {car.main_image && (
                      <img
                        src={car.main_image}
                        alt={`${car.make} ${car.model}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span>
                      {car.make} {car.model} – {car.available_quantity} available
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Flight Dropdown */}
        {flights?.length > 0 && (
          <div className="relative">
            <div
              className="border rounded px-3 py-2 cursor-pointer flex justify-between items-center"
              onClick={() => setOpenFlightDropdown(!openFlightDropdown)}
            >
              {newPackage.flight
                ? `${flights.find((f) => f.id === newPackage.flight)?.airline} ${flights.find((f) => f.id === newPackage.flight)?.flight_number}`
                : "Select Flight"}
              <span>▼</span>
            </div>
            {openFlightDropdown && (
              <div className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                {flights.map((flight) => (
                  <div
                    key={flight.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNewPackage({ ...newPackage, flight: flight.id });
                      setOpenFlightDropdown(false);
                    }}
                  >
                    {flight.main_image && (
                      <img
                        src={flight.main_image}
                        alt={`${flight.airline} ${flight.flight_number}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span>
                      {flight.airline} {flight.flight_number} – ${flight.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMainImage(e.target.files[0])}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={saveMutation.isLoading}
        >
          {newPackage.id ? "Update Package" : "Create Package"}
        </button>
      </form>
            {/* Existing packages list */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        {packages?.map((pkg) => (
          <div
            key={pkg.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex items-center gap-3">
              {pkg.main_image && (
                <img
                  src={pkg.main_image}
                  alt={pkg.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{pkg.title}</p>
                <p className="text-sm text-gray-600">{pkg.destination?.name}</p>
                <p className="text-sm font-bold">${pkg.base_price}</p>
                <p className="text-xs text-gray-500">
                  Hotel: {pkg.hotel?.name || "None"}, Car: {pkg.car?.make || "None"}{" "}
                  {pkg.car?.model || ""}, Flight: {pkg.flight?.flight_number || "None"}
                </p>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTourPackagesPage;
