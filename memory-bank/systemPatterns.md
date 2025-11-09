# System Patterns & Architecture

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Dashboard                          │
│  (Weather Alerts, Flight Status, Reschedule Approvals)          │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API / WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│                    (Express/Next.js API)                         │
└─────┬──────────────────┬─────────────────┬──────────────────────┘
      │                  │                 │
      ▼                  ▼                 ▼
┌──────────┐    ┌─────────────┐    ┌─────────────┐
│ Weather  │    │  Booking    │    │    AI       │
│ Service  │    │  Service    │    │  Service    │
└────┬─────┘    └──────┬──────┘    └──────┬──────┘
     │                 │                   │
     ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Event Bus (Azure Service Bus / RabbitMQ)    │
│  Events: WeatherConflictDetected, RescheduleGenerated,          │
│          BookingCanceled, RescheduleConfirmed                    │
└─────────────────────────────────────────────────────────────────┘
     │                 │                   │
     ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                         │
│  Tables: students, bookings, weather_checks, reschedules,       │
│          notifications, locations                                │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Background Scheduler (Azure Functions / Node-cron)              │
│  Job: Check weather for next 24-48 hours (runs hourly)          │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│  External Services: OpenWeatherMap API, Notification Provider    │
└─────────────────────────────────────────────────────────────────┘
```

## Design Pattern: Event-Driven Architecture

### Why Event-Driven?
- **Decoupling**: Services don't need to know about each other
- **Scalability**: Easy to add new event handlers
- **Reliability**: Events can be retried if processing fails
- **Auditability**: Complete event log for troubleshooting

### Core Events

#### 1. WeatherConflictDetected
```typescript
{
  eventType: 'WeatherConflictDetected',
  timestamp: Date,
  bookingId: string,
  studentId: string,
  instructorId: string,
  scheduledTime: Date,
  location: {
    departure: { lat, lon, name },
    destination?: { lat, lon, name }
  },
  weatherData: {
    visibility: number,
    ceiling: number,
    windSpeed: number,
    conditions: string[]
  },
  trainingLevel: 'student' | 'private' | 'instrument',
  violatedMinimums: string[],
  severity: 'critical' | 'marginal'
}
```

**Triggered By**: Weather Service detecting unsafe conditions  
**Handlers**:
- AI Service: Generate reschedule options
- Notification Service: Alert student and instructor
- Booking Service: Update status to 'weather-hold'

#### 2. RescheduleOptionsGenerated
```typescript
{
  eventType: 'RescheduleOptionsGenerated',
  timestamp: Date,
  originalBookingId: string,
  options: [
    {
      optionId: string,
      proposedTime: Date,
      weatherForecast: WeatherData,
      score: number,
      reasoning: string
    }
  ],
  aiModel: string,
  generationTime: number
}
```

**Triggered By**: AI Service completing analysis  
**Handlers**:
- Notification Service: Send options to student
- Dashboard Service: Update UI with pending decision

#### 3. RescheduleConfirmed
```typescript
{
  eventType: 'RescheduleConfirmed',
  timestamp: Date,
  originalBookingId: string,
  newBookingId: string,
  selectedOption: {
    optionId: string,
    newTime: Date
  },
  confirmedBy: string, // studentId or schedulerId
  confirmationMethod: 'student-select' | 'scheduler-override'
}
```

**Triggered By**: Student selecting option or scheduler approval  
**Handlers**:
- Booking Service: Create new booking, cancel old one
- Notification Service: Confirm to all parties
- Analytics Service: Log metrics

#### 4. NotificationSent
```typescript
{
  eventType: 'NotificationSent',
  timestamp: Date,
  notificationId: string,
  recipientId: string,
  channel: 'email' | 'sms' | 'in-app',
  type: 'conflict' | 'reschedule-options' | 'confirmation',
  status: 'sent' | 'failed',
  retryCount: number
}
```

## Service Architecture Patterns

### 1. Weather Service

**Responsibility**: Monitor weather and detect conflicts

**Pattern**: Repository + Service Layer

```typescript
// Repository Pattern
class WeatherRepository {
  async getWeatherForLocation(lat: number, lon: number, time: Date): Promise<WeatherData>
  async cacheWeatherData(location: Location, weather: WeatherData): Promise<void>
  async getWeatherHistory(location: Location, hours: number): Promise<WeatherData[]>
}

