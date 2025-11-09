# Technical Context

## Technology Stack

### Frontend
- **React 18+**: UI framework
- **TypeScript 5+**: Type safety
- **Vite**: Build tool and dev server
- **TanStack Query (React Query)**: Server state management
- **Zustand**: Client state management
- **TailwindCSS**: Styling
- **Recharts**: Data visualization for dashboard
- **React Router**: Navigation
- **date-fns**: Date manipulation

### Backend
- **Node.js 20+**: Runtime
- **TypeScript 5+**: Type safety
- **Vercel Serverless Functions**: API endpoints (serverless)
- **Prisma**: ORM and database toolkit
- **Zod**: Runtime validation
- **tsx**: TypeScript execution for development

### AI/ML
- **Vercel AI SDK 3+**: AI integration framework
- **OpenAI GPT-4 Turbo**: Primary AI model
- **Zod**: Schema validation for AI outputs

### Database
- **Supabase PostgreSQL**: Managed PostgreSQL (free tier: 500MB)
- **Prisma**: ORM with type-safe queries
- **Supabase Realtime**: Real-time subscriptions for dashboard updates

### Message Queue / Event Bus
- **Upstash Redis**: Serverless Redis for job queue (free tier: 10K commands/day)
- **BullMQ**: Job queue library (built on Redis)
- **Alternative**: Database-backed queue (simpler, no external dependency)

### External APIs
- **OpenWeatherMap API**: Weather data
  - Endpoint: One Call API 3.0
  - Rate Limit: 1,000 calls/day (free tier)
  - Cost: FREE
- **Resend**: Email notifications
  - Free tier: 3,000 emails/month
  - Better DX than Sendgrid
  - Cost: FREE
- **Twilio**: SMS notifications (bonus feature, pay-as-you-go)

### Cloud Infrastructure (FREE Stack)
- **Vercel**: 
  - Frontend hosting (free tier: unlimited bandwidth)
  - Serverless Functions for API (free: 100GB-hours/month)
  - Edge Functions (optional, for low latency)
  - Environment variables (secure secrets)
- **Supabase**:
  - PostgreSQL database (free: 500MB storage)
  - Realtime subscriptions (free: 200 concurrent connections)
  - Automatic backups (7 days retention on free tier)
  - Cost: FREE (upgrade to $25/mo if needed)
- **Upstash**:
  - Redis for job queue (free: 10K commands/day)
  - QStash for scheduled jobs (free: 500 messages/day)
  - Cost: FREE
- **GitHub Actions**:
  - Scheduled cron jobs (free: 2,000 minutes/month)
  - Alternative to Upstash QStash
  - Cost: FREE

### Estimated Monthly Costs
- **Vercel**: $0 (free tier sufficient)
- **Supabase**: $0 (free tier: 500MB database)
- **Upstash**: $0 (free tier sufficient)
- **OpenAI API**: ~$5-10 (depends on usage, ~$0.01 per reschedule)
- **Resend**: $0 (free: 3,000 emails/month)
- **OpenWeatherMap**: $0 (free: 1,000 calls/day)
- **Total**: ~$5-10/month (just AI costs)

### Development Tools
- **pnpm**: Package manager
- **ESLint**: Linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **Docker**: Local development environment
- **Docker Compose**: Multi-service orchestration

## Project Structure (Vercel + Supabase)

```
FSP/
├── apps/
│   └── web/                    # React + Vercel Functions (Full-stack)
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── hooks/          # Custom hooks
│       │   ├── lib/            # Utilities and clients
│       │   │   ├── supabase.ts     # Supabase client
│       │   │   ├── openai.ts       # AI SDK client
│       │   │   └── queue.ts        # Job queue client
│       │   ├── services/       # Business logic (shared with API)
│       │   ├── types/          # TypeScript types
│       │   └── App.tsx
│       ├── api/                # Vercel Serverless Functions
│       │   ├── bookings/
│       │   │   ├── index.ts        # GET /api/bookings
│       │   │   └── [id].ts         # GET /api/bookings/:id
│       │   ├── weather/
│       │   │   └── check.ts        # POST /api/weather/check
│       │   ├── reschedule/
│       │   │   └── generate.ts     # POST /api/reschedule/generate
│       │   └── cron/
│       │       └── weather-check.ts # Cron job endpoint
│       ├── package.json
│       ├── vite.config.ts
│       └── vercel.json         # Vercel configuration
│
├── packages/
│   ├── shared/                 # Shared code
│   │   ├── src/
│   │   │   ├── types/          # Shared types
│   │   │   ├── schemas/        # Zod schemas
│   │   │   ├── constants/      # Constants (weather minimums, etc.)
│   │   │   └── utils/          # Shared utilities
│   │   └── package.json
│   │
│   └── database/               # Database package (Prisma + Supabase)
│       ├── prisma/
│       │   ├── schema.prisma   # Points to Supabase PostgreSQL
│       │   └── migrations/
│       ├── src/
│       │   ├── client.ts       # Prisma client
│       │   └── repositories/   # Repository pattern
│       └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Tests and linting
│       └── weather-cron.yml    # GitHub Actions cron (alternative)
│
├── memory-bank/                # Project documentation
├── docs/                       # Additional documentation
├── .cursor/rules/              # Cursor AI rules
├── pnpm-workspace.yaml
├── .env.template
├── .env.local                  # Local development (not committed)
├── .gitignore
├── README.md
└── package.json
```

