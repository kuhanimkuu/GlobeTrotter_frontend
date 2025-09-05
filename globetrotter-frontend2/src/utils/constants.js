// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'AGENT', 
  CUSTOMER: 'CUSTOMER',
};

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
};

// Payment methods
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  MPESA: 'mpesa',
  FLUTTERWAVE: 'flutterwave',
};

// Currency options
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  KES: 'KES',
};

// Duration options
export const DURATION_OPTIONS = [
  { value: 1, label: '1 day' },
  { value: 2, label: '2 days' },
  { value: 3, label: '3 days' },
  { value: 7, label: '1 week' },
  { value: 14, label: '2 weeks' },
  { value: 30, label: '1 month' },
];

// Guest options
export const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} ${i === 0 ? 'guest' : 'guests'}`
}));

// API constants
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
};