// Service Layer
class WeatherService {
  async checkFlightSafety(booking: Booking): Promise<SafetyCheck>
  async monitorUpcomingFlights(): Promise<ConflictReport[]>
  private async evaluateSafety(weather: WeatherData, trainingLevel: string): boolean
  private async applyWeatherMinimums(weather: WeatherData, minimums: WeatherMinimums): boolean
}
```

**Key Decisions**:
- Cache weather data for 30 minutes to reduce API calls
- Use pessimistic approach: flag marginal conditions
- Check 3 time points: departure, mid-flight, arrival
- Store raw weather data for audit trail

### 2. AI Service

**Responsibility**: Generate optimal reschedule options

**Pattern**: Strategy Pattern + AI SDK Integration

```typescript
// Strategy for different AI approaches
interface ReschedulingStrategy {
  generateOptions(conflict: WeatherConflict, constraints: Constraints): Promise<RescheduleOption[]>
}

class AISDKReschedulingStrategy implements ReschedulingStrategy {
  async generateOptions(conflict: WeatherConflict, constraints: Constraints) {
    // Use Vercel AI SDK with structured output
    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: rescheduleOptionsSchema,
      prompt: this.buildPrompt(conflict, constraints)
    });
    return object.options;
  }
}

class AIService {
  private strategy: ReschedulingStrategy;
  
  async generateRescheduleOptions(conflict: WeatherConflict): Promise<RescheduleOption[]> {
    const constraints = await this.gatherConstraints(conflict);
    const options = await this.strategy.generateOptions(conflict, constraints);
    return this.validateAndRankOptions(options);
  }
  
  private async validateAndRankOptions(options: RescheduleOption[]): Promise<RescheduleOption[]> {
    // Business rule validation
    // Weather forecast validation
    // Availability validation
    // Ranking by score
  }
}
```

**Key Decisions**:
- Use structured output (not free-form text) for reliability
- Validate all AI suggestions against business rules
- Generate 5 options, return top 3 after validation
- Include AI reasoning for transparency
- Timeout after 30 seconds, use fallback simple algorithm

### 3. Booking Service

**Responsibility**: Manage flight booking lifecycle

**Pattern**: Domain-Driven Design + State Machine

```typescript
// State Machine for Booking Status
enum BookingStatus {
  SCHEDULED = 'scheduled',
  WEATHER_HOLD = 'weather-hold',
  CANCELED = 'canceled',
  RESCHEDULED = 'rescheduled',
  COMPLETED = 'completed'
}

// Allowed transitions
const ALLOWED_TRANSITIONS = {
  [BookingStatus.SCHEDULED]: [BookingStatus.WEATHER_HOLD, BookingStatus.COMPLETED, BookingStatus.CANCELED],
  [BookingStatus.WEATHER_HOLD]: [BookingStatus.CANCELED, BookingStatus.RESCHEDULED, BookingStatus.SCHEDULED],
  [BookingStatus.RESCHEDULED]: [],
  [BookingStatus.CANCELED]: [],
  [BookingStatus.COMPLETED]: []
};

class Booking {
  private status: BookingStatus;
  
  transitionTo(newStatus: BookingStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new InvalidTransitionError();
    }
    this.status = newStatus;
    this.emitEvent(new BookingStatusChangedEvent());
  }
  
  private canTransitionTo(newStatus: BookingStatus): boolean {
    return ALLOWED_TRANSITIONS[this.status].includes(newStatus);
  }
}

