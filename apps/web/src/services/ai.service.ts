import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import {
  WeatherConflictEvent,
  RescheduleOption,
  WeatherData,
  TrainingLevel,
} from '@fsp/shared';
import { AI_CONFIG, WEATHER_MINIMUMS } from '@fsp/shared';
import { addHours, addDays, format } from 'date-fns';

// Zod schema for AI response
const rescheduleOptionSchema = z.object({
  proposedTime: z.string().describe('ISO 8601 datetime string'),
  score: z.number().min(0).max(1).describe('Quality score 0-1'),
  reasoning: z
    .string()
    .min(20)
    .max(500)
    .describe('Why this time is a good option'),
});

const rescheduleResponseSchema = z.object({
  options: z
    .array(rescheduleOptionSchema)
    .min(3)
    .max(5)
    .describe('Array of reschedule options'),
});

export class AIService {
  private model: string;
  private temperature: number;

  constructor() {
    this.model = AI_CONFIG.MODEL;
    this.temperature = AI_CONFIG.TEMPERATURE;
  }

  /**
   * Generate optimal reschedule options for a weather conflict
   */
  async generateRescheduleOptions(
    conflict: WeatherConflictEvent
  ): Promise<RescheduleOption[]> {
    try {
      const prompt = this.buildPrompt(conflict);

      const { object } = await generateObject({
        model: openai(this.model),
        schema: rescheduleResponseSchema,
        prompt,
        temperature: this.temperature,
        maxTokens: AI_CONFIG.MAX_TOKENS,
      });

      // Validate and enrich options
      const validOptions = await this.validateOptions(object.options, conflict);

      return validOptions;
    } catch (error) {
      console.error('AI generation failed:', error);
      // Fallback to simple algorithm
      return this.fallbackScheduler(conflict);
    }
  }

  /**
   * Build prompt for AI
   */
  private buildPrompt(conflict: WeatherConflictEvent): string {
    const { payload } = conflict;
    const minimums = WEATHER_MINIMUMS[payload.trainingLevel];

    return `You are an intelligent flight scheduling assistant. A flight lesson has been canceled due to weather and needs to be rescheduled.

**Current Situation:**
- Student: ${payload.trainingLevel} level pilot
- Originally scheduled: ${format(payload.scheduledTime, 'MMM d, yyyy h:mm a')}
- Location: ${payload.location.name}
- Reason for cancellation: ${payload.violatedMinimums.join(', ')}
- Current weather: Visibility ${payload.weatherData.visibility}mi, Wind ${payload.weatherData.windSpeed}kt, Conditions: ${payload.weatherData.conditions.join(', ')}

**Weather Minimums for ${payload.trainingLevel} Pilot:**
- Visibility: ${minimums.visibility} miles minimum
- Wind: ${minimums.windSpeed} knots maximum
- Ceiling: ${minimums.ceiling !== null ? minimums.ceiling + ' feet minimum' : 'No minimum'}
- Precipitation: ${minimums.precipitation ? 'Acceptable' : 'Not allowed'}
- Thunderstorms: ${minimums.thunderstorms ? 'Acceptable' : 'Not allowed'}

**Task:**
Generate ${AI_CONFIG.OPTIONS_TO_GENERATE} optimal reschedule options within the next 7 days. Consider:
1. Weather patterns (conditions typically improve/worsen at certain times)
2. Training progression (sooner is better for student momentum)
3. Typical flight school operations (8am-6pm, avoid very early morning)
4. Student availability (weekday mornings or afternoons, weekends)

**Requirements:**
- Each option must be at least 24 hours from original time
- Each option should be at a different day/time to provide variety
- Score based on likelihood of good weather + convenience
- Provide clear, student-friendly reasoning

Generate ${AI_CONFIG.OPTIONS_TO_GENERATE} options now.`;
  }

  /**
   * Validate AI-generated options
   */
  private async validateOptions(
    options: Array<{ proposedTime: string; score: number; reasoning: string }>,
    conflict: WeatherConflictEvent
  ): Promise<RescheduleOption[]> {
    const validOptions: RescheduleOption[] = [];
    const originalTime = conflict.payload.scheduledTime;

    for (const option of options) {
      try {
        const proposedTime = new Date(option.proposedTime);

        // Validation rules
        if (isNaN(proposedTime.getTime())) {
          console.warn('Invalid date:', option.proposedTime);
          continue;
        }

        // Must be in the future
        if (proposedTime <= new Date()) {
          console.warn('Time in past:', option.proposedTime);
          continue;
        }

        // Must be at least 24 hours from original
        const hoursDiff = (proposedTime.getTime() - originalTime.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 24 && hoursDiff > -24) {
          console.warn('Too close to original time:', option.proposedTime);
          continue;
        }

        // Must be within 7 days
        if (hoursDiff > 168) {
          console.warn('Too far in future:', option.proposedTime);
          continue;
        }

        // Mock weather forecast (in real implementation, would call weather API)
        const mockWeatherForecast: WeatherData = {
          visibility: 10,
          ceiling: 5000,
          windSpeed: 8,
          windGust: 12,
          conditions: ['Clear'],
          temperature: 65,
          dewPoint: 50,
          pressure: 30.12,
          humidity: 60,
        };

        validOptions.push({
          id: crypto.randomUUID(),
          conflictEventId: conflict.aggregateId,
          originalBookingId: conflict.payload.bookingId,
          proposedTime,
          weatherForecast: mockWeatherForecast,
          aiScore: option.score,
          aiReasoning: option.reasoning,
          status: 'pending',
          createdAt: new Date(),
        });
      } catch (error) {
        console.error('Error validating option:', error);
        continue;
      }
    }

    // Ensure we have at least 3 valid options
    if (validOptions.length < 3) {
      console.warn('Not enough valid AI options, using fallback');
      return this.fallbackScheduler(conflict);
    }

    // Return top 3 by score
    return validOptions.sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
  }

  /**
   * Fallback scheduler if AI fails
   */
  private fallbackScheduler(conflict: WeatherConflictEvent): RescheduleOption[] {
    const originalTime = conflict.payload.scheduledTime;
    const options: RescheduleOption[] = [];

    // Option 1: Same time tomorrow
    const tomorrow = addDays(originalTime, 1);
    options.push(this.createFallbackOption(conflict, tomorrow, 0.8));

    // Option 2: Same time, 2 days later
    const twoDays = addDays(originalTime, 2);
    options.push(this.createFallbackOption(conflict, twoDays, 0.75));

    // Option 3: Same time, 3 days later
    const threeDays = addDays(originalTime, 3);
    options.push(this.createFallbackOption(conflict, threeDays, 0.7));

    return options;
  }

  /**
   * Create fallback option
   */
  private createFallbackOption(
    conflict: WeatherConflictEvent,
    proposedTime: Date,
    score: number
  ): RescheduleOption {
    const mockWeatherForecast: WeatherData = {
      visibility: 10,
      ceiling: 5000,
      windSpeed: 8,
      windGust: null,
      conditions: ['Clear'],
      temperature: 65,
      dewPoint: 50,
      pressure: 30.12,
      humidity: 60,
    };

    return {
      id: crypto.randomUUID(),
      conflictEventId: conflict.aggregateId,
      originalBookingId: conflict.payload.bookingId,
      proposedTime,
      weatherForecast: mockWeatherForecast,
      aiScore: score,
      aiReasoning: `Rescheduled to ${format(proposedTime, 'EEEE, MMM d')} at the same time. Statistically good weather probability for this time.`,
      status: 'pending',
      createdAt: new Date(),
    };
  }
}

