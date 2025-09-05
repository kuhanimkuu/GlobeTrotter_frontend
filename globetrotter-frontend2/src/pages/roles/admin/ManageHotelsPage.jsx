import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { useState } from "react";

const HotelsPage = () => {
  const queryClient = useQueryClient();
  const [newHotel, setNewHotel] = useState({ name: "", location: "" });

  const { data: hotels, isLoading } = useQuery({
    queryKey: ["admin-hotels"],
    queryFn: api.inventory.getHotels,
  });

  const addHotel = useMutation({
    mutationFn: (hotelData) =>
      api.request("/inventory/hotels/", {
        method: "POST",
        body: JSON.stringify(hotelData),
      }),
    onSuccess: () => queryClient.invalidateQueries(["admin-hotels"]),
  });

  const deleteHotel = useMutation({
    mutationFn: (id) =>
      api.request(`/inventory/hotels/${id}/`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(["admin-hotels"]),
  });

  if (isLoading) return <p>Loading hotels...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Hotels</h1>

      {/* Add Hotel Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addHotel.mutate(newHotel);
          setNewHotel({ name: "", location: "" });
        }}
        className="mb-6 flex space-x-2"
      >
        <input
          type="text"
          placeholder="Hotel Name"
          value={newHotel.name}
          onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          className="border px-3 py-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Location"
          value={newHotel.location}
          onChange={(e) =>
            setNewHotel({ ...newHotel, location: e.target.value })
          }
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Hotel
        </button>
      </form>

      {/* Hotels List */}
      <ul className="space-y-2">
        {hotels?.map((hotel) => (
          <li
            key={hotel.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span>
              {hotel.name} – {hotel.location}
            </span>
            <button
              onClick={() => deleteHotel.mutate(hotel.id)}
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

export default HotelsPage;