class BookingService {
  async createBooking(data: BookingData): Promise<Booking>
  async cancelBooking(bookingId: string, reason: string): Promise<void>
  async rescheduleBooking(oldBookingId: string, newTime: Date): Promise<Booking>
  async getUpcomingBookings(hoursAhead: number): Promise<Booking[]>
}
```

**Key Decisions**:
- Immutable booking history (never delete, only mark as rescheduled)
- Link rescheduled bookings to original for tracking
- Use database transactions for status changes
- Store reason for every cancellation/reschedule

### 4. Notification Service

**Responsibility**: Deliver messages reliably

**Pattern**: Template Method + Retry Logic

```typescript
abstract class NotificationChannel {
  async send(notification: Notification): Promise<void> {
    try {
      await this.validate(notification);
      await this.deliver(notification);
      await this.logSuccess(notification);
    } catch (error) {
      await this.handleError(notification, error);
    }
  }
  
  protected abstract deliver(notification: Notification): Promise<void>;
  protected abstract validate(notification: Notification): Promise<void>;
  
  protected async handleError(notification: Notification, error: Error): Promise<void> {
    if (this.shouldRetry(notification)) {
      await this.scheduleRetry(notification);
    } else {
      await this.logFailure(notification, error);
    }
  }
}

class EmailNotificationChannel extends NotificationChannel {
  protected async deliver(notification: Notification): Promise<void> {
    // Send via email provider
  }
}

class NotificationService {
  private channels: Map<string, NotificationChannel>;
  
  async notifyWeatherConflict(conflict: WeatherConflict): Promise<void> {
    const notifications = this.buildConflictNotifications(conflict);
    await Promise.all(notifications.map(n => this.send(n)));
  }
  
  private async send(notification: Notification): Promise<void> {
    const channel = this.channels.get(notification.channel);
    await channel.send(notification);
  }
}
```

**Key Decisions**:
- Retry failed notifications up to 3 times with exponential backoff
- Support multiple channels (email, SMS, in-app)
- Template-based message generation
- Track delivery status in database
- Use notification queue for async processing

## Data Architecture

### Database Schema Design

**Principle**: Normalized design with event sourcing for history

```sql
-- Students with training levels
CREATE TABLE students (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  training_level VARCHAR NOT NULL CHECK (training_level IN ('student', 'private', 'instrument')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Locations for weather monitoring
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  timezone VARCHAR NOT NULL
);

-- Bookings (core entity)
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  instructor_id UUID REFERENCES instructors(id),
  aircraft_id UUID REFERENCES aircraft(id),
  departure_location_id UUID REFERENCES locations(id),
  destination_location_id UUID REFERENCES locations(id),
  scheduled_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status VARCHAR NOT NULL,
  original_booking_id UUID REFERENCES bookings(id), -- If this is a reschedule
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_scheduled_time (scheduled_time),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status)
);

-- Weather checks (audit trail)
CREATE TABLE weather_checks (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  location_id UUID REFERENCES locations(id),
  check_time TIMESTAMP NOT NULL,
  forecast_time TIMESTAMP NOT NULL,
  visibility_miles DECIMAL(5,2),
  ceiling_feet INTEGER,
  wind_speed_knots INTEGER,
  wind_gust_knots INTEGER,
  conditions JSONB, -- Array of condition strings
  raw_data JSONB, -- Full API response
  is_safe BOOLEAN NOT NULL,
  violated_minimums TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_booking_id (booking_id),
  INDEX idx_check_time (check_time)
);

