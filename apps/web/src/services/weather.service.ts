import { WeatherData, WeatherMinimums, TrainingLevel, Location } from '@fsp/shared';
import { WEATHER_MINIMUMS, CACHE_TTL } from '@fsp/shared';

interface OpenWeatherResponse {
  current: {
    dt: number;
    temp: number;
    dew_point: number;
    pressure: number;
    humidity: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_gust?: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
    }>;
  };
}

export class WeatherService {
  private apiKey: string;
  private cache: Map<string, { data: WeatherData; timestamp: number }>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cache = new Map();
  }

  /**
   * Get current weather data for a location
   */
  async getWeather(location: Location): Promise<WeatherData> {
    const cacheKey = `${location.latitude},${location.longitude}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL.WEATHER_DATA) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?` +
          `lat=${location.latitude}&lon=${location.longitude}` +
          `&appid=${this.apiKey}&units=imperial&exclude=minutely,hourly,daily,alerts`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenWeatherResponse = await response.json();
      const weatherData = this.parseWeatherData(data);

      // Cache the result
      this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error;
    }
  }

  /**
   * Parse OpenWeatherMap API response into our WeatherData format
   */
  private parseWeatherData(data: OpenWeatherResponse): WeatherData {
    const current = data.current;

    return {
      visibility: current.visibility / 1609.34, // meters to miles
      ceiling: this.estimateCeiling(current.clouds),
      windSpeed: current.wind_speed,
      windGust: current.wind_gust || null,
      conditions: current.weather.map((w) => w.main),
      temperature: current.temp,
      dewPoint: current.dew_point,
      pressure: current.pressure,
      humidity: current.humidity,
    };
  }

  /**
   * Estimate ceiling height from cloud coverage
   * This is an approximation since OpenWeatherMap doesn't provide actual ceiling
   */
  private estimateCeiling(cloudPercentage: number): number | null {
    if (cloudPercentage === 0) return null; // Clear skies
    if (cloudPercentage < 25) return 10000; // Few clouds - high ceiling
    if (cloudPercentage < 50) return 5000; // Scattered clouds
    if (cloudPercentage < 88) return 2000; // Broken clouds
    return 1000; // Overcast
  }

  /**
   * Check if weather conditions are safe for a given training level
   */
  checkSafety(
    weather: WeatherData,
    trainingLevel: TrainingLevel
  ): {
    isSafe: boolean;
    violatedMinimums: string[];
  } {
    const minimums = WEATHER_MINIMUMS[trainingLevel];
    const violations: string[] = [];

    // Check visibility
    if (weather.visibility < minimums.visibility) {
      violations.push(
        `Visibility ${weather.visibility.toFixed(1)} mi < ${minimums.visibility} mi minimum`
      );
    }

    // Check ceiling
    if (minimums.ceiling !== null && weather.ceiling !== null) {
      if (weather.ceiling < minimums.ceiling) {
        violations.push(
          `Ceiling ${weather.ceiling} ft < ${minimums.ceiling} ft minimum`
        );
      }
    }

    // Check wind speed
    if (weather.windSpeed > minimums.windSpeed) {
      violations.push(
        `Wind speed ${weather.windSpeed.toFixed(0)} kt > ${minimums.windSpeed} kt maximum`
      );
    }

    // Check wind gusts
    if (minimums.windGust !== null && weather.windGust !== null) {
      if (weather.windGust > minimums.windGust) {
        violations.push(
          `Wind gusts ${weather.windGust.toFixed(0)} kt > ${minimums.windGust} kt maximum`
        );
      }
    }

    // Check precipitation (for student pilots)
    if (!minimums.precipitation) {
      const hasPrecipitation = weather.conditions.some((c) =>
        ['Rain', 'Snow', 'Drizzle', 'Sleet'].includes(c)
      );
      if (hasPrecipitation) {
        violations.push('Precipitation not allowed for this training level');
      }
    }

    // Check thunderstorms (hard stop for everyone)
    const hasThunderstorms = weather.conditions.some((c) =>
      c.includes('Thunderstorm')
    );
    if (hasThunderstorms && !minimums.thunderstorms) {
      violations.push('Thunderstorms present - flight not authorized');
    }

    // Check icing (for instrument-rated only)
    if ('icing' in minimums && minimums.icing === false) {
      const hasIcing =
        weather.temperature <= 32 &&
        weather.conditions.some((c) => ['Rain', 'Drizzle'].includes(c));
      if (hasIcing) {
        violations.push('Icing conditions present');
      }
    }

    return {
      isSafe: violations.length === 0,
      violatedMinimums: violations,
    };
  }

  /**
   * Get severity of weather conflict
   */
  getConflictSeverity(
    weather: WeatherData,
    trainingLevel: TrainingLevel
  ): 'critical' | 'marginal' {
    const minimums = WEATHER_MINIMUMS[trainingLevel];

    // Critical conditions
    const hasThunderstorms = weather.conditions.some((c) =>
      c.includes('Thunderstorm')
    );
    if (hasThunderstorms) return 'critical';

    const hasIcing =
      weather.temperature <= 32 &&
      weather.conditions.some((c) => ['Rain', 'Drizzle'].includes(c));
    if (hasIcing && trainingLevel === 'INSTRUMENT') return 'critical';

    // Check how far below minimums we are
    const visibilityRatio = weather.visibility / minimums.visibility;
    if (visibilityRatio < 0.5) return 'critical';

    const windRatio = weather.windSpeed / minimums.windSpeed;
    if (windRatio > 1.5) return 'critical';

    // Otherwise marginal
    return 'marginal';
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

