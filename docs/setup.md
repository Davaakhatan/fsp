# Setup Instructions

## Prerequisites

Before you begin, make sure you have:
- **Node.js 20+** installed
- **pnpm** installed (`npm install -g pnpm`)
- Free accounts for services (see below)

## Step 1: Install pnpm

If you haven't installed pnpm yet:

```bash
npm install -g pnpm
```

## Step 2: Install Dependencies

```bash
cd /Users/davaakhatanzorigtbaatar/Downloads/Private/2024/2025/CLassboxes/Gauntlet\ AI/Projects/FSP
pnpm install
```

## Step 3: Set Up Free Services

### 3.1 Supabase (Database) - FREE

1. Go to https://supabase.com
2. Sign up and create a new project
3. Wait ~2 minutes for provisioning
4. Go to **Settings > Database**
5. Copy the **Connection String** (change `[YOUR-PASSWORD]` to your actual password)
6. Go to **Settings > API**
7. Copy **Project URL** and **anon/public key**

### 3.2 OpenAI (AI) - ~$5-10/month

1. Go to https://platform.openai.com
2. Create account and add payment method
3. Go to **API keys**
4. Create new secret key
5. Set usage limits ($10/month recommended)

### 3.3 OpenWeatherMap (Weather) - FREE

1. Go to https://openweathermap.org
2. Sign up for free account
3. Go to **API keys**
4. Copy your API key
5. Subscribe to **One Call API 3.0** (free tier)
6. Wait ~2 hours for activation

### 3.4 Resend (Email) - FREE

1. Go to https://resend.com
2. Sign up for free account
3. Go to **API Keys**
4. Create new API key
5. Copy the key (starts with `re_`)

## Step 4: Configure Environment

Create `.env.local` file in the project root:

```bash
cp .env.template .env.local
```

Edit `.env.local` and fill in your API keys:

```bash
# Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"

# OpenAI
OPENAI_API_KEY="sk-your_key_here"

# Weather
OPENWEATHER_API_KEY="your_key_here"

# Email
RESEND_API_KEY="re_your_key_here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cron Secret (generate a random string)
CRON_SECRET="random_string_here_12345"
```

## Step 5: Set Up Database

```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database with sample data
pnpm prisma db seed
```

## Step 6: Start Development Server

```bash
# Go back to root
cd ../..

# Start the app
pnpm dev
```

Visit **http://localhost:3000** 🎉

## Troubleshooting

### pnpm not found
```bash
npm install -g pnpm
```

### Database connection error
- Check your DATABASE_URL is correct
- Make sure Supabase project is active
- Verify password in connection string

### OpenWeatherMap 401 error
- Wait 2 hours after creating API key
- Make sure you subscribed to One Call API 3.0

### Module not found errors
```bash
# Clean install
rm -rf node_modules
pnpm install
```

## Next Steps

Once the app is running:

1. **Explore the Dashboard** - See the minimalist UI
2. **Check Database** - Run `pnpm db:studio` to view data
3. **Test Services** - Try creating a booking
4. **Deploy** - See `docs/free-deployment-guide.md`

## Development Commands

```bash
# Start dev server
pnpm dev

# Run type checking
pnpm type-check

# Run linter
pnpm lint

# Database studio (GUI)
pnpm db:studio

# View database
pnpm db:migrate

# Run tests (when added)
pnpm test
```

## Project Structure

```
FSP/
├── apps/
│   └── web/                 # Main React app
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── pages/       # Pages
│       │   ├── services/    # Business logic ✅
│       │   └── lib/         # Utilities
│       └── api/             # Serverless functions (TODO)
├── packages/
│   ├── shared/              # Shared types ✅
│   └── database/            # Prisma + DB ✅
└── docs/                    # Documentation ✅
```

## What's Built So Far

✅ Complete project structure
✅ Modern, minimalist UI design system
✅ Prisma database schema
✅ Weather Service (OpenWeatherMap integration)
✅ Booking Service (with conflict detection)
✅ AI Service (reschedule generation)
✅ Notification Service (beautiful email templates)
✅ Shared types and utilities

## What's Next

- [ ] Serverless API endpoints (Vercel Functions)
- [ ] Event bus/queue system
- [ ] Background scheduler (weather checks)
- [ ] Complete dashboard with real data
- [ ] Tests
- [ ] Deploy to Vercel

## Need Help?

- Check the [Free Deployment Guide](docs/free-deployment-guide.md)
- Review [Memory Bank](memory-bank/) for full documentation
- Check [Cursor Rules](.cursor/rules/) for coding standards

