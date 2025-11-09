import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '@fsp/database';
import { AIService } from '../../src/services/ai.service';
import { WeatherConflictEvent } from '@fsp/shared';

const aiService = new AIService();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Missing bookingId' });
    }

    // Get booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: true,
        instructor: true,
        departureLocation: true,
        weatherChecks: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const latestWeatherCheck = booking.weatherChecks[0];
    if (!latestWeatherCheck) {
      return res.status(400).json({ error: 'No weather check found for this booking' });
    }

    // Create conflict event for AI
    const conflict: WeatherConflictEvent = {
      type: 'WeatherConflictDetected',
      aggregateId: booking.id,
      aggregateType: 'Booking',
      payload: {
        bookingId: booking.id,
        studentId: booking.studentId,
        instructorId: booking.instructorId,
        scheduledTime: booking.scheduledTime,
        location: {
          id: booking.departureLocation.id,
          name: booking.departureLocation.name,
          latitude: Number(booking.departureLocation.latitude),
          longitude: Number(booking.departureLocation.longitude),
          timezone: booking.departureLocation.timezone,
        },
        weatherData: latestWeatherCheck.rawData as any,
        trainingLevel: booking.student.trainingLevel,
        violatedMinimums: latestWeatherCheck.violatedMinimums,
        severity: 'critical',
      },
    };

    // Generate reschedule options
    const options = await aiService.generateRescheduleOptions(conflict);

    // Save options to database
    await Promise.all(
      options.map(option =>
        prisma.rescheduleOption.create({
          data: {
            conflictEventId: booking.id,
            originalBookingId: booking.id,
            proposedTime: option.proposedTime,
            weatherForecast: option.weatherForecast,
            aiScore: option.aiScore,
            aiReasoning: option.aiReasoning,
            status: 'pending',
          },
        })
      )
    );

    return res.status(200).json({
      success: true,
      options,
    });
  } catch (error) {
    console.error('Error generating reschedule options:', error);
    return res.status(500).json({ 
      error: 'Failed to generate options',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

