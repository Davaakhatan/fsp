import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '@fsp/database';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current weather alerts (bookings on weather hold with recent checks)
    const alerts = await prisma.booking.findMany({
      where: {
        status: 'WEATHER_HOLD',
        scheduledTime: {
          gte: new Date(),
        },
      },
      include: {
        student: true,
        departureLocation: true,
        weatherChecks: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        scheduledTime: 'asc',
      },
    });

    // Format alerts for frontend
    const formattedAlerts = alerts.map(booking => ({
      id: booking.id,
      student: booking.student.name,
      location: booking.departureLocation.name,
      scheduledTime: booking.scheduledTime,
      violatedMinimums: booking.weatherChecks[0]?.violatedMinimums || [],
      severity: booking.weatherChecks[0]?.isSafe === false ? 'critical' : 'marginal',
    }));

    return res.status(200).json(formattedAlerts);
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    return res.status(500).json({ error: 'Failed to fetch weather alerts' });
  }
}

