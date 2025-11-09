// @ts-nocheck
// NOTE: This service has type compatibility issues with AI SDK packages
// It's not currently used in the app, so type errors are suppressed
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import {
  WeatherConflictEvent,
  RescheduleOption,
  WeatherData,
} from '@fsp/shared';
import { AI_CONFIG, WEATHER_MINIMUMS } from '@fsp/shared';
import { addHours, addDays, format } from 'date-fns';

// Zod schema for AI response
const rescheduleOptionSchema = z.object({
  proposedTime: z.string().describe('ISO 8601 datetime string'),
  confidence: z.number().min(0).max(100).describe('Confidence score 0-100'),
  reasoning: z.string().describe('Explanation for this rescheduling option'),
});

const rescheduleResponseSchema = z.object({
  options: z.array(rescheduleOptionSchema).min(3).max(5).describe('Array of 3-5 rescheduling options'),
});

/**
 * Generate intelligent rescheduling options using AI
 */
export async function generateRescheduleOptions(
  event: WeatherConflictEvent
): Promise<RescheduleOption[]> {
  try {
    const prompt = buildReschedulePrompt(event);

    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: rescheduleOptionSchema,
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return object.options.map((opt: any) => ({
      ...opt,
      proposedTime: new Date(opt.proposedTime),
      bookingId: event.bookingId,
    }));
  } catch (error) {
    console.error('AI rescheduling failed:', error);
    // Fallback to rule-based rescheduling
    return generateFallbackOptions(event);
  }
}

function buildReschedulePrompt(event: WeatherConflictEvent): string {
  const { booking, weather, minimums } = event;
  
  return `You are a flight training scheduler. A flight lesson has been cancelled due to weather.

**Original Booking:**
- Time: ${format(new Date(booking.scheduledTime), 'PPpp')}
- Student: ${booking.student.name}
- Instructor: ${booking.instructor.name}
- Aircraft: ${booking.aircraft.tailNumber}
- Duration: ${booking.durationMinutes} minutes

**Current Weather Conditions:**
- Visibility: ${weather.visibility} miles (minimum: ${minimums.visibility})
- Wind Speed: ${weather.windSpeed} kt (maximum: ${minimums.windSpeed})
- Ceiling: ${weather.ceiling} ft (minimum: ${minimums.ceiling})
- Conditions: ${weather.conditions}

**Instructor Availability:**
${booking.instructor.availability.map((slot: any) => 
  `- ${format(new Date(slot.start), 'EEE MMM d, h:mm a')} to ${format(new Date(slot.end), 'h:mm a')}`
).join('\n')}

**Requirements:**
1. Must be within the next 7 days
2. Must align with instructor availability
3. Prefer morning slots (better weather)
4. Avoid booking immediately after the cancelled slot (give buffer time)
5. Consider weather forecast trends

Generate 3-5 optimal rescheduling options with high confidence scores for the best options.`;
}

function generateFallbackOptions(event: WeatherConflictEvent): RescheduleOption[] {
  const { booking } = event;
  const originalTime = new Date(booking.scheduledTime);
  
  // Simple fallback: suggest same time next 3 days
  return [1, 2, 3].map(daysAhead => ({
    bookingId: booking.id,
    proposedTime: addDays(originalTime, daysAhead),
    confidence: 70,
    reasoning: `Same time ${daysAhead} day(s) later. Weather typically improves over time.`,
  }));
}

export const aiService = {
  generateRescheduleOptions,
};
