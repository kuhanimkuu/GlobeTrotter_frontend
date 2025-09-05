// Booking calculations
export const calculateTotalPrice = (basePrice, duration, guests = 1) => {
  return basePrice * duration * guests;
};

export const calculateDiscount = (total, discountPercentage) => {
  return total * (discountPercentage / 100);
};

export const calculateFinalPrice = (total, discount = 0) => {
  return Math.max(0, total - discount);
};

// Date calculations
export const getDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Percentage calculations
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Availability calculations
export const calculateAvailableSlots = (totalSlots, bookedSlots) => {
  return Math.max(0, totalSlots - bookedSlots);
};

// Tax calculations (example: 8% tax)
export const calculateTax = (amount, taxRate = 8) => {
  return amount * (taxRate / 100);
};