## Development Setup

### Prerequisites
```bash
# Required
node >= 20.0.0
pnpm >= 8.0.0
docker >= 24.0.0
docker-compose >= 2.0.0

# Optional
azure-cli (for Azure deployment)
```

### Environment Variables

**`.env.template`** (copy to `.env.local` for local development):
```bash
# Supabase (Get from https://supabase.com/dashboard/project/_/settings/database)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Upstash Redis (Get from https://console.upstash.com)
UPSTASH_REDIS_REST_URL="https://[name].upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"

# Upstash QStash (for scheduled jobs)
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="your_qstash_token"
QSTASH_CURRENT_SIGNING_KEY="your_signing_key"
QSTASH_NEXT_SIGNING_KEY="your_next_key"

# Weather API (Get from https://openweathermap.org/api)
OPENWEATHER_API_KEY="your_key_here"

# AI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-your_key_here"

# Email (Get from https://resend.com/api-keys)
RESEND_API_KEY="re_your_key_here"

# Twilio (Optional - Bonus SMS feature)
TWILIO_ACCOUNT_SID="your_sid_here"
TWILIO_AUTH_TOKEN="your_token_here"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cron Secret (for securing cron endpoints)
CRON_SECRET="generate_random_string_here"

# Feature Flags
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_AI_LEARNING=false
```

### Getting Free API Keys

1. **Supabase** (FREE):
   - Sign up at https://supabase.com
   - Create new project
   - Get DATABASE_URL from Settings > Database
   - Get API keys from Settings > API

2. **Upstash** (FREE):
   - Sign up at https://upstash.com
   - Create Redis database
   - Create QStash account for scheduled jobs
   - Copy credentials

3. **OpenWeatherMap** (FREE):
   - Sign up at https://openweathermap.org
   - Get API key (free tier: 1,000 calls/day)

4. **OpenAI** (Pay-as-you-go ~$5-10/month):
   - Sign up at https://platform.openai.com
   - Add payment method
   - Generate API key
   - Set usage limits to control costs

5. **Resend** (FREE):
   - Sign up at https://resend.com
   - Get API key (free: 3,000 emails/month)

### Local Development Setup

```bash
# 1. Clone and install
git clone <repo>
cd FSP
pnpm install

# 2. Set up environment variables
cp .env.template .env.local
# Edit .env.local with your API keys

# 3. Set up Supabase
# - Create project at https://supabase.com
# - Copy DATABASE_URL to .env.local
# - Or use local Supabase (see below)

# 4. Setup database
cd packages/database
pnpm prisma migrate dev
pnpm prisma db seed

# 5. Start development server
cd ../..
pnpm dev

# Access:
# - Full-stack app: http://localhost:3000
# - API routes: http://localhost:3000/api/*
```

### Optional: Local Supabase (Docker)

If you prefer local development without cloud Supabase:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# This starts:
# - PostgreSQL on localhost:54322
# - Supabase Studio on http://localhost:54323
# - API on http://localhost:54321

# Update .env.local to point to local instance
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
```

### Alternative: Simple Docker for Local DB Only

```yaml
# docker-compose.yml (optional - if not using Supabase)
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fsp_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start just PostgreSQL
docker-compose up -d

