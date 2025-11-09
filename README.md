# Flight Schedule Pro 🛩️

> Weather Cancellation & AI Rescheduling System for Flight Schools

An intelligent, automated system that monitors weather conditions, detects conflicts with scheduled flight lessons, and uses AI to suggest optimal rescheduling options.

## 🎉 **Project Status: 90% Complete - Ready for Deployment!**

## ✨ Features

### ✅ **Implemented**
- 🌦️ **Automated Weather Monitoring**: Hourly checks for upcoming flights via GitHub Actions
- 🎯 **Training-Level Safety Logic**: Different weather minimums for Student/Private/Instrument pilots
- 🤖 **AI-Powered Rescheduling**: GPT-4 generates 3+ optimal reschedule options with reasoning
- 📧 **Smart Notifications**: Beautiful email templates with Resend
- 📊 **Modern Dashboard**: Real-time weather alerts and flight status
- ✈️ **Booking Management**: Complete booking creation with form validation
- 🔔 **Toast Notifications**: User feedback for all actions
- 🎨 **Beautiful UI**: Minimalist, user-friendly design with TailwindCSS
- 🛡️ **Error Boundaries**: Graceful error handling throughout the app
- 📈 **Analytics & Tracking**: Complete booking lifecycle and metrics

### 🚧 **Optional/Future**
- 📱 SMS notifications (Twilio integration ready)
- 📅 Google Calendar sync
- 🔄 Real-time dashboard updates (Supabase Realtime)
- 📊 Historical analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed
- Supabase account (free tier)
- API keys: OpenWeatherMap, OpenAI, Resend

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Davaakhatan/fsp.git
cd fsp

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp apps/web/.env.template apps/web/.env.local
# Edit .env.local with your API keys (see below)

# 4. Set up Supabase database
# - Go to Supabase dashboard
# - Run the SQL in database-schema.sql
# - Run the SQL in database-seed.sql

# 5. Start development servers
cd apps/web
pnpm dev
```

Visit **http://localhost:5175** 🎉

### Get API Keys (Required)

1. **Supabase** (Database - FREE): https://supabase.com
   - Create a project
   - Copy Project URL and anon key
   - Copy service_role key from Settings → API

2. **OpenWeatherMap** (Weather - FREE): https://openweathermap.org/api
   - Sign up for free account
   - Get API key from dashboard
   - Free tier: 1,000 calls/day

3. **OpenAI** (AI - ~$5-10/mo): https://platform.openai.com
   - Create account and add payment method
   - Generate API key
   - GPT-4 Turbo recommended

4. **Resend** (Email - FREE): https://resend.com
   - Sign up for free account
   - Get API key from dashboard
   - Free tier: 3,000 emails/month

### Environment Variables

Create `apps/web/.env.local`:

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# OpenWeatherMap
OPENWEATHER_API_KEY=your_openweather_api_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Local Development
NODE_ENV=development
VITE_APP_URL=http://localhost:5175
```

## 📁 Project Structure

```
FSP/
├── apps/
│   └── web/                    # Main application
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── services/       # Business logic services
│       │   ├── hooks/          # Custom React hooks
│       │   └── lib/            # Utilities
│       ├── api/                # Vercel Serverless Functions
│       ├── dev-server.ts       # Local API development server
│       └── vercel.json         # Vercel configuration
├── packages/
│   └── shared/                 # Shared types and utilities
├── database-schema.sql         # Supabase database schema
├── database-seed.sql           # Sample data
├── memory-bank/                # Project documentation
├── docs/                       # Guides and documentation
└── .cursor/rules/              # AI coding standards
```

## 🎨 Tech Stack

### Frontend
- **React 18** + TypeScript + Vite
- **TailwindCSS** for styling
- **TanStack Query** for data fetching
- **React Router** for navigation
- **Lucide Icons** for UI icons

### Backend
- **Vercel Serverless Functions** (FREE)
- **Supabase PostgreSQL** (FREE: 500MB)
- **Express** (local development)

### AI & APIs
- **OpenAI GPT-4 Turbo** via Vercel AI SDK (~$5-10/month)
- **OpenWeatherMap API** (FREE: 1,000 calls/day, cached 30 min)
- **Resend** for emails (FREE: 3,000/month)

### DevOps
- **GitHub Actions** for cron jobs (FREE, hourly weather checks)
- **Vercel** for deployment (FREE: 100GB bandwidth)
- **pnpm** for package management

**Total Cost**: ~$5-10/month (just OpenAI usage)

## 📖 Documentation

### Getting Started
- 📝 [Setup Guide](docs/setup.md) - Detailed local setup
- 🧪 [Local Testing](docs/local-testing.md) - Test all features
- 🚀 [Vercel Deployment](docs/vercel-deployment.md) - Deploy to production

