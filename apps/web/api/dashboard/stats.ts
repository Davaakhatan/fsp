import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get total bookings count
    const { count: totalBookings } = await supabase
      .from('flight_bookings')
      .select('*', { count: 'exact', head: true });

    // Get active flights (scheduled or in-flight)
    const { count: activeFlights } = await supabase
      .from('flight_bookings')
      .select('*', { count: 'exact', head: true })
      .in('status', ['SCHEDULED', 'IN_FLIGHT']);

    // Get weather alerts
    const { count: weatherAlerts } = await supabase
      .from('weather_alerts')
      .select('*', { count: 'exact', head: true })
      .is('resolved_at', null);

    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count: todayBookings } = await supabase
      .from('flight_bookings')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_time', today.toISOString())
      .lt('scheduled_time', tomorrow.toISOString());

    // Get upcoming bookings (next 7 days)
    const { data: upcomingBookings } = await supabase
      .from('flight_bookings')
      .select(`
        *,
        student:students(name),
        instructor:instructors(name),
        aircraft:aircraft(tail_number, model),
        departure_location:locations!flight_bookings_departure_location_id_fkey(code, name)
      `)
      .gte('scheduled_time', new Date().toISOString())
      .lte('scheduled_time', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
      .eq('status', 'SCHEDULED')
      .order('scheduled_time', { ascending: true })
      .limit(10);

    // Get recent weather alerts
    const { data: recentAlerts } = await supabase
      .from('weather_alerts')
      .select(`
        *,
        booking:flight_bookings(
          scheduled_time,
          student:students(name),
          departure_location:locations!flight_bookings_departure_location_id_fkey(name, code)
        )
      `)
      .is('resolved_at', null)
      .order('detected_at', { ascending: false })
      .limit(5);

    const stats = {
      totalBookings: totalBookings || 0,
      activeFlights: activeFlights || 0,
      weatherAlerts: weatherAlerts || 0,
      todayBookings: todayBookings || 0,
      upcomingFlights: upcomingBookings?.map((booking: any) => ({
        id: booking.id,
        scheduledTime: booking.scheduled_time,
        studentName: booking.student?.name,
        instructorName: booking.instructor?.name,
        aircraft: `${booking.aircraft?.tail_number} (${booking.aircraft?.model})`,
        departure: `${booking.departure_location?.code} - ${booking.departure_location?.name}`,
        status: booking.status,
      })) || [],
      recentAlerts: recentAlerts?.map((alert: any) => ({
        id: alert.id,
        severity: alert.severity,
        detectedAt: alert.detected_at,
        violatedMinimums: alert.violated_minimums,
        location: `${alert.booking?.departure_location?.code} - ${alert.booking?.departure_location?.name}`,
        studentName: alert.booking?.student?.name,
        scheduledTime: alert.booking?.scheduled_time,
      })) || [],
    };

    return res.status(200).json(stats);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
