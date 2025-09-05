// src/pages/roles/organizer/ManageTourPackagesPage.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/useAuth";
import { api } from "../../../services/api";
import { useState } from "react";

const ManageTourPackagesPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [newPackage, setNewPackage] = useState({
    title: "",
    description: "",
    price: "",
    destination: "",
  });

  // Fetch tour packages
  const { data: packages, isLoading } = useQuery({
    queryKey: ["organizer-packages"],
    queryFn: () => api.catalog.getPackages(token),
    enabled: !!token,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.catalog.createPackage(data, token),
    onSuccess: () => queryClient.invalidateQueries(["organizer-packages"]),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.catalog.deletePackage(id, token),
    onSuccess: () => queryClient.invalidateQueries(["organizer-packages"]),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(newPackage);
    setNewPackage({ title: "", description: "", price: "", destination: "" });
  };

  if (isLoading) return <p>Loading packages...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tour Packages</h1>

      {/* Create new package */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={newPackage.title}
          onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={newPackage.description}
          onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newPackage.price}
          onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Destination ID"
          value={newPackage.destination}
          onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Package
        </button>
      </form>

      {/* List packages */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        {packages?.map((pkg) => (
          <div
            key={pkg.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{pkg.title}</p>
              <p className="text-sm text-gray-600">{pkg.destination?.name}</p>
              <p className="text-sm font-bold">${pkg.price}</p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(pkg.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTourPackagesPage;
