import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '@fsp/database';
import { WeatherService } from '../../src/services/weather.service';
import { addHours } from 'date-fns';

const weatherService = new WeatherService(process.env.OPENWEATHER_API_KEY!);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify cron secret for security
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting weather check job...');

    // Get upcoming bookings in next 48 hours
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        scheduledTime: {
          gte: new Date(),
          lte: addHours(new Date(), 48),
        },
        status: 'SCHEDULED',
      },
      include: {
        student: true,
        instructor: true,
        departureLocation: true,
        destinationLocation: true,
      },
    });

    console.log(`Found ${upcomingBookings.length} upcoming bookings`);

    const results = {
      checked: 0,
      conflicts: 0,
      errors: 0,
    };

    // Check each booking
    for (const booking of upcomingBookings) {
      try {
        // Get weather for departure location
        const weather = await weatherService.getWeather({
          id: booking.departureLocation.id,
          name: booking.departureLocation.name,
          latitude: Number(booking.departureLocation.latitude),
          longitude: Number(booking.departureLocation.longitude),
          timezone: booking.departureLocation.timezone,
        });

        // Check safety
        const safetyCheck = weatherService.checkSafety(
          weather,
          booking.student.trainingLevel
        );

        // Log weather check
        await prisma.weatherCheck.create({
          data: {
            bookingId: booking.id,
            locationId: booking.departureLocation.id,
            checkTime: new Date(),
            forecastTime: booking.scheduledTime,
            visibilityMiles: weather.visibility,
            ceilingFeet: weather.ceiling,
            windSpeedKnots: weather.windSpeed,
            windGustKnots: weather.windGust,
            conditions: weather.conditions,
            rawData: weather,
            isSafe: safetyCheck.isSafe,
            violatedMinimums: safetyCheck.violatedMinimums,
          },
        });

        results.checked++;

        // If unsafe, update booking status and trigger workflow
        if (!safetyCheck.isSafe) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'WEATHER_HOLD' },
          });

          // Create conflict event
          await prisma.event.create({
            data: {
              eventType: 'WeatherConflictDetected',
              aggregateId: booking.id,
              aggregateType: 'Booking',
              payload: {
                bookingId: booking.id,
                studentId: booking.studentId,
                instructorId: booking.instructorId,
                scheduledTime: booking.scheduledTime,
                location: booking.departureLocation,
                weatherData: weather,
                trainingLevel: booking.student.trainingLevel,
                violatedMinimums: safetyCheck.violatedMinimums,
                severity: weatherService.getConflictSeverity(weather, booking.student.trainingLevel),
              },
            },
          });

          results.conflicts++;
          console.log(`Weather conflict detected for booking ${booking.id}`);
        }
      } catch (error) {
        console.error(`Error checking booking ${booking.id}:`, error);
        results.errors++;
      }
    }

    console.log('Weather check job completed:', results);

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Weather check job failed:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Job failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

