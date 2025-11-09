import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      
      // Transform to match expected format
      return (data || []).map((booking: any) => ({
        id: booking.id,
        scheduledTime: booking.scheduled_at,
        duration: booking.duration_minutes,
        status: booking.status,
        notes: booking.notes,
        student: booking.student ? {
          id: booking.student.id,
          name: booking.student.name,
          email: booking.student.email,
        } : null,
        instructor: booking.instructor ? {
          id: booking.instructor.id,
          name: booking.instructor.name,
          email: booking.instructor.email,
        } : null,
        aircraft: booking.aircraft ? {
          id: booking.aircraft.id,
          tailNumber: booking.aircraft.tail_number,
          model: booking.aircraft.model,
        } : null,
        departureLocation: booking.departure_location ? {
          id: booking.departure_location.id,
          name: booking.departure_location.name,
          code: booking.departure_location.code,
        } : null,
        destinationLocation: booking.destination_location ? {
          id: booking.destination_location.id,
          name: booking.destination_location.name,
          code: booking.destination_location.code,
        } : null,
      }));
    },
  });
}

// Fetch weather alerts directly from Supabase
export function useWeatherAlerts() {
  return useQuery({
    queryKey: ['weather-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weather_alerts')
        .select(`
          *,
          location:locations(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match expected format
      return (data || []).map((alert: any) => ({
        id: alert.id,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        affectedBookingsCount: alert.affected_bookings_count || 0,
        isActive: alert.is_active,
        createdAt: alert.created_at,
        resolvedAt: alert.resolved_at,
        location: alert.location ? {
          id: alert.location.id,
          name: alert.location.name,
          code: alert.location.code,
        } : null,
      }));
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

// Fetch dashboard stats directly from Supabase
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get counts from Supabase
      const [bookingsRes, alertsRes] = await Promise.all([
        supabase.from('flight_bookings').select('*', { count: 'exact', head: true }),
        supabase.from('weather_alerts').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('flight_bookings')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_at', `${today}T00:00:00`)
        .lte('scheduled_at', `${today}T23:59:59`);
      
      return {
        totalBookings: bookingsRes.count || 0,
        weatherAlerts: alertsRes.count || 0,
        todayBookings: todayCount || 0,
        activeFlights: 15, // Mock data for now
      };
    },
  });
}
