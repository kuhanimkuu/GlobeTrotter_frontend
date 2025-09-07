const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  // Core request handler
  async request(endpoint, options = {}) {
    let token = localStorage.getItem('token');
    const url = `${API_BASE}${endpoint}`;

    const headers = { ...options.headers };

    // Only set JSON Content-Type if body is NOT FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Attach Bearer token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, {
      headers,
      ...options,
    });

    // Handle expired token → auto refresh
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE}/users/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('token', data.access);

            // retry original request with new token
            headers['Authorization'] = `Bearer ${data.access}`;
            response = await fetch(url, { headers, ...options });
          } else {
            api.auth.logoutSession();
            throw new Error('Session expired. Please log in again.');
          }
        } catch (err) {
          api.auth.logoutSession();
          throw new Error('Authentication required');
        }
      } else {
        api.auth.logoutSession();
        throw new Error('Authentication required');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const text = await response.text().catch(() => '');
    return text ? JSON.parse(text) : {};
  },

  // Auth
  auth: {
    // 🔹 Login
    login: async (credentials) => {
      const data = await api.request('/users/auth/token/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.access) {
        localStorage.setItem('token', data.access);
        if (data.refresh) localStorage.setItem('refresh', data.refresh);
      }

      return data;
    },

    // 🔹 Register
    register: (userData) => api.request('/users/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

    // 🔹 Get logged-in profile
    getProfile: () => api.request('/users/auth/me/'),

    // 🔹 Refresh token manually
    refresh: async () => {
      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) throw new Error('No refresh token available');

      const data = await api.request('/users/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (data.access) {
        localStorage.setItem('token', data.access);
      }

      return data;
    },

    // 🔹 Logout
    logoutSession: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    },

    // 🔹 Admin: list all users
    listUsers: () => api.request('/users/list/'),
  },

  // Catalog
  catalog: {
    getPackages: () => api.request('/catalog/packages/'),
    getPackage: (id) => api.request(`/catalog/packages/${id}/`),
    getDestinations: () => api.request('/catalog/destinations/'),
    getDestination: (id) => api.request(`/catalog/destinations/${id}/`),

    createDestination: (payload) => api.request('/catalog/destinations/', {
  method: 'POST',
  body: payload instanceof FormData ? payload : JSON.stringify(payload),
}),

updateDestination: (id, payload) => api.request(`/catalog/destinations/${id}/`, {
  method: 'PUT',
  body: payload instanceof FormData ? payload : JSON.stringify(payload),
}),
    deleteDestination: (id) => api.request(`/catalog/destinations/${id}/`, { method: 'DELETE' }),

    createPackage: (payload) => api.request('/catalog/packages/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    updatePackage: (id, payload) => api.request(`/catalog/packages/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    deletePackage: (id) => api.request(`/catalog/packages/${id}/`, { method: 'DELETE' }),
  },
  getPackageImages: (packageId) => jsonRequest(`/catalog/package-images/?package=${packageId}`),
  addPackageImage: (payload) => uploadRequest('/catalog/package-images/', payload, 'POST'),
  updatePackageImage: (id, payload) => uploadRequest(`/catalog/package-images/${id}/`, payload, 'PUT'),
  deletePackageImage: (id) => jsonRequest(`/catalog/package-images/${id}/`, { method: 'DELETE' }),

  // Inventory
  // Inventory
inventory: {
  // Hotels
  getHotels: () => api.request('/inventory/hotels/'),
  getHotel: (id) => api.request(`/inventory/hotels/${id}/`),
  getRoomTypes: (hotelId) => api.request(`/inventory/hotels/${hotelId}/room-types/`),
  getCars: () => api.request('/inventory/cars/'),
  getCar: (id) => api.request(`/inventory/cars/${id}/`),

  createHotel: (payload) => api.request('/inventory/hotels/', {
    method: 'POST',
    body: payload, // can be FormData or JSON
  }),

  updateHotel: (id, payload) => api.request(`/inventory/hotels/${id}/`, {
    method: 'PUT',
    body: payload,
  }),

  deleteHotel: (id) => api.request(`/inventory/hotels/${id}/`, { method: 'DELETE' }),

  // Room Types
  createRoomType: (payload) => api.request('/inventory/room-types/', {
    method: 'POST',
    body: payload,
  }),

  updateRoomType: (id, payload) => api.request(`/inventory/room-types/${id}/`, {
    method: 'PUT',
    body: payload,
  }),

  deleteRoomType: (id) => api.request(`/inventory/room-types/${id}/`, { method: 'DELETE' }),

  // Cars
createCar: (payload) => api.request('/inventory/cars/', {
    method: 'POST',
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  }),

  updateCar: (id, payload) => api.request(`/inventory/cars/${id}/`, {
    method: 'PUT',
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  }),

  deleteCar: (id) => api.request(`/inventory/cars/${id}/`, { method: 'DELETE' }),
},

  // Booking
  booking: {
    create: (data) => api.request('/booking/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    list: () => api.request('/booking/bookings/'),
    listMine: (status = null) => {
      const params = status ? `?status=${status}` : '';
      return api.request(`/booking/bookings/mine/${params}`);
    },
    get: (id) => api.request(`/booking/bookings/${id}/`),
    cancel: (id) => api.request(`/booking/bookings/${id}/cancel/`, { method: 'POST' }),
  },

  // Payments
  payments: {
    create: (payload) => api.request('/payments/create/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    charge: (payload) => api.request('/payments/charge/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },

  // Reviews
 reviews: {
  list: ({ content_type, object_id } = {}) => {
    let query = '';
    if (content_type && object_id) {
      query = `?content_type=${content_type}&object_id=${object_id}`;
    }
    return api.request(`/reviews/reviews/${query}`);
  },
  create: (payload) => api.request('/reviews/reviews/', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
},

  // Flights
  flights: {
    search: (params) => api.request('/flights/search/', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    getOffers: (id) => api.request(`/flights/offers/${id}/`),
  },

  // Role-based shortcuts
  admin: {
    createDestination: (payload) => api.catalog.createDestination(payload),
    createHotel: (payload) => api.inventory.createHotel(payload),
    createCar: (payload) => api.inventory.createCar(payload),
    listUsers: () => api.auth.listUsers(),
  },
  organizer: {
    getPackages: () => api.catalog.getPackages(),
    createPackage: (payload) => api.catalog.createPackage(payload),
    updatePackage: (id, payload) => api.catalog.updatePackage(id, payload),
    deletePackage: (id) => api.catalog.deletePackage(id),
    getBookings: () => api.booking.list(),
  },
  customer: {
    myBookings: () => api.booking.listMine(),
    book: (payload) => api.booking.create(payload),
  },
};
