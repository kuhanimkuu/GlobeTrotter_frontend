const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  
  async request(endpoint, options = {}) {
    let token = localStorage.getItem('token');
    const url = `${API_BASE}${endpoint}`;

    const headers = { ...options.headers };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, {
      headers,
      ...options,
    });

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
       console.error("Booking API error:", errorData);
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const text = await response.text().catch(() => '');
    return text ? JSON.parse(text) : {};
  },

  // Auth
  auth: {
    //  Login
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

    //  Register
    register: (userData) => api.request('/users/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

    //  Get logged-in profile
    getProfile: () => api.request('/users/auth/me/'),

    //  Refresh token manually
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

    //  Logout
    logoutSession: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    },

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

    createPackage: (payload) =>
      api.request('/catalog/packages/', {
        method: 'POST',
        body: payload instanceof FormData ? payload : JSON.stringify(payload),
      }),

    updatePackage: (id, payload) =>
      api.request(`/catalog/packages/${id}/`, {
        method: 'PUT',
        body: payload instanceof FormData ? payload : JSON.stringify(payload),
      }),

    deletePackage: (id, payload = null) =>
      api.request(`/catalog/packages/${id}/`, {
        method: 'DELETE',
        body: payload
          ? payload instanceof FormData
            ? payload
            : JSON.stringify(payload)
          : undefined,
      }),
  },
  getPackageImages: (packageId) => jsonRequest(`/catalog/package-images/?package=${packageId}`),
  addPackageImage: (payload) => uploadRequest('/catalog/package-images/', payload, 'POST'),
  updatePackageImage: (id, payload) => uploadRequest(`/catalog/package-images/${id}/`, payload, 'PUT'),
  deletePackageImage: (id) => jsonRequest(`/catalog/package-images/${id}/`, { method: 'DELETE' }),

  // Inventory
  inventory: {
    // Hotels
    getHotels: () => api.request('/inventory/hotels/'),
    getHotel: (id) => api.request(`/inventory/hotels/${id}/`),
    searchHotels: (filters) =>
      api.request('/inventory/hotels/search/', {
        method: 'POST',
        body: JSON.stringify(filters),
      }),

    getRoomTypes: (hotelId) => api.request(`/inventory/hotels/${hotelId}/room-types/`),
    getCars: () => api.request('/inventory/cars/'),
    getCar: (id) => api.request(`/inventory/cars/${id}/`),
    searchCars: (filters) =>
      api.request('/inventory/cars/search/', {
        method: 'POST',
        body: JSON.stringify(filters),
      }),
    createHotel: (payload) => api.request('/inventory/hotels/', {
      method: 'POST',
      body: payload, 
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
  // Generic booking 
  create: (data) => api.request('/booking/bookings/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Individual bookings
  flight: (data) => api.request('/booking/bookings/flight/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  hotel: (data) => api.request('/booking/bookings/hotel/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  car: (data) => api.request('/booking/bookings/car/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // List all bookings
  list: () => api.request('/booking/bookings/'),

  // List current user's bookings 
  listMine: (status = null) => {
    const params = status ? `?status=${status}` : '';
    return api.request(`/booking/bookings/mine/${params}`);
  },

  // Get booking by ID
  get: (id) => api.request(`/booking/bookings/${id}/`),

  // Cancel booking by ID
  cancel: (id) => api.request(`/booking/bookings/${id}/cancel/`, { method: 'POST' }),
  allFlights: () => api.request('/booking/flight-search/', {
    method: 'GET',
  }),


},

  // Payments
payments: {
  // Create a payment
  create: (payload) => api.request('/payments/payments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Direct charge 
  charge: (payload) => api.request('/payments/payments/charge/', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Refund request
  refundRequest: (paymentId, payload) => api.request(`/payments/payments/${paymentId}/refund-request/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  refundAction: (refundId, action) => api.request(`/payments/refunds/${refundId}/${action}/`, {
    method: 'PUT',
  }),
},

  // Reviews
  reviews: {
    list: async ({ content_type, object_id } = {}) => {
      let query = '';
      if (content_type && object_id) {
        const ct = content_type.includes('.') ? content_type : `inventory.${content_type}`;
        query = `?content_type=${ct}&object_id=${object_id}`;
      }

      const response = await api.request(`/reviews/reviews/${query}`);
      console.log(">>> API reviews response:", response);
      const approved = response.filter(r => r.is_approved);
      console.log(">>> Approved reviews only:", approved);

      return approved;
    },

    create: async (payload) => {
      const ct = payload.content_type.includes('.')
        ? payload.content_type
        : `inventory.${payload.content_type}`;

      const response = await api.request('/reviews/reviews/', {
        method: 'POST',
        body: JSON.stringify({ ...payload, content_type: ct }),
      });

      console.log(">>> Created review response:", response);
      return response;
    },
  },

  // Flights
  flights: {
   
    search: (params) => {
     
      const cleanParams = Object.fromEntries(
        Object.entries({
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departure_date,
          passengers: params.passengers || 1,
          provider: 'fake',       
          force_refresh: true,    
        }).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );

      return api.request('/inventory/flights/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanParams),
      });
    },

 
    getOffer: (id) =>
      api.request(`/inventory/flights/${id}/`, {
        method: 'GET',
      }),
  },


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
  maps: {
  geocode: async ({ query }) => {
    const url = `${API_BASE}/maps/geocode/?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch geocode');
    return res.json();
  },
  reverseGeocode: async ({ lat, lng }) => {
    const url = `${API_BASE}/maps/reverse-geocode/?lat=${lat}&lng=${lng}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
    });
    if (!res.ok) throw new Error('Failed to reverse geocode');
    return res.json();
  },
},
};