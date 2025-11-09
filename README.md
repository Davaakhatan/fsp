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

### Prerequisites

- Node.js 20+
- pnpm 8+
- Supabase account (free)
- OpenAI API key
- OpenWeatherMap API key

### 1. Clone and Install

```bash
git clone <your-repo>
cd FSP
pnpm install
```

### 2. Set Up Environment

```bash
cp .env.template .env.local
# Edit .env.local with your API keys
```

Get your free API keys:
- **Supabase**: https://supabase.com (Database)
- **OpenAI**: https://platform.openai.com (AI)
- **OpenWeatherMap**: https://openweathermap.org (Weather)
- **Resend**: https://resend.com (Email)
- **Upstash**: https://upstash.com (Redis + Cron - optional)

### 3. Set Up Database

```bash
cd packages/database
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

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

- [Setup Instructions](docs/setup.md) - Get started locally
- [Local Testing Guide](docs/local-testing.md) - Test before deploying
- [Development Roadmap](docs/roadmap.md) - Project progress
- [Free Deployment Guide](docs/free-deployment-guide.md) - Deploy to Vercel
- [Architecture](memory-bank/systemPatterns.md) - System design
- [API Documentation](memory-bank/techContext.md) - Technical details

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

