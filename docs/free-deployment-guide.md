# Free Deployment Stack Guide

## Overview
This project uses a completely FREE stack (except OpenAI API ~$5-10/month):
- **Vercel**: Frontend + API hosting
- **Supabase**: PostgreSQL database
- **Upstash**: Redis + Scheduled jobs
- **Resend**: Email notifications
- **OpenWeatherMap**: Weather data

Total cost: ~$5-10/month (just OpenAI usage)

## Getting Started - Free Accounts

### 1. Supabase (Database)
**Free Tier**: 500MB database, 2GB bandwidth, 7-day backups

1. Sign up: https://supabase.com
2. Create new project (choose region close to users)
3. Wait ~2 minutes for provisioning
4. Get credentials:
   - Settings > Database > Connection string
   - Settings > API > Project URL and anon key

### 2. Vercel (Hosting)
**Free Tier**: Unlimited bandwidth, 100GB-hours serverless functions

1. Sign up: https://vercel.com
2. Connect GitHub account
3. Import repository
4. Set root directory to `apps/web`
5. Add environment variables (from .env.template)
6. Deploy

### 3. Upstash (Redis & Cron)
**Free Tier**: 10K Redis commands/day, 500 scheduled messages/day

1. Sign up: https://upstash.com
2. Create Redis database (Global for lowest latency)
3. Create QStash endpoint (for scheduled jobs)
4. Copy credentials to Vercel environment variables

### 4. Resend (Email)
**Free Tier**: 3,000 emails/month, 100 emails/day

1. Sign up: https://resend.com
2. Verify your domain (or use testing domain)
3. Generate API key
4. Add to Vercel environment variables

### 5. OpenWeatherMap (Weather)
**Free Tier**: 1,000 calls/day

1. Sign up: https://openweathermap.org
2. Generate API key (takes ~2 hours to activate)
3. Subscribe to "One Call API 3.0" (free)
4. Add key to Vercel environment variables

### 6. OpenAI (AI)
**Pay-as-you-go**: ~$0.01 per reschedule (~$5-10/month estimated)

1. Sign up: https://platform.openai.com
2. Add payment method
3. Set usage limits ($10/month recommended)
4. Generate API key
5. Add to Vercel environment variables

## Scheduled Jobs (3 Free Options)

### Option A: Upstash QStash (Recommended)
**Pros**: Reliable, easy setup, 500 messages/day free
**Cons**: None

Setup:
1. Go to https://console.upstash.com/qstash
2. Create schedule: `0 * * * *` (every hour)
3. URL: `https://your-app.vercel.app/api/cron/weather-check`
4. Add authentication header: `Bearer YOUR_CRON_SECRET`

### Option B: GitHub Actions
**Pros**: Completely free, 2,000 minutes/month
**Cons**: Less reliable, can have delays

Setup in `.github/workflows/weather-cron.yml`:
```yaml
name: Hourly Weather Check
on:
  schedule:
    - cron: '0 * * * *'
jobs:
  check-weather:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Check
        run: |
          curl -X POST https://your-app.vercel.app/api/cron/weather-check \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option C: Vercel Cron
**Pros**: Most reliable, built-in
**Cons**: Requires Pro plan ($20/month)

## Deployment Steps

### Initial Deployment

```bash
# 1. Set up all accounts above

# 2. Clone repository
git clone <your-repo>
cd FSP

# 3. Install dependencies
pnpm install

# 4. Set up Supabase database
cd packages/database
# Update .env.local with Supabase DATABASE_URL
pnpm prisma migrate deploy
pnpm prisma db seed

# 5. Deploy to Vercel
cd ../../apps/web
vercel deploy --prod

# 6. Add environment variables in Vercel dashboard
# 7. Set up scheduled job (QStash or GitHub Actions)
# 8. Test the deployment
```

### Continuous Deployment

Once set up, every push to `main` branch automatically deploys:
```bash
git push origin main
# Vercel automatically builds and deploys
```

## Monitoring Free Tier Limits

### Supabase Dashboard
- Check database size: Settings > Database > Database Size
- Check bandwidth: Settings > Usage
- Upgrade to Pro ($25/mo) if needed

### Upstash Dashboard
- Check Redis commands: console.upstash.com > Database > Metrics
- Check QStash messages: console.upstash.com > QStash > Metrics

### Vercel Dashboard
- Check function usage: Project > Analytics > Functions
- Check bandwidth: Project > Analytics > Bandwidth

### OpenAI Dashboard
- Check usage: platform.openai.com > Usage
- Set budget limits to avoid surprises

## Cost Optimization Tips

### 1. Cache Aggressively
- Weather data: 30 min cache = 48 API calls/day (vs 1,000 limit)
- Student profiles: 1 hour cache
- Location data: 24 hours cache

### 2. Batch Operations
- Check multiple flights in single weather API call
- Batch database queries
- Use Prisma select to limit data transfer

### 3. Efficient AI Usage
- Only call AI for actual conflicts (not every booking)
- Use mock responses in development/testing
- Set temperature low (0.3-0.5) for deterministic outputs

### 4. Database Optimization
- Index frequently queried fields
- Clean up old data (weather checks >30 days)
- Use database-backed queue instead of Redis (if needed)

## Staying Within Free Limits

With good practices, this project should comfortably stay free except OpenAI:

| Service | Free Limit | Expected Usage | Margin |
|---------|-----------|----------------|---------|
| Supabase | 500MB | ~50MB/month | 10x buffer |
| Upstash Redis | 10K cmds/day | ~1K/day | 10x buffer |
| Upstash QStash | 500 msgs/day | 24/day (hourly) | 20x buffer |
| Resend | 3K emails/month | ~300/month | 10x buffer |
| OpenWeather | 1K calls/day | ~50/day | 20x buffer |
| Vercel | 100GB-hrs/mo | ~10GB-hrs | 10x buffer |
| OpenAI | Pay-as-go | ~$5-10/month | Set $10 limit |

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Check Prisma connection
pnpm prisma db pull
```

### Vercel Function Timeouts
- Free tier: 10s timeout
- Optimize slow operations
- Consider upgrading to Pro for 60s timeout

### Weather API Key Not Working
- Wait 2 hours after generation
- Check subscription to "One Call API 3.0"
- Verify API key in request

### Emails Not Sending
- Verify domain in Resend
- Check from address matches verified domain
- Use test mode for development

## Upgrading When Needed

If you outgrow free tiers:

1. **Supabase Pro** ($25/mo): 8GB database, daily backups
2. **Vercel Pro** ($20/mo): Better performance, cron jobs, analytics
3. **Upstash Pay-as-you-go**: ~$2/million commands
4. **Resend Pro** ($20/mo): 50K emails/month

But start with free tiers - they're very generous!