# Update .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fsp_dev"
```

## Database Schema (Prisma)

### Core Models

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TrainingLevel {
  STUDENT
  PRIVATE
  INSTRUMENT
}

enum BookingStatus {
  SCHEDULED
  WEATHER_HOLD
  CANCELED
  RESCHEDULED
  COMPLETED
}

model Student {
  id            String        @id @default(uuid())
  name          String
  email         String        @unique
  phone         String?
  trainingLevel TrainingLevel
  bookings      Booking[]
  notifications Notification[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Location {
  id        String    @id @default(uuid())
  name      String
  latitude  Decimal   @db.Decimal(9, 6)
  longitude Decimal   @db.Decimal(9, 6)
  timezone  String
  
  departureBookings   Booking[] @relation("DepartureLocation")
  destinationBookings Booking[] @relation("DestinationLocation")
  weatherChecks       WeatherCheck[]
}

model Booking {
  id                    String        @id @default(uuid())
  studentId             String
  instructorId          String
  aircraftId            String
  departureLocationId   String
  destinationLocationId String?
  scheduledTime         DateTime
  durationMinutes       Int
  status                BookingStatus @default(SCHEDULED)
  originalBookingId     String?
  
  student              Student    @relation(fields: [studentId], references: [id])
  instructor           Instructor @relation(fields: [instructorId], references: [id])
  aircraft             Aircraft   @relation(fields: [aircraftId], references: [id])
  departureLocation    Location   @relation("DepartureLocation", fields: [departureLocationId], references: [id])
  destinationLocation  Location?  @relation("DestinationLocation", fields: [destinationLocationId], references: [id])
  originalBooking      Booking?   @relation("RescheduleChain", fields: [originalBookingId], references: [id])
  
  reschedules        Booking[]          @relation("RescheduleChain")
  weatherChecks      WeatherCheck[]
  rescheduleOptions  RescheduleOption[]
  notifications      Notification[]
  events             Event[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([scheduledTime])
  @@index([studentId])
  @@index([status])
}

model WeatherCheck {
  id              String   @id @default(uuid())
  bookingId       String
  locationId      String
  checkTime       DateTime @default(now())
  forecastTime    DateTime
  visibilityMiles Decimal  @db.Decimal(5, 2)
  ceilingFeet     Int?
  windSpeedKnots  Int
  windGustKnots   Int?
  conditions      Json
  rawData         Json
  isSafe          Boolean
  violatedMinimums String[]
  
  booking  Booking  @relation(fields: [bookingId], references: [id])
  location Location @relation(fields: [locationId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@index([bookingId])
  @@index([checkTime])
}

model RescheduleOption {
  id                String   @id @default(uuid())
  conflictEventId   String
  originalBookingId String
  proposedTime      DateTime
  weatherForecast   Json
  aiScore           Decimal  @db.Decimal(3, 2)
  aiReasoning       String
  status            String   @default("pending")
  
  originalBooking Booking @relation(fields: [originalBookingId], references: [id])
  
  createdAt DateTime @default(now())
}

model Event {
  id            String   @id @default(uuid())
  eventType     String
  aggregateId   String
  aggregateType String
  payload       Json
  metadata      Json?
  
  booking   Booking? @relation(fields: [aggregateId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@index([aggregateType, aggregateId])
  @@index([eventType])
  @@index([createdAt])
}

model Notification {
  id               String    @id @default(uuid())
  recipientId      String
  channel          String
  type             String
  subject          String?
  body             String
  status           String    @default("pending")
  sentAt           DateTime?
  retryCount       Int       @default(0)
  errorMessage     String?
  relatedBookingId String?
  
  recipient      Student  @relation(fields: [recipientId], references: [id])
  relatedBooking Booking? @relation(fields: [relatedBookingId], references: [id])
  
  createdAt DateTime @default(now())
}

// Additional models for complete system
model Instructor {
  id       String    @id @default(uuid())
  name     String
  email    String    @unique
  phone    String?
  bookings Booking[]
}

model Aircraft {
  id           String    @id @default(uuid())
  registration String    @unique
  model        String
  bookings     Booking[]
}
```

## API Endpoints

### RESTful API Design

```typescript
// Booking endpoints
GET    /api/bookings              # List bookings (with filters)
GET    /api/bookings/:id          # Get booking details
POST   /api/bookings              # Create new booking
PATCH  /api/bookings/:id          # Update booking
DELETE /api/bookings/:id          # Cancel booking

// Weather endpoints
GET    /api/weather/current/:locationId     # Current weather
GET    /api/weather/forecast/:locationId    # Forecast
GET    /api/weather/checks/:bookingId       # Weather checks for booking

// Reschedule endpoints
GET    /api/reschedules/:bookingId          # Get reschedule options
POST   /api/reschedules/:bookingId/confirm  # Confirm reschedule option

// Dashboard endpoints
GET    /api/dashboard/alerts       # Active weather alerts
GET    /api/dashboard/upcoming     # Upcoming flights
GET    /api/dashboard/metrics      # System metrics

// Student endpoints
GET    /api/students              # List students
GET    /api/students/:id          # Get student details
POST   /api/students              # Create student
PATCH  /api/students/:id          # Update student

// WebSocket endpoint
WS     /api/ws                    # Real-time updates
```

