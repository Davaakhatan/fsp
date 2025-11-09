import express from 'express';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') });

const app = express();
const PORT = 3001;

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// GET /api/bookings - List all bookings
app.get('/api/bookings', async (req, res) => {
  try {
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

    if (error) throw error;

    const formatted = bookings?.map((b: any) => ({
      id: b.id,
      scheduledTime: b.scheduled_time,
      durationMinutes: b.duration_minutes,
      status: b.status,
      student: { id: b.student.id, name: b.student.name, email: b.student.email },
      instructor: { id: b.instructor.id, name: b.instructor.name },
      aircraft: { id: b.aircraft.id, tailNumber: b.aircraft.tail_number, model: b.aircraft.model },
      departureLocation: { id: b.departure_location.id, name: b.departure_location.name, code: b.departure_location.code },
      destinationLocation: b.destination_location ? { id: b.destination_location.id, name: b.destination_location.name } : null,
    })) || [];

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/alerts - List weather alerts
app.get('/api/weather/alerts', async (req, res) => {
  try {
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
      .order('severity', { ascending: false });

    if (error) throw error;

    const formatted = alerts?.map((a: any) => ({
      id: a.id,
      severity: a.severity,
      violatedMinimums: a.violated_minimums,
      detectedAt: a.detected_at,
      booking: {
        scheduledTime: a.booking.scheduled_time,
        studentName: a.booking.student.name,
        location: `${a.booking.departure_location.code} - ${a.booking.departure_location.name}`,
      },
    })) || [];

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/stats - Dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { count: totalBookings } = await supabase
      .from('flight_bookings')
      .select('*', { count: 'exact', head: true });

    const { count: activeFlights } = await supabase
      .from('flight_bookings')
      .select('*', { count: 'exact', head: true })
      .in('status', ['SCHEDULED', 'IN_FLIGHT']);

    const { count: weatherAlerts } = await supabase
      .from('weather_alerts')
      .select('*', { count: 'exact', head: true })
      .is('resolved_at', null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count: todayBookings } = await supabase
      .from('flight_bookings')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_time', today.toISOString())
      .lt('scheduled_time', tomorrow.toISOString());

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
      .eq('status', 'SCHEDULED')
      .order('scheduled_time', { ascending: true })
      .limit(10);

    const stats = {
      totalBookings: totalBookings || 0,
      activeFlights: activeFlights || 0,
      weatherAlerts: weatherAlerts || 0,
      todayBookings: todayBookings || 0,
      upcomingFlights: upcomingBookings?.map((b: any) => ({
        id: b.id,
        scheduledTime: b.scheduled_time,
        studentName: b.student?.name,
        aircraft: `${b.aircraft?.tail_number} (${b.aircraft?.model})`,
        departure: `${b.departure_location?.code} - ${b.departure_location?.name}`,
      })) || [],
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Local API server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard stats: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`✈️  Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`🌤️  Weather alerts: http://localhost:${PORT}/api/weather/alerts`);
});

