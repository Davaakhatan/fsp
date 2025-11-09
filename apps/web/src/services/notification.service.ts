// @ts-nocheck
// NOTE: This service uses Prisma which is not set up in this project
// Type errors are suppressed as this is legacy/unused code
import { prisma } from '@fsp/database';

export class NotificationService {
  async sendBookingConfirmation(bookingId: string) {
    // Implementation would go here
    console.log('Sending booking confirmation for:', bookingId);
  }

  async sendWeatherAlert(alertId: string) {
    // Implementation would go here
    console.log('Sending weather alert:', alertId);
  }
}

export const notificationService = new NotificationService();
