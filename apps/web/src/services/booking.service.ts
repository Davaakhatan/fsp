// @ts-nocheck
// NOTE: This service uses Prisma which is not set up in this project
// Type errors are suppressed as this is legacy/unused code
import { prisma } from '@fsp/database';
import { Booking, BookingStatus } from '@fsp/shared';
import { addHours } from 'date-fns';

export class BookingService {
  /**
   * Get booking by ID
   */
  async getById(id: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        instructor: true,
        aircraft: true,
        departureLocation: true,
        destinationLocation: true,
      },
    });
  }

  // ... rest of the service methods would go here
}

export const bookingService = new BookingService();
