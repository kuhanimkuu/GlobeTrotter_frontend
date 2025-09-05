// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= 8;
};

// Phone number validation
export const validatePhone = (phone) => {
 const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

// Date validation
export const validateBookingDates = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Please select both dates';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (start < today) return 'Start date cannot be in the past';
  if (end <= start) return 'End date must be after start date';
  if ((end - start) / (1000 * 60 * 60 * 24) > 365) return 'Booking cannot exceed 1 year';
  
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Number validation
export const validateNumber = (value, fieldName, min = 1, max = Infinity) => {
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} cannot exceed ${max}`;
  return null;
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};
export const validation = {
  email: validateEmail,
  password: validatePassword,
  phone: validatePhone,
  bookingDates: validateBookingDates,
  required: validateRequired,
  number: validateNumber,
  form: validateForm,
};