-- Reschedule options (AI generated)
CREATE TABLE reschedule_options (
  id UUID PRIMARY KEY,
  conflict_event_id UUID NOT NULL,
  original_booking_id UUID REFERENCES bookings(id),
  proposed_time TIMESTAMP NOT NULL,
  weather_forecast JSONB,
  ai_score DECIMAL(3,2),
  ai_reasoning TEXT,
  status VARCHAR NOT NULL, -- 'pending', 'selected', 'rejected'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events (event sourcing)
CREATE TABLE events (
  id UUID PRIMARY KEY,
  event_type VARCHAR NOT NULL,
  aggregate_id UUID NOT NULL, -- booking_id, student_id, etc.
  aggregate_type VARCHAR NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_aggregate (aggregate_type, aggregate_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
);

-- Notifications (tracking)
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  recipient_id UUID NOT NULL,
  channel VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  subject VARCHAR,
  body TEXT NOT NULL,
  status VARCHAR NOT NULL,
  sent_at TIMESTAMP,
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  related_booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Design Decisions

1. **UUID Primary Keys**: For distributed system compatibility and security
2. **Event Sourcing**: Full audit trail via events table
3. **Immutable History**: Never delete bookings, link reschedules to originals
4. **JSONB for Flexibility**: Weather data and event payloads can evolve
5. **Comprehensive Indexing**: Optimize for time-based queries
6. **Status Enums**: Enforce valid states at database level

## Component Relationships

### Dependency Graph

```
Dashboard (React)
  ↓ depends on
API Gateway
  ↓ depends on
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Weather   │   Booking   │     AI      │Notification │
│   Service   │   Service   │   Service   │  Service    │
└─────────────┴─────────────┴─────────────┴─────────────┘
  ↓ depends on
Event Bus
  ↓ depends on
Database & External APIs
```

### Communication Patterns

1. **Synchronous (REST)**: Dashboard ↔ API Gateway
2. **Asynchronous (Events)**: Service ↔ Service via Event Bus
3. **Polling**: Background Scheduler → Weather Service
4. **Push (WebSocket)**: API Gateway → Dashboard for real-time updates

## Technology Decisions

### TypeScript Throughout
**Why**: Type safety prevents runtime errors, improves developer experience

### React for Frontend
**Why**: Component-based, large ecosystem, good for real-time dashboards

### PostgreSQL for Database
**Why**: 
- ACID compliance for booking integrity
- JSONB for flexible weather data
- Excellent TypeScript support via Prisma/TypeORM
- Advanced indexing for time-series queries

### Azure Service Bus (or RabbitMQ)
**Why**:
- Reliable message delivery
- Dead-letter queues for failed events
- Azure integration if using Azure Functions
- Alternative: RabbitMQ for local development

### Vercel AI SDK (or LangGraph)
**Why**:
- Structured output support
- Type-safe AI responses
- Easy model switching
- Good documentation
- Alternative: LangGraph for more complex workflows

### OpenWeatherMap API
**Why**:
- Free tier sufficient for development
- Historical weather data
- Aviation-relevant metrics
- Good forecast accuracy
- Alternative: WeatherAPI.com

### Azure Functions (or Node-cron)
**Why**:
- Serverless scheduling
- Automatic scaling
- Pay-per-execution
- Alternative: Node-cron for simpler deployment

## Design Patterns Summary

| Pattern | Used In | Purpose |
|---------|---------|---------|
| Event-Driven | System-wide | Decouple services, enable scalability |
| Repository | Data access | Abstract database operations |
| Service Layer | All services | Business logic encapsulation |
| Strategy | AI Service | Swap AI providers/algorithms |
| State Machine | Booking | Enforce valid status transitions |
| Template Method | Notifications | Consistent notification flow |
| Factory | Service creation | Manage service dependencies |
| Observer | Event handlers | React to domain events |

## Error Handling Strategy

1. **Graceful Degradation**: If AI fails, use simple scheduling algorithm
2. **Circuit Breaker**: If weather API fails repeatedly, use cached data
3. **Retry Logic**: Exponential backoff for transient failures
4. **Dead Letter Queue**: Capture failed events for manual review
5. **Logging**: Comprehensive structured logging for troubleshooting
6. **Alerting**: Notify on critical failures (weather service down, etc.)

## Performance Considerations

1. **Caching**: Weather data cached for 30 minutes
2. **Batch Processing**: Check multiple flights per weather API call
3. **Async Processing**: Events handled asynchronously
4. **Database Indexing**: Optimize time-based queries
5. **Connection Pooling**: Reuse database connections
6. **Rate Limiting**: Respect weather API limits