### Project Information
- 🗺️ [Development Roadmap](docs/roadmap.md) - Progress tracking
- 📊 [Project Status](docs/project-status.md) - What's complete
- 🏗️ [System Architecture](memory-bank/systemPatterns.md) - Technical design
- 📚 [API Documentation](memory-bank/techContext.md) - API details

### Memory Bank (AI Assistant Context)
- 📋 [Project Brief](memory-bank/projectbrief.md) - Requirements
- 🎯 [Product Context](memory-bank/productContext.md) - Features & UX
- ⚙️ [Tech Context](memory-bank/techContext.md) - Technology stack
- 📈 [Progress Tracker](memory-bank/progress.md) - Detailed progress
- 🔄 [Active Context](memory-bank/activeContext.md) - Current state

## 🚢 Deployment

### Deploy to Vercel (FREE Tier)

```bash
# Option 1: Via Vercel CLI
npm i -g vercel
cd apps/web
vercel deploy --prod

# Option 2: Via GitHub Integration
# Connect your GitHub repo to Vercel dashboard
# Automatic deployments on push to main
```

**Important**: Set all environment variables in Vercel dashboard before deploying!

See [Vercel Deployment Guide](docs/vercel-deployment.md) for complete step-by-step instructions.

### Post-Deployment
1. Set up GitHub Secrets for cron job
2. Test all features in production
3. Monitor Vercel logs
4. Check email delivery
5. Verify AI generation works

## 🧪 Testing

```bash
# Run development server
pnpm dev

# Type checking
pnpm --filter @fsp/web exec tsc --noEmit

# Build for production (test locally)
pnpm --filter @fsp/web build
pnpm --filter @fsp/web preview
```

## 📋 Development Roadmap

### ✅ Phase 1: Foundation (100%)
- [x] Monorepo setup with pnpm
- [x] TypeScript strict mode
- [x] Development environment

### ✅ Phase 2: Database (100%)
- [x] Supabase integration
- [x] Database schema design
- [x] Seed data creation

### ✅ Phase 3: Core Services (100%)
- [x] Weather service (OpenWeatherMap)
- [x] AI service (GPT-4)
- [x] Booking service
- [x] Notification service (Resend)

### ✅ Phase 4: API Layer (100%)
- [x] GET /api/bookings
- [x] GET /api/weather/alerts
- [x] GET /api/dashboard/stats
- [x] POST /api/reschedule/generate
- [x] POST /api/cron/weather-check

### ✅ Phase 5: Frontend (100%)
- [x] Dashboard page
- [x] Bookings page with creation form
- [x] Weather alerts page
- [x] AI reschedule options display
- [x] Toast notifications
- [x] Error boundaries

### ✅ Phase 6: DevOps (100%)
- [x] GitHub Actions for cron jobs
- [x] Local development server
- [x] Vercel deployment config

### 🚧 Phase 7: Final Polish (90%)
- [x] Error handling
- [x] Loading states
- [ ] Mobile responsiveness test
- [ ] Accessibility improvements
- [ ] Demo video

### ⏳ Phase 8: Deployment (0%)
- [ ] Deploy to Vercel
- [ ] Production testing
- [ ] Monitor and optimize

## 🎯 Key Features Demonstrated

1. **Weather Monitoring**
   - Checks weather every hour (GitHub Actions)
   - Compares against training level minimums
   - Creates alerts for conflicts

2. **AI Rescheduling**
   - GPT-4 analyzes booking constraints
   - Generates 3+ optimal options
   - Provides reasoning for each option
   - Scores options by quality

3. **User Experience**
   - Modern, minimalist UI
   - Real-time feedback with toasts
   - Smooth animations and transitions
   - Mobile-responsive design

4. **Safety First**
   - Training level-specific weather minimums
   - Conservative safety logic
   - Clear violation messaging
   - Audit trail for all actions

## 🤝 Contributing

This is a demonstration/learning project showcasing:
- Modern React development
- AI integration with structured outputs
- Serverless architecture
- Real-time weather monitoring
- Beautiful UI/UX design

Feel free to explore and learn from the code!

## 📄 License

MIT

## 🙏 Acknowledgments

Built with amazing tools:
- [Vercel AI SDK](https://sdk.vercel.ai) - AI integration
- [Supabase](https://supabase.com) - Database & auth
- [TailwindCSS](https://tailwindcss.com) - Styling
- [OpenAI](https://openai.com) - GPT-4 Turbo
- [Resend](https://resend.com) - Email delivery

---

**Built in 1 day** 🚀 | **Status**: Ready for deployment! 🎉