## External API Integration

### OpenWeatherMap API

```typescript
// Weather API Service
class OpenWeatherMapService {
  private baseUrl = 'https://api.openweathermap.org/data/3.0';
  
  async getWeatherForecast(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseUrl}/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
    );
    return this.parseResponse(await response.json());
  }
  
  private parseResponse(data: any): WeatherData {
    return {
      visibility: data.current.visibility / 5280, // meters to miles
      ceiling: this.estimateCeiling(data.current.clouds),
      windSpeed: data.current.wind_speed,
      windGust: data.current.wind_gust,
      conditions: [data.current.weather[0].main],
      temperature: data.current.temp,
      dewPoint: data.current.dew_point,
      pressure: data.current.pressure,
      humidity: data.current.humidity
    };
  }
}
```

### Vercel AI SDK Integration

```typescript
// AI Service for rescheduling
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const rescheduleOptionSchema = z.object({
  options: z.array(z.object({
    proposedTime: z.string(),
    weatherForecast: z.object({
      visibility: z.number(),
      windSpeed: z.number(),
      conditions: z.array(z.string())
    }),
    score: z.number().min(0).max(1),
    reasoning: z.string()
  }))
});

class AIReschedulingService {
  async generateOptions(conflict: WeatherConflict): Promise<RescheduleOption[]> {
    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: rescheduleOptionSchema,
      prompt: this.buildPrompt(conflict),
      temperature: 0.7
    });
    
    return object.options;
  }
}
```

## Testing Strategy

### Unit Tests (Vitest)
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

### E2E Tests (Playwright)
```bash
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Interactive UI mode
```

### Test Structure
```
__tests__/
├── unit/
│   ├── services/
│   │   ├── weather.test.ts
│   │   ├── ai.test.ts
│   │   └── booking.test.ts
│   └── utils/
│       └── safety-logic.test.ts
├── integration/
│   ├── api/
│   │   └── bookings.test.ts
│   └── database/
│       └── repositories.test.ts
└── e2e/
    ├── weather-conflict.spec.ts
    └── reschedule-flow.spec.ts
```

## Deployment (Vercel + Supabase)

### Vercel Deployment (Recommended - FREE)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd apps/web
vercel deploy --prod

# 3. Set environment variables in Vercel dashboard
# - Go to Project Settings > Environment Variables
# - Add all variables from .env.template
```

### Vercel Dashboard Setup

1. **Import from GitHub**:
   - Connect your GitHub repository
   - Vercel auto-detects framework (React/Vite)
   - Set root directory to `apps/web`

2. **Environment Variables**:
   - Add all from .env.template
   - Mark sensitive ones as "Encrypted"

3. **Cron Jobs** (Vercel Pro $20/mo OR use GitHub Actions):
   ```json
   // vercel.json
   {
     "crons": [{
       "path": "/api/cron/weather-check",
       "schedule": "0 * * * *"
     }]
   }
   ```

### Alternative: GitHub Actions Cron (FREE)

```yaml
# .github/workflows/weather-cron.yml
name: Weather Check Cron
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  check-weather:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Weather Check
        run: |
          curl -X POST https://your-app.vercel.app/api/cron/weather-check \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Using Upstash QStash for Cron (FREE alternative)

```typescript
// No code needed - configure in Upstash dashboard
// Schedule: https://console.upstash.com/qstash
// URL: https://your-app.vercel.app/api/cron/weather-check
// Schedule: 0 * * * * (every hour)
```

## Performance Targets

- API Response Time: < 200ms (p95)
- Weather Check Cycle: < 5 minutes
- AI Generation Time: < 30 seconds
- Dashboard Load Time: < 2 seconds
- Database Query Time: < 50ms (p95)

## Security Considerations

1. **API Keys**: Store in Azure Key Vault or environment variables
2. **Database**: Use connection pooling, parameterized queries
3. **Authentication**: JWT tokens (for future user auth)
4. **Rate Limiting**: Implement on all public endpoints
5. **Input Validation**: Zod schemas for all inputs
6. **CORS**: Restrict to known origins

## Monitoring & Observability

- **Logging**: Structured JSON logs (Winston or Pino)
- **Metrics**: Custom metrics for key operations
- **Error Tracking**: Sentry integration
- **Uptime Monitoring**: Weather API and database health checks
- **Alerts**: Critical failures trigger notifications

