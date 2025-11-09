# Flight Schedule Pro 🛩️

> Weather Cancellation & AI Rescheduling System for Flight Schools

An intelligent, automated system that monitors weather conditions, detects conflicts with scheduled flight lessons, and uses AI to suggest optimal rescheduling options.

## ✨ Features

- 🌦️ **Automated Weather Monitoring**: Hourly checks for upcoming flights
- 🎯 **Training-Level Safety Logic**: Different weather minimums for Student/Private/Instrument pilots
- 🤖 **AI-Powered Rescheduling**: Generates 3+ optimal reschedule options
- 📧 **Smart Notifications**: Email alerts for conflicts and reschedule options
- 📊 **Modern Dashboard**: Real-time weather alerts and flight status
- 📈 **Analytics & Tracking**: Complete booking lifecycle and metrics

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

### Option 2: Manual Setup

```bash
# 1. Clone and install
git clone https://github.com/Davaakhatan/fsp.git
cd fsp
pnpm install

# 2. Configure environment
cp .env.template .env.local
# Edit .env.local with your API keys

# 3. Setup database
cd packages/database
pnpm prisma migrate dev
pnpm prisma db seed
cd ../..

# 4. Start development
pnpm dev
```

Visit **http://localhost:3000** 🎉

### Get API Keys (All FREE except OpenAI)

1. **Supabase** (Database): https://supabase.com
2. **OpenWeatherMap** (Weather): https://openweathermap.org
3. **OpenAI** (AI ~$5-10/mo): https://platform.openai.com
4. **Resend** (Email): https://resend.com

See [Setup Guide](docs/setup.md) for detailed instructions.

## 📁 Project Structure

```
FSP/
├── apps/
│   └── web/              # React app + Vercel Functions
│       ├── src/          # Frontend code
│       └── api/          # Serverless API functions (TODO)
├── packages/
│   ├── shared/           # Shared types and utilities
│   └── database/         # Prisma schema and client
├── memory-bank/          # Project documentation
├── docs/                 # Additional documentation
└── .cursor/rules/        # AI coding standards
```

## 🎨 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase PostgreSQL (free: 500MB)
- **AI**: OpenAI GPT-4 via Vercel AI SDK
- **Email**: Resend (free: 3,000/month)
- **Weather**: OpenWeatherMap (free: 1,000 calls/day)
- **Cron**: Upstash QStash or GitHub Actions (free)

**Total Cost**: ~$5-10/month (just OpenAI usage)

## 📖 Documentation

- 🎉 [**Project Complete!**](docs/COMPLETE.md) - Summary & next steps
- 📝 [Setup Instructions](docs/setup.md) - Get started locally
- 🧪 [Local Testing Guide](docs/local-testing.md) - Test before deploying
- ✅ [Deployment Checklist](docs/deployment-checklist.md) - Step-by-step deploy
- 🗺️ [Development Roadmap](docs/roadmap.md) - Project progress
- 📊 [Project Status](docs/project-status.md) - What's complete
- 🚀 [Free Deployment Guide](docs/free-deployment-guide.md) - Deploy to Vercel
- 🏗️ [Architecture](memory-bank/systemPatterns.md) - System design
- 📚 [API Documentation](memory-bank/techContext.md) - Technical details

## 🧪 Testing

```bash
# Run tests (TODO)
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🚢 Deployment

### Deploy to Vercel (Recommended - FREE)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel deploy --prod
```

See [Free Deployment Guide](docs/free-deployment-guide.md) for complete instructions.

## 📋 Development Roadmap

- [x] Project setup and architecture
- [x] Modern, minimalist UI design
- [ ] Weather service integration
- [ ] AI rescheduling service
- [ ] Email notifications
- [ ] Background scheduler
- [ ] Complete dashboard
- [ ] Tests and documentation

## 🤝 Contributing

This is a learning project. Feel free to explore and improve!

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Supabase](https://supabase.com)
- [Prisma](https://www.prisma.io)
- [TailwindCSS](https://tailwindcss.com)

