import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { useState } from "react";

const CarsPage = () => {
  const queryClient = useQueryClient();
  const [newCar, setNewCar] = useState({ name: "", model: "" });

  const { data: cars, isLoading } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: api.inventory.getCars,
  });

  const addCar = useMutation({
    mutationFn: (carData) =>
      api.request("/inventory/cars/", {
        method: "POST",
        body: JSON.stringify(carData),
      }),
    onSuccess: () => queryClient.invalidateQueries(["admin-cars"]),
  });

  const deleteCar = useMutation({
    mutationFn: (id) =>
      api.request(`/inventory/cars/${id}/`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(["admin-cars"]),
  });

  if (isLoading) return <p>Loading cars...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Cars</h1>

      {/* Add Car Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCar.mutate(newCar);
          setNewCar({ name: "", model: "" });
        }}
        className="mb-6 flex space-x-2"
      >
        <input
          type="text"
          placeholder="Name"
          value={newCar.name}
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
          className="border px-3 py-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Model"
          value={newCar.model}
          onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Car
        </button>
      </form>

      {/* Cars List */}
      <ul className="space-y-2">
        {cars?.map((car) => (
          <li
            key={car.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span>
              {car.name} – {car.model}
            </span>
            <button
              onClick={() => deleteCar.mutate(car.id)}
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

export default CarsPage;
