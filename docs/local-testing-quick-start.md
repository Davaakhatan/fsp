# Local Testing Quick Start Guide

This guide will help you test the Flight Schedule Pro application locally before deploying to Vercel.

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Git (already set up)

## Step 1: Install Dependencies

```bash
cd /Users/davaakhatanzorigtbaatar/Downloads/Private/2024/2025/CLassboxes/Gauntlet\ AI/Projects/FSP
pnpm install
```

## Step 2: Get API Keys

You'll need to sign up for these **FREE** services and get API keys:

### 1. Supabase (Database)
- Go to: https://supabase.com
- Create a new project
- Wait ~2 minutes for it to initialize
- Go to Project Settings → API
- Copy:
  - `Project URL` → `VITE_SUPABASE_URL`
  - `anon/public key` → `VITE_SUPABASE_ANON_KEY`
- Go to Project Settings → Database
- Copy the connection string → `DATABASE_URL`
  - Format: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

### 2. OpenWeatherMap (Weather Data)
- Go to: https://openweathermap.org/api
- Sign up for free account
- Go to API Keys section
- Copy your API key → `VITE_OPENWEATHER_API_KEY`
- **Note**: New keys take ~2 hours to activate

### 3. OpenAI (AI Rescheduling)
- Go to: https://platform.openai.com
- Sign up (you get $5 free credit)
- Go to API Keys
- Create new key → `OPENAI_API_KEY`

### 4. Resend (Email Notifications)
- Go to: https://resend.com
- Sign up for free (100 emails/day)
- Create API Key → `RESEND_API_KEY`

## Step 3: Create `.env.local` File

Create the file at `apps/web/.env.local`:

```bash
cd apps/web
cp .env.example .env.local
```

Then edit `apps/web/.env.local` with your actual API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Configuration
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# OpenWeatherMap API
VITE_OPENWEATHER_API_KEY=your-actual-api-key-here

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## Step 4: Set Up Database

Run Prisma migrations to create your database tables:

```bash
cd /Users/davaakhatanzorigtbaatar/Downloads/Private/2024/2025/CLassboxes/Gauntlet\ AI/Projects/FSP

# Generate Prisma Client
pnpm --filter @fsp/database prisma generate

# Push schema to database
pnpm --filter @fsp/database prisma db push

# (Optional) Seed with sample data
pnpm --filter @fsp/database db:seed
```

## Step 5: Build Shared Packages

Build the shared packages before running the web app:

```bash
# Build shared types and utilities
pnpm --filter @fsp/shared build

# Build database package (generates Prisma client)
pnpm --filter @fsp/database build
```

## Step 6: Start Development Server

```bash
# Start the web application
pnpm --filter @fsp/web dev
```

The application should now be running at: **http://localhost:5173**

## Step 7: Test the Application

Open your browser and navigate to http://localhost:5173

### What to Test:

1. **Dashboard Page** (`/`)
   - Should load without errors
   - Shows stats (bookings, active flights, weather alerts)
   - Displays upcoming flights and weather alerts

2. **Bookings Page** (`/bookings`)
   - View all flight bookings
   - Create new bookings
   - View booking details

3. **Weather Alerts Page** (`/weather-alerts`)
   - View active weather alerts
   - See affected bookings
   - Check weather conditions

### Test API Endpoints

You can test the API endpoints directly:

```bash
# Test dashboard stats
curl http://localhost:5173/api/dashboard/stats

# Test bookings list
curl http://localhost:5173/api/bookings

# Test weather alerts
curl http://localhost:5173/api/weather/alerts
```

## Common Issues

### Issue: "Cannot find module '@fsp/shared'"
**Solution**: Build the shared packages first:
```bash
pnpm --filter @fsp/shared build
pnpm --filter @fsp/database build
```

### Issue: "Prisma Client not generated"
**Solution**: Generate the Prisma client:
```bash
pnpm --filter @fsp/database prisma generate
```

### Issue: "Database connection failed"
**Solution**: Check your `DATABASE_URL` in `.env.local`
- Make sure you're using the connection pooler URL (port 6543, not 5432)
- Verify your password is correct
- Check if your IP is allowed in Supabase (Settings → Database → Connection Pooling)

### Issue: "OpenWeatherMap API returns 401"
**Solution**: Wait 2 hours after creating the API key for it to activate

### Issue: Port 5173 already in use
**Solution**: Kill the process or use a different port:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
PORT=3000 pnpm --filter @fsp/web dev
```

## Next Steps

Once local testing is successful:

1. ✅ Verify all pages load correctly
2. ✅ Test creating/viewing bookings
3. ✅ Check weather data is fetching
4. ✅ Test AI rescheduling (if you have OpenAI credits)
5. ✅ Verify email notifications work
6. 🚀 Deploy to Vercel

## Vercel Deployment

After successful local testing, you can deploy to Vercel:

```bash
cd apps/web
vercel deploy --prod
```

Make sure to add all environment variables in Vercel dashboard:
- Go to: https://vercel.com/daves-projects-4e6003cf/fsp/settings/environment-variables
- Add each variable from your `.env.local` file
- Redeploy after adding variables

## Need Help?

- Check `docs/local-testing.md` for detailed troubleshooting
- Check `docs/free-deployment-guide.md` for API key setup instructions
- Check `docs/setup.md` for complete setup documentation

