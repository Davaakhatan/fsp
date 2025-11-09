# Local Testing Guide

This guide will help you test the Flight Schedule Pro system locally before deploying to Vercel.

## Quick Start Checklist

- [ ] pnpm installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] Supabase account created
- [ ] OpenAI API key obtained
- [ ] OpenWeatherMap API key obtained
- [ ] Resend API key obtained
- [ ] `.env.local` configured
- [ ] Database migrated
- [ ] Dev server running

## Step-by-Step Local Setup

### 1. Install pnpm

```bash
npm install -g pnpm
```

### 2. Install Dependencies

```bash
cd /Users/davaakhatanzorigtbaatar/Downloads/Private/2024/2025/CLassboxes/Gauntlet\ AI/Projects/FSP
pnpm install
```

This will install all packages for the monorepo.

### 3. Get Your API Keys

Follow the [setup guide](setup.md) to get free API keys for:
- ✅ Supabase (database)
- ✅ OpenAI (AI rescheduling)
- ✅ OpenWeatherMap (weather data)
- ✅ Resend (email notifications)

### 4. Configure Environment

Copy the template and add your keys:

```bash
cp .env.template .env.local
```

Edit `.env.local`:

```bash
# Supabase - Get from https://supabase.com
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# OpenAI
OPENAI_API_KEY="sk-your_key_here"

# OpenWeatherMap
OPENWEATHER_API_KEY="your_key_here"

# Resend
RESEND_API_KEY="re_your_key_here"

# Local development
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="local_dev_secret_123"
```

### 5. Set Up Database

```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
pnpm prisma generate

# Run migrations (creates tables)
pnpm prisma migrate dev --name init

# Seed with test data
pnpm prisma db seed

# Go back to root
cd ../..
```

### 6. Start Development Server

```bash
pnpm dev
```

The app should start at **http://localhost:3000**

## What to Test Locally

### Phase 1: Database & UI ✅

**Test the Dashboard:**
1. Open http://localhost:3000
2. ✅ Dashboard loads with clean UI
3. ✅ Navigation works (Dashboard, Bookings, Alerts)
4. ✅ Empty states show properly

**Check Database:**
```bash
pnpm db:studio
```
- Opens Prisma Studio at http://localhost:5555
- ✅ Verify students, instructors, locations are seeded
- ✅ Check sample bookings exist

### Phase 2: Services (In Progress)

Once API endpoints are created, test:

**Weather Service:**
```bash
# Manual test (TODO: create test endpoint)
curl http://localhost:3000/api/weather/check
```
- ✅ Fetches weather data
- ✅ Applies training level logic
- ✅ Detects conflicts

**Booking Service:**
- ✅ Create new booking
- ✅ Check for conflicts
- ✅ Update booking status
- ✅ Reschedule booking

**AI Service:**
- ✅ Generates 3+ reschedule options
- ✅ Options are valid times
- ✅ Reasoning makes sense

**Notification Service:**
- ✅ Sends weather conflict email
- ✅ Sends reschedule options email
- ✅ Sends confirmation email

### Phase 3: Integration (TODO)

**Complete Workflow:**
1. Create a booking for tomorrow
2. Manually trigger weather check
3. System detects conflict (if applicable)
4. AI generates reschedule options
5. Select an option
6. Receive confirmation email

**Background Scheduler:**
- ✅ Runs every hour
- ✅ Checks upcoming flights (24-48 hours)
- ✅ Triggers conflict workflow

## Testing Tips

### Use Prisma Studio

```bash
pnpm db:studio
```

Great for:
- ✅ Viewing all data
- ✅ Creating test bookings
- ✅ Checking event logs
- ✅ Debugging issues

### Test with Sample Data

The seed script creates:
- ✅ 3 students (Student, Private, Instrument levels)
- ✅ 2 instructors
- ✅ 2 aircraft
- ✅ 2 locations
- ✅ 2 sample bookings

### Mock Weather Data

For testing without API calls, you can:
1. Use cached weather data
2. Mock the weather service
3. Use sample weather data

### Test Email Locally

Resend has a test mode:
- Emails won't actually send
- You can see them in Resend dashboard
- Perfect for development

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Database Connection Error

```bash
# Check connection string
echo $DATABASE_URL

# Test connection
pnpm prisma db pull
```

### Module Not Found

```bash
# Clean install
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### Prisma Client Not Generated

```bash
cd packages/database
pnpm prisma generate
cd ../..
```

## Development Workflow

### Making Changes

1. **Edit code** in `apps/web/src/`
2. **Hot reload** automatically updates browser
3. **Check console** for errors
4. **Use React DevTools** for debugging

### Database Changes

```bash
# 1. Edit schema in packages/database/prisma/schema.prisma
# 2. Create migration
cd packages/database
pnpm prisma migrate dev --name your_change_name
cd ../..
```

### Testing Services

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Tests (when added)
pnpm test
```

## Performance Monitoring

### Check Logs

```bash
# Watch terminal for:
- API requests
- Database queries
- Weather API calls
- Email sends
- Errors and warnings
```

### Monitor API Usage

- **OpenWeatherMap**: Check dashboard for daily usage
- **OpenAI**: Monitor token usage
- **Resend**: Track emails sent

## Ready for Vercel?

Before deploying, ensure:

- ✅ All features work locally
- ✅ No console errors
- ✅ Database migrations run successfully
- ✅ API keys are valid
- ✅ Email notifications send
- ✅ Weather checks work
- ✅ AI generates valid options
- ✅ UI is polished and responsive

Once everything works locally, we'll deploy to Vercel with production database!

## Next Steps

1. **Complete API endpoints** (connect services to UI)
2. **Test full workflow** end-to-end
3. **Add background scheduler**
4. **Polish UI** with real data
5. **Deploy to Vercel** 🚀

## Getting Help

If you run into issues:
1. Check the error message carefully
2. Review [setup.md](setup.md) for configuration
3. Check [free-deployment-guide.md](free-deployment-guide.md)
4. Review service implementations in `apps/web/src/services/`

