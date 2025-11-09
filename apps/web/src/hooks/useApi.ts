import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { Booking } from '@fsp/shared';
import { supabase } from '../lib/supabase';

// Fetch bookings directly from Supabase
export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight_bookings')
        .select(`
          *,
          student:students(*),
          instructor:instructors(*),
          aircraft:aircraft(*),
          departure_location:locations!flight_bookings_departure_location_id_fkey(*),
          destination_location:locations!flight_bookings_destination_location_id_fkey(*)
        `)
        .order('scheduled_at', { ascending: true });
      
      if (error) throw error;
      return data as any[];
    },
  });
}

// Fetch single booking
export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/bookings/${id}`);
      if (!response.ok) throw new Error('Failed to fetch booking');
      return response.json() as Promise<Booking>;
    },
    enabled: !!id,
  });
}

// Create booking mutation
export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      instructorId: string;
      aircraftId: string;
      departureLocationId: string;
      destinationLocationId?: string;
      scheduledTime: string;
      durationMinutes: number;
    }) => {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// Fetch weather alerts
export function useWeatherAlerts() {
  return useQuery({
    queryKey: ['weather-alerts'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/weather/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

// Fetch dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });
}

