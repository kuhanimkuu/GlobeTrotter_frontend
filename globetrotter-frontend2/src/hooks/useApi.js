import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from './useAuth';

// Tour Packages
export const useTourPackages = (options = {}) => {
  return useQuery({
    queryKey: ['tour-packages'],
    queryFn: () => api.catalog.getPackages(),
    ...options,
  });
};

export const useTourPackage = (slug, options = {}) => {
  return useQuery({
    queryKey: ['tour-package', slug],
    queryFn: () => api.catalog.getPackage(slug),
    enabled: !!slug,
    ...options,
  });
};

// Destinations
export const useDestinations = (options = {}) => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: () => api.catalog.getDestinations(),
    ...options,
  });
};

// User Bookings
export const useUserBookings = (options = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: () => api.booking.list(token),
    enabled: !!token,
    ...options,
  });
};

// Create Booking Mutation
export const useCreateBooking = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingData) => api.booking.create(bookingData, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-bookings']);
    },
  });
};

// Organizer Packages
export const useOrganizerPackages = (options = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['organizer-packages'],
    queryFn: () => api.organizer.getPackages(token),
    enabled: !!token,
    ...options,
  });
};

// Create Package Mutation (Organizer)
export const useCreatePackage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (packageData) => api.organizer.createPackage(packageData, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['organizer-packages']);
      queryClient.invalidateQueries(['tour-packages']);
    },
  });
};

// Hotels
export const useHotels = (destinationId, options = {}) => {
  return useQuery({
    queryKey: ['hotels', destinationId],
    queryFn: () => api.inventory.getHotels(destinationId),
    enabled: !!destinationId,
    ...options,
  });
};

// Cars
export const useCars = (destinationId, options = {}) => {
  return useQuery({
    queryKey: ['cars', destinationId],
    queryFn: () => api.inventory.getCars(destinationId),
    enabled: !!destinationId,
    ...options,
  });
};