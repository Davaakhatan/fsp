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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Active flights (in progress)
    const activeFlights = await prisma.booking.count({
      where: {
        status: 'SCHEDULED',
        scheduledTime: {
          lte: now,
        },
      },
    });

    // Scheduled today
    const scheduledToday = await prisma.booking.count({
      where: {
        status: {
          in: ['SCHEDULED', 'WEATHER_HOLD'],
        },
        scheduledTime: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    // Weather alerts
    const weatherAlerts = await prisma.booking.count({
      where: {
        status: 'WEATHER_HOLD',
        scheduledTime: {
          gte: now,
        },
      },
    });

    return res.status(200).json({
      activeFlights,
      activeFlightsTrend: '+0', // TODO: Calculate trend
      scheduledToday,
      scheduledTodayTrend: '+0', // TODO: Calculate trend
      alertsTrend: '0', // TODO: Calculate trend
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

