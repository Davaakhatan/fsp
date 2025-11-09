import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create Supabase client with service role key for backend access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch upcoming bookings with all related data
    const { data: bookings, error } = await supabase
      .from('flight_bookings')
      .select(`
        *,
        student:students(*),
        instructor:instructors(*),
        aircraft:aircraft(*),
        departure_location:locations!flight_bookings_departure_location_id_fkey(*),
        destination_location:locations!flight_bookings_destination_location_id_fkey(*)
      `)
      .in('status', ['SCHEDULED', 'IN_FLIGHT', 'WEATHER_HOLD'])
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ error: error.message });
    }

    // Format the response
    const formattedBookings = bookings?.map((booking: any) => ({
      id: booking.id,
      scheduledTime: booking.scheduled_time,
      durationMinutes: booking.duration_minutes,
      status: booking.status,
      notes: booking.notes,
      student: {
        id: booking.student.id,
        name: booking.student.name,
        email: booking.student.email,
        trainingLevel: booking.student.training_level,
      },
      instructor: {
        id: booking.instructor.id,
        name: booking.instructor.name,
        email: booking.instructor.email,
      },
      aircraft: {
        id: booking.aircraft.id,
        tailNumber: booking.aircraft.tail_number,
        model: booking.aircraft.model,
        category: booking.aircraft.category,
      },
      departureLocation: {
        id: booking.departure_location.id,
        name: booking.departure_location.name,
        code: booking.departure_location.code,
        latitude: booking.departure_location.latitude,
        longitude: booking.departure_location.longitude,
      },
      destinationLocation: booking.destination_location ? {
        id: booking.destination_location.id,
        name: booking.destination_location.name,
        code: booking.destination_location.code,
        latitude: booking.destination_location.latitude,
        longitude: booking.destination_location.longitude,
      } : null,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    })) || [];

    return res.status(200).json(formattedBookings);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
