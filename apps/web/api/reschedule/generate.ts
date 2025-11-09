import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { AIService } from '../../src/services/ai.service';
import { WeatherConflictEvent } from '@fsp/shared';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const aiService = new AIService();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId, weatherAlertId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Missing bookingId' });
    }

    // Get booking with related data
    const { data: booking, error: bookingError } = await supabase
      .from('flight_bookings')
      .select(`
        *,
        student:students(*),
        instructor:instructors(*),
        aircraft:aircraft(*),
        departure_location:locations!flight_bookings_departure_location_id_fkey(*)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Get latest weather check for this booking
    const { data: latestWeather, error: weatherError } = await supabase
      .from('weather_conditions')
      .select('*')
      .eq('location_id', booking.departure_location_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (weatherError || !latestWeather) {
      return res.status(400).json({ error: 'No weather check found for this location' });
    }

    // Get weather alert if provided
    let violatedMinimums: string[] = [];
    if (weatherAlertId) {
      const { data: alert } = await supabase
        .from('weather_alerts')
        .select('violated_minimums')
        .eq('id', weatherAlertId)
        .single();
      
      if (alert) {
        violatedMinimums = alert.violated_minimums || [];
      }
    }

    // Create conflict event for AI
    const conflict: WeatherConflictEvent = {
      type: 'WeatherConflictDetected',
      aggregateId: booking.id,
      aggregateType: 'Booking',
      payload: {
        bookingId: booking.id,
        studentId: booking.student_id,
        instructorId: booking.instructor_id,
        scheduledTime: booking.scheduled_time,
        location: {
          id: booking.departure_location.id,
          name: booking.departure_location.name,
          latitude: booking.departure_location.latitude,
          longitude: booking.departure_location.longitude,
          timezone: booking.departure_location.timezone,
        },
        weatherData: latestWeather.raw_data as any,
        trainingLevel: booking.student.training_level,
        violatedMinimums,
        severity: 'critical',
      },
    };

    // Generate reschedule options
    const options = await aiService.generateRescheduleOptions(conflict);

    // Save options to database
    const insertPromises = options.map(option =>
      supabase.from('reschedule_options').insert({
        original_booking_id: booking.id,
        proposed_time: option.proposedTime.toISOString(),
        weather_forecast: option.weatherForecast,
        ai_score: option.aiScore,
        ai_reasoning: option.aiReasoning,
        status: 'pending',
      })
    );

    await Promise.all(insertPromises);

    return res.status(200).json({
      success: true,
      options: options.map(opt => ({
        ...opt,
        proposedTime: opt.proposedTime.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error generating reschedule options:', error);
    return res.status(500).json({ 
      error: 'Failed to generate options',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
