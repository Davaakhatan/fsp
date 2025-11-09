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

    // Fetch active weather alerts
    const { data: alerts, error } = await supabase
      .from('weather_alerts')
      .select(`
        *,
        booking:flight_bookings(
          *,
          student:students(*),
          departure_location:locations!flight_bookings_departure_location_id_fkey(*)
        )
      `)
      .is('resolved_at', null)
      .order('severity', { ascending: false })
      .order('detected_at', { ascending: false });

    if (error) {
      console.error('Error fetching weather alerts:', error);
      return res.status(500).json({ error: error.message });
    }

    // Format the response
    const formattedAlerts = alerts?.map((alert: any) => ({
      id: alert.id,
      severity: alert.severity,
      violatedMinimums: alert.violated_minimums,
      currentConditions: alert.current_conditions,
      detectedAt: alert.detected_at,
      booking: {
        id: alert.booking.id,
        scheduledTime: alert.booking.scheduled_time,
        student: {
          name: alert.booking.student.name,
          email: alert.booking.student.email,
        },
        departureLocation: {
          name: alert.booking.departure_location.name,
          code: alert.booking.departure_location.code,
        },
      },
    })) || [];

    return res.status(200).json(formattedAlerts);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
