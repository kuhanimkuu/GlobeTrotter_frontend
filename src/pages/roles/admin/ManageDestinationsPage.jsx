import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../../services/api";
import { Link } from "react-router-dom";

const ManageDestinationsPage = () => {
  const queryClient = useQueryClient();
  const [newDestination, setNewDestination] = useState({
    id: null,
    name: "",
    country: "",
    city: "",
    short_description: "",
    description: "",
    latitude: "",
    longitude: "",
    slug: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const { data: destinations, isLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: api.catalog.getDestinations,
  });

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[\s\W-]+/g, "-");

  const handleNameChange = (e) => {
    const name = e.target.value;
    const autoSlug = generateSlug(name);

    setNewDestination((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug === "" || prev.slug === generateSlug(prev.name)
          ? autoSlug
          : prev.slug,
    }));
  };

  const saveDestination = useMutation({
     mutationFn: (dest) => {
    const formData = new FormData();
    formData.append("name", dest.name);
    formData.append("country", dest.country);
    formData.append("city", dest.city);
    formData.append("short_description", dest.short_description);
    formData.append("description", dest.description);
    formData.append("latitude", parseFloat(dest.latitude) || 0);
    formData.append("longitude", parseFloat(dest.longitude) || 0);
    formData.append("slug", dest.slug);
    if (imageFile) formData.append("cover_image", imageFile);

    return dest.id
      ? api.catalog.updateDestination(dest.slug, formData)
      : api.catalog.createDestination(formData);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["admin-destinations"]);
    setNewDestination({
      id: null,
      name: "",
      country: "",
      city: "",
      short_description: "",
      description: "",
      latitude: "",
      longitude: "",
      slug: "",
    });
    setImageFile(null);
  },
});

  const deleteDestination = useMutation({
    mutationFn: (slug) => api.request(`/catalog/destinations/${slug}/`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(["admin-destinations"]),
  });

  const handleEdit = (dest) => {
    setNewDestination({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      city: dest.city,
      short_description: dest.short_description,
      description: dest.description,
      latitude: dest.latitude,
      longitude: dest.longitude,
      slug: dest.slug,
    });
    setImageFile(null);
  };

  if (isLoading) return <p>Loading destinations...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Destinations</h1>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to="/dashboard/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Admin Dashboard
        </Link>
        <Link
          to="/dashboard/admin/hotels"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          Manage Hotels
        </Link>
        <Link
          to="/dashboard/admin/cars"
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition"
        >
          Manage Cars
        </Link>
      </div>

      {/* Add / Edit Destination Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveDestination.mutate(newDestination);
        }}
        className="mb-6 grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Destination Name"
          value={newDestination.name}
          onChange={handleNameChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={newDestination.country}
          onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={newDestination.city}
          onChange={(e) => setNewDestination({ ...newDestination, city: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Short Description"
          value={newDestination.short_description}
          onChange={(e) => setNewDestination({ ...newDestination, short_description: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Latitude"
          value={newDestination.latitude}
          onChange={(e) => setNewDestination({ ...newDestination, latitude: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Longitude"
          value={newDestination.longitude}
          onChange={(e) => setNewDestination({ ...newDestination, longitude: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Slug (optional, auto-generated)"
          value={newDestination.slug}
          onChange={(e) => setNewDestination({ ...newDestination, slug: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={newDestination.description}
          onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
          className="border px-3 py-2 rounded col-span-2"
        />

        {/* Image Upload */}
        <div className="col-span-2">
          <label className="flex flex-col border px-3 py-2 rounded cursor-pointer text-gray-600 hover:bg-gray-100">
            {imageFile ? imageFile.name : "Select an image..."}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-2 hover:bg-blue-700 transition"
        >
          {newDestination.id ? "Update Destination" : "Add Destination"}
        </button>
      </form>

      {/* Destinations List */}
      <ul className="space-y-2">
        {destinations?.map((dest) => (
          <li key={dest.slug} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <div className="flex items-center gap-3">
              {dest.cover_image_url && (
                <img src={dest.cover_image_url} alt={dest.name} className="w-16 h-16 object-cover rounded" />
              )}
              <span>{dest.name} – {dest.country}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(dest)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteDestination.mutate(dest.slug)}
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

export default ManageDestinationsPage;
