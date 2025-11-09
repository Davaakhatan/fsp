import { prisma } from '@fsp/database';
import { Booking, BookingStatus, TrainingLevel } from '@fsp/shared';
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
    }) as Promise<Booking | null>;
  }

  /**
   * Get upcoming bookings within specified hours
   */
  async getUpcoming(hoursAhead: number = 48): Promise<Booking[]> {
    const now = new Date();
    const cutoff = addHours(now, hoursAhead);

    return prisma.booking.findMany({
      where: {
        scheduledTime: {
          gte: now,
          lte: cutoff,
        },
        status: 'SCHEDULED',
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
    }) as Promise<Booking[]>;
  }

  /**
   * Get bookings for a specific student
   */
  async getByStudent(studentId: string): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: { studentId },
      include: {
        instructor: true,
        aircraft: true,
        departureLocation: true,
        destinationLocation: true,
      },
      orderBy: {
        scheduledTime: 'desc',
      },
    }) as Promise<Booking[]>;
  }

  /**
   * Create a new booking
   */
  async create(data: {
    studentId: string;
    instructorId: string;
    aircraftId: string;
    departureLocationId: string;
    destinationLocationId?: string;
    scheduledTime: Date;
    durationMinutes: number;
  }): Promise<Booking> {
    // Validate no conflicts
    await this.validateNoConflicts(data);

    const booking = await prisma.booking.create({
      data: {
        ...data,
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
    await this.logEvent('BookingCreated', booking.id, {
      studentId: data.studentId,
      scheduledTime: data.scheduledTime,
    });

    return booking as Booking;
  }

  /**
   * Update booking status
   */
  async updateStatus(
    bookingId: string,
    newStatus: BookingStatus,
    reason?: string
  ): Promise<Booking> {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: newStatus },
        include: {
          student: true,
          instructor: true,
          aircraft: true,
          departureLocation: true,
          destinationLocation: true,
        },
      });

      // Log event
      await tx.event.create({
        data: {
          eventType: 'BookingStatusChanged',
          aggregateId: bookingId,
          aggregateType: 'Booking',
          payload: {
            oldStatus: booking.status,
            newStatus,
            reason,
          },
        },
      });

      return booking as Booking;
    });
  }

  /**
   * Cancel a booking
   */
  async cancel(bookingId: string, reason: string): Promise<Booking> {
    return this.updateStatus(bookingId, 'CANCELED', reason);
  }

  /**
   * Place booking on weather hold
   */
  async placeOnWeatherHold(bookingId: string): Promise<Booking> {
    return this.updateStatus(bookingId, 'WEATHER_HOLD', 'Weather conflict detected');
  }

  /**
   * Reschedule a booking
   */
  async reschedule(
    originalBookingId: string,
    newScheduledTime: Date
  ): Promise<{ oldBooking: Booking; newBooking: Booking }> {
    return prisma.$transaction(async (tx) => {
      // Get original booking
      const original = await tx.booking.findUnique({
        where: { id: originalBookingId },
        include: {
          student: true,
          instructor: true,
          aircraft: true,
          departureLocation: true,
          destinationLocation: true,
        },
      });

      if (!original) {
        throw new Error('Booking not found');
      }

      // Mark original as rescheduled
      const oldBooking = await tx.booking.update({
        where: { id: originalBookingId },
        data: { status: 'RESCHEDULED' },
        include: {
          student: true,
          instructor: true,
          aircraft: true,
          departureLocation: true,
          destinationLocation: true,
        },
      });

      // Create new booking
      const newBooking = await tx.booking.create({
        data: {
          studentId: original.studentId,
          instructorId: original.instructorId,
          aircraftId: original.aircraftId,
          departureLocationId: original.departureLocationId,
          destinationLocationId: original.destinationLocationId,
          scheduledTime: newScheduledTime,
          durationMinutes: original.durationMinutes,
          status: 'SCHEDULED',
          originalBookingId: originalBookingId,
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
      await tx.event.create({
        data: {
          eventType: 'BookingRescheduled',
          aggregateId: originalBookingId,
          aggregateType: 'Booking',
          payload: {
            oldBookingId: originalBookingId,
            newBookingId: newBooking.id,
            oldTime: original.scheduledTime,
            newTime: newScheduledTime,
          },
        },
      });

      return {
        oldBooking: oldBooking as Booking,
        newBooking: newBooking as Booking,
      };
    });
  }

  /**
   * Validate no scheduling conflicts
   */
  private async validateNoConflicts(data: {
    studentId: string;
    instructorId: string;
    aircraftId: string;
    scheduledTime: Date;
    durationMinutes: number;
  }): Promise<void> {
    const endTime = addHours(data.scheduledTime, data.durationMinutes / 60);

    // Check student conflicts
    const studentConflicts = await prisma.booking.findFirst({
      where: {
        studentId: data.studentId,
        status: 'SCHEDULED',
        scheduledTime: {
          lt: endTime,
          gte: data.scheduledTime,
        },
      },
    });

    if (studentConflicts) {
      throw new Error('Student already has a booking at this time');
    }

    // Check instructor conflicts
    const instructorConflicts = await prisma.booking.findFirst({
      where: {
        instructorId: data.instructorId,
        status: 'SCHEDULED',
        scheduledTime: {
          lt: endTime,
          gte: data.scheduledTime,
        },
      },
    });

    if (instructorConflicts) {
      throw new Error('Instructor already has a booking at this time');
    }

    // Check aircraft conflicts
    const aircraftConflicts = await prisma.booking.findFirst({
      where: {
        aircraftId: data.aircraftId,
        status: 'SCHEDULED',
        scheduledTime: {
          lt: endTime,
          gte: data.scheduledTime,
        },
      },
    });

    if (aircraftConflicts) {
      throw new Error('Aircraft already booked at this time');
    }
  }

  /**
   * Log domain event
   */
  private async logEvent(
    eventType: string,
    bookingId: string,
    payload: unknown
  ): Promise<void> {
    await prisma.event.create({
      data: {
        eventType,
        aggregateId: bookingId,
        aggregateType: 'Booking',
        payload: payload as any,
      },
    });
  }
}

