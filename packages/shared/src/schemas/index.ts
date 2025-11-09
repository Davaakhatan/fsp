import { z } from 'zod';

// Booking schemas
export const bookingStatusSchema = z.enum([
  'SCHEDULED',
  'WEATHER_HOLD',
  'CANCELED',
  'RESCHEDULED',
  'COMPLETED',
]);

export const trainingLevelSchema = z.enum([
  'STUDENT',
  'PRIVATE',
  'INSTRUMENT',
]);

export const createBookingSchema = z.object({
  studentId: z.string().uuid(),
  instructorId: z.string().uuid(),
  aircraftId: z.string().uuid(),
  departureLocationId: z.string().uuid(),
  destinationLocationId: z.string().uuid().nullable(),
  scheduledTime: z.string().datetime(),
  durationMinutes: z.number().int().positive().max(480), // Max 8 hours
});

// Weather schemas
export const weatherDataSchema = z.object({
  visibility: z.number().nonnegative(),
  ceiling: z.number().int().positive().nullable(),
  windSpeed: z.number().nonnegative(),
  windGust: z.number().nonnegative().nullable(),
  conditions: z.array(z.string()),
  temperature: z.number(),
  dewPoint: z.number(),
  pressure: z.number().positive(),
  humidity: z.number().min(0).max(100),
});

// AI Reschedule schema
export const rescheduleOptionSchema = z.object({
  proposedTime: z.string().datetime(),
  weatherForecast: weatherDataSchema,
  score: z.number().min(0).max(1),
  reasoning: z.string().min(10).max(500),
});

export const rescheduleOptionsResponseSchema = z.object({
  options: z.array(rescheduleOptionSchema).min(1).max(5),
});

// Student schema
export const createStudentSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).nullable(),
  trainingLevel: trainingLevelSchema,
});

// Location schema
export const createLocationSchema = z.object({
  name: z.string().min(2).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string(),
});

// Notification schema
export const notificationChannelSchema = z.enum(['email', 'sms', 'in-app']);

export const sendNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  channel: notificationChannelSchema,
  type: z.enum(['conflict', 'reschedule-options', 'confirmation']),
  subject: z.string().max(200).nullable(),
  body: z.string().min(10).max(5000),
  relatedBookingId: z.string().uuid().nullable(),
});

