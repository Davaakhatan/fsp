import { TrainingLevel, WeatherMinimums } from '../types';

// Weather Minimums by Training Level
export const WEATHER_MINIMUMS: Record<TrainingLevel, WeatherMinimums> = {
  STUDENT: {
    visibility: 5, // miles
    ceiling: 3000, // feet
    windSpeed: 10, // knots
    windGust: 15, // knots
    precipitation: false,
    thunderstorms: false,
  },
  PRIVATE: {
    visibility: 3, // miles
    ceiling: 1000, // feet
    windSpeed: 20, // knots
    windGust: 25, // knots
    precipitation: true, // Can handle light precipitation
    thunderstorms: false,
  },
  INSTRUMENT: {
    visibility: 1, // miles - IMC acceptable
    ceiling: 200, // feet - Low IFR acceptable
    windSpeed: 30, // knots
    windGust: 35, // knots
    precipitation: true,
    thunderstorms: false, // Hard stop
    icing: false, // Hard stop
  },
};

// API Rate Limits
export const API_LIMITS = {
  OPENWEATHER_CALLS_PER_DAY: 1000,
  RESEND_EMAILS_PER_MONTH: 3000,
  UPSTASH_COMMANDS_PER_DAY: 10000,
  QSTASH_MESSAGES_PER_DAY: 500,
} as const;

// Cache TTLs (in milliseconds)
export const CACHE_TTL = {
  WEATHER_DATA: 30 * 60 * 1000, // 30 minutes
  STUDENT_PROFILE: 60 * 60 * 1000, // 1 hour
  LOCATION_DATA: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Weather check window (hours ahead to check)
export const WEATHER_CHECK_WINDOW = 48; // hours

// AI Configuration
export const AI_CONFIG = {
  MODEL: 'gpt-4-turbo',
  TEMPERATURE: 0.5,
  MAX_TOKENS: 2000,
  TIMEOUT: 30000, // 30 seconds
  OPTIONS_TO_GENERATE: 5,
  OPTIONS_TO_RETURN: 3,
} as const;

// Notification retry configuration
export const NOTIFICATION_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: [1000, 5000, 15000], // Exponential backoff
} as const;

