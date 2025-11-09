// Booking types (Legacy - for old weather system)
export type BookingStatus = 
  | 'SCHEDULED' 
  | 'WEATHER_HOLD' 
  | 'CANCELED' 
  | 'RESCHEDULED' 
  | 'COMPLETED';

export type TrainingLevel = 
  | 'STUDENT' 
  | 'PRIVATE' 
  | 'INSTRUMENT';

export interface Booking {
  id: string;
  studentId: string;
  instructorId: string;
  aircraftId: string;
  departureLocationId: string;
  destinationLocationId: string | null;
  scheduledTime: Date;
  durationMinutes: number;
  status: BookingStatus;
  originalBookingId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  trainingLevel: TrainingLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Weather types (Legacy)
export interface WeatherData {
  visibility: number; // miles
  ceiling: number | null; // feet
  windSpeed: number; // knots
  windGust: number | null; // knots
  conditions: string[];
  temperature: number; // fahrenheit
  dewPoint: number;
  pressure: number;
  humidity: number;
}

export interface WeatherMinimums {
  visibility: number; // miles
  ceiling: number | null; // feet
  windSpeed: number; // knots
  windGust: number | null; // knots
  precipitation: boolean;
  thunderstorms: boolean;
  icing?: boolean;
}

export interface WeatherCheck {
  id: string;
  bookingId: string;
  locationId: string;
  checkTime: Date;
  forecastTime: Date;
  visibilityMiles: number;
  ceilingFeet: number | null;
  windSpeedKnots: number;
  windGustKnots: number | null;
  conditions: string[];
  rawData: unknown;
  isSafe: boolean;
  violatedMinimums: string[];
  createdAt: Date;
}

// Reschedule types (Legacy)
export interface RescheduleOption {
  id: string;
  conflictEventId: string;
  originalBookingId: string;
  proposedTime: Date;
  weatherForecast: WeatherData;
  aiScore: number;
  aiReasoning: string;
  status: 'pending' | 'selected' | 'rejected';
  createdAt: Date;
}

// Event types (Legacy)
export interface DomainEvent {
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: unknown;
  metadata?: {
    timestamp: Date;
    userId?: string;
    correlationId?: string;
  };
}

export interface WeatherConflictEvent extends DomainEvent {
  type: 'WeatherConflictDetected';
  aggregateType: 'Booking';
  payload: {
    bookingId: string;
    studentId: string;
    instructorId: string;
    scheduledTime: Date;
    location: Location;
    weatherData: WeatherData;
    trainingLevel: TrainingLevel;
    violatedMinimums: string[];
    severity: 'critical' | 'marginal';
  };
}

// Notification types (Legacy)
export interface Notification {
  id: string;
  recipientId: string;
  channel: 'email' | 'sms' | 'in-app';
  type: 'conflict' | 'reschedule-options' | 'confirmation';
  subject: string | null;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt: Date | null;
  retryCount: number;
  errorMessage: string | null;
  relatedBookingId: string | null;
  createdAt: Date;
}

// =====================================================
// NEW MARKETPLACE TYPES
// =====================================================
export * from './marketplace';
