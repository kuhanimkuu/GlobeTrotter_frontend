import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';

const OrganizerDashboard = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination_id: '',
    duration_days: 1,
    base_price: '',
    description: ''
  });


  const { data: packages, isLoading } = useQuery({
    queryKey: ['organizer-packages'],
    queryFn: () => api.organizer.getPackages(token),
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (packageData) => api.organizer.createPackage(packageData, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['organizer-packages']);
      setShowCreateForm(false);
      setFormData({
        title: '',
        destination_id: '',
        duration_days: 1,
        base_price: '',
        description: ''
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          {showCreateForm ? 'Cancel' : 'Create New Package'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Tour Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Package Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Duration (days)"
              value={formData.duration_days}
              onChange={(e) => setFormData({...formData, duration_days: parseInt(e.target.value)})}
              className="border p-2 rounded"
              min="1"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Base Price"
              value={formData.base_price}
              onChange={(e) => setFormData({...formData, base_price: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Destination ID"
              value={formData.destination_id}
              onChange={(e) => setFormData({...formData, destination_id: e.target.value})}
              className="border p-2 rounded"
              required
            />
          </div>
          <textarea
            placeholder="Package Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="border p-2 rounded w-full mb-4"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createMutation.isLoading ? 'Creating...' : 'Create Package'}
          </button>
        </form>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Tour Packages</h2>
        {packages?.length === 0 ? (
          <p className="text-gray-500">No packages created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages?.map((pkg) => (
              <div key={pkg.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg">{pkg.title}</h3>
                <p className="text-gray-600">{pkg.duration_days} days</p>
                <p className="text-green-600 font-bold">${pkg.base_price}</p>
                <p className={`text-sm ${pkg.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;