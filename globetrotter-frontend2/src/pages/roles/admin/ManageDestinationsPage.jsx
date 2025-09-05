import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {api} from "../../../services/api";
const DestinationsPage = () => {
  const queryClient = useQueryClient();
  const [newDestination, setNewDestination] = useState({ name: "", country: "" });

  const { data: destinations, isLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: api.catalog.getDestinations,
  });

  const addDestination = useMutation({
    mutationFn: (destinationData) =>
      api.request("/catalog/destinations/", {
        method: "POST",
        body: JSON.stringify(destinationData),
      }),
    onSuccess: () => queryClient.invalidateQueries(["admin-destinations"]),
  });

  const deleteDestination = useMutation({
    mutationFn: (id) =>
      api.request(`/catalog/destinations/${id}/`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(["admin-destinations"]),
  });

  if (isLoading) return <p>Loading destinations...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Destinations</h1>

      {/* Add Destination Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addDestination.mutate(newDestination);
          setNewDestination({ name: "", country: "" });
        }}
        className="mb-6 flex space-x-2"
      >
        <input
          type="text"
          placeholder="Destination Name"
          value={newDestination.name}
          onChange={(e) =>
            setNewDestination({ ...newDestination, name: e.target.value })
          }
          className="border px-3 py-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Country"
          value={newDestination.country}
          onChange={(e) =>
            setNewDestination({ ...newDestination, country: e.target.value })
          }
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Destination
        </button>
      </form>

      {/* Destinations List */}
      <ul className="space-y-2">
        {destinations?.map((dest) => (
          <li
            key={dest.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span>
              {dest.name} – {dest.country}
            </span>
            <button
              onClick={() => deleteDestination.mutate(dest.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DestinationsPage;
