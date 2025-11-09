import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '@fsp/database';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          scheduledTime: {
            gte: new Date(),
          },
          status: {
            in: ['SCHEDULED', 'WEATHER_HOLD'],
          },
        },
        include: {
          student: true,
          instructor: true,
          aircraft: true,
          departureLocation: true,
          destinationLocation: true,
        },
        orderBy: {
          scheduledTime: 'asc',
        },
        take: 50,
      });

      return res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { studentId, instructorId, aircraftId, departureLocationId, destinationLocationId, scheduledTime, durationMinutes } = req.body;

      // Validate required fields
      if (!studentId || !instructorId || !aircraftId || !departureLocationId || !scheduledTime || !durationMinutes) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          studentId,
          instructorId,
          aircraftId,
          departureLocationId,
          destinationLocationId,
          scheduledTime: new Date(scheduledTime),
          durationMinutes,
          status: 'SCHEDULED',
        },
        include: {
          student: true,
          instructor: true,
          aircraft: true,
          departureLocation: true,
          destinationLocation: true,
        },
      });

      // Log event
      await prisma.event.create({
        data: {
          eventType: 'BookingCreated',
          aggregateId: booking.id,
          aggregateType: 'Booking',
          payload: {
            studentId,
            scheduledTime,
          },
        },
      });

      return res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

