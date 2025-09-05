const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  // Core request handler
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const url = `${API_BASE}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { headers, ...options });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const text = await response.text().catch(() => '');
    return text ? JSON.parse(text) : {};
  },

  //  Auth
  auth: {
    login: (credentials) => api.request('/users/auth/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => api.request('/users/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    getProfile: () => api.request('/users/auth/me/'),
    refresh: (refreshToken) => api.request('/users/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    }),
    logoutSession: () => api.request('/users/auth/logout/', { method: 'POST' }),
    listUsers: () => api.request('/users/list/'), 
  },

  //  Catalog
  catalog: {
    getPackages: () => api.request('/catalog/packages/'),
    getPackage: (id) => api.request(`/catalog/packages/${id}/`),
    getDestinations: () => api.request('/catalog/destinations/'),
    getDestination: (id) => api.request(`/catalog/destinations/${id}/`),

    createDestination: (payload) => api.request('/catalog/destinations/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    updateDestination: (id, payload) => api.request(`/catalog/destinations/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    deleteDestination: (id) => api.request(`/catalog/destinations/${id}/`, { method: 'DELETE' }),

    createPackage: (payload) => api.request('/catalog/packages/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },

  //  Inventory (Hotels, Cars, Room Types)
  inventory: {
    getHotels: () => api.request('/inventory/hotels/'),
    getHotel: (id) => api.request(`/inventory/hotels/${id}/`),
    getRoomTypes: (hotelId) => api.request(`/inventory/hotels/${hotelId}/room-types/`),
    getCars: () => api.request('/inventory/cars/'),
    getCar: (id) => api.request(`/inventory/cars/${id}/`),

    createHotel: (payload) => api.request('/inventory/hotels/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    updateHotel: (id, payload) => api.request(`/inventory/hotels/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    deleteHotel: (id) => api.request(`/inventory/hotels/${id}/`, { method: 'DELETE' }),

    createCar: (payload) => api.request('/inventory/cars/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    updateCar: (id, payload) => api.request(`/inventory/cars/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    deleteCar: (id) => api.request(`/inventory/cars/${id}/`, { method: 'DELETE' }),
  },

  //  Booking
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
    list: () => api.request('/reviews/reviews/'),
    create: (payload) => api.request('/reviews/reviews/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },

  //  Flights
  flights: {
    search: (params) => api.request('/flights/search/', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    getOffers: (id) => api.request(`/flights/offers/${id}/`),
  },

  //  Role-based shortcuts
  admin: {
    createDestination: (payload) => api.catalog.createDestination(payload),
    createHotel: (payload) => api.inventory.createHotel(payload),
    createCar: (payload) => api.inventory.createCar(payload),
    listUsers: () => api.auth.listUsers(),
  },
  organizer: {
    createPackage: (payload) => api.catalog.createPackage(payload),
    getPackages: () => api.catalog.getPackages(),
  },
  customer: {
    myBookings: () => api.booking.listMine(),
    book: (payload) => api.booking.create(payload),
  },
};
