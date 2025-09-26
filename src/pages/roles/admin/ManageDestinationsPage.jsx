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
  const [isEditing, setIsEditing] = useState(false);

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
      resetForm();
    },
  });

  const deleteDestination = useMutation({
    mutationFn: (slug) => api.request(`/catalog/destinations/${slug}/`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(["admin-destinations"]),
  });

  const resetForm = () => {
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
    setIsEditing(false);
  };

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
    setIsEditing(true);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading destinations...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Manage Destinations</h1>
          <p className="text-xl text-blue-100">Add, edit, and manage travel destinations worldwide</p>
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
            to="/dashboard/admin/hotels"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🏨 Manage Hotels
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
          
          {/* Destination Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Destination" : "Add New Destination"}
              </h2>
              <span className="text-3xl">🌍</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveDestination.mutate(newDestination);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Destination Name"
                  value={newDestination.name}
                  onChange={handleNameChange}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newDestination.country}
                  onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newDestination.city}
                  onChange={(e) => setNewDestination({ ...newDestination, city: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={newDestination.short_description}
                  onChange={(e) => setNewDestination({ ...newDestination, short_description: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={newDestination.latitude}
                  onChange={(e) => setNewDestination({ ...newDestination, latitude: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={newDestination.longitude}
                  onChange={(e) => setNewDestination({ ...newDestination, longitude: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug (auto-generated)"
                  value={newDestination.slug}
                  onChange={(e) => setNewDestination({ ...newDestination, slug: e.target.value })}
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors md:col-span-2"
                />
              </div>

              <textarea
                placeholder="Full Description"
                value={newDestination.description}
                onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors w-full h-32"
                rows="5"
                required
              />

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors w-full">
                    <span className="text-2xl mb-2">📷</span>
                    <span className="text-gray-600">
                      {imageFile ? imageFile.name : "Click to upload cover image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                {imageFile && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saveDestination.isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 flex-1 disabled:opacity-50"
                >
                  {saveDestination.isLoading ? "Saving..." : (isEditing ? "Update Destination" : "Add Destination")}
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

          {/* Destinations List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Destinations</h2>
              <span className="text-2xl text-gray-500">{destinations?.length || 0} destinations</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {destinations?.map((dest) => (
                <div key={dest.slug} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200 border">
                  <div className="flex items-center gap-4">
                    {dest.cover_image_url && (
                      <img
                        src={dest.cover_image_url}
                        alt={dest.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{dest.name}</h3>
                          <p className="text-blue-600 font-semibold">
                            {dest.city}, {dest.country}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {dest.short_description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {dest.city}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {dest.country}
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              {dest.slug}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(dest)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteDestination.mutate(dest.slug)}
                            disabled={deleteDestination.isLoading}
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
              {(!destinations || destinations.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🌍</span>
                  <p>No destinations added yet. Start by adding your first destination!</p>
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
            <div className="text-3xl text-blue-600 mb-2">🌍</div>
            <h3 className="text-lg font-bold text-gray-900">Total Destinations</h3>
            <p className="text-3xl font-bold text-blue-600">{destinations?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl text-green-600 mb-2">🏙️</div>
            <h3 className="text-lg font-bold text-gray-900">Cities Covered</h3>
            <p className="text-3xl font-bold text-green-600">
              {new Set(destinations?.map(d => d.city)).size || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl text-purple-600 mb-2">🇺🇳</div>
            <h3 className="text-lg font-bold text-gray-900">Countries</h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(destinations?.map(d => d.country)).size || 0}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageDestinationsPage;