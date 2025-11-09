import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '@fsp/database';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  if (req.method === 'GET') {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          student: true,
          instructor: true,
          aircraft: true,
          departureLocation: true,
          destinationLocation: true,
          weatherChecks: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      return res.status(200).json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      return res.status(500).json({ error: 'Failed to fetch booking' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

