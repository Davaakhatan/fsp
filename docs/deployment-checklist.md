# Deployment Checklist

Use this checklist to deploy Flight Schedule Pro to production.

## Pre-Deployment

### 1. Local Testing ✅
- [ ] Run `pnpm install` successfully
- [ ] Database migrations work
- [ ] Seed data loads correctly
- [ ] Dev server starts without errors
- [ ] Dashboard loads at http://localhost:3000
- [ ] API endpoints respond correctly
- [ ] No console errors in browser
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] No linter errors (`pnpm lint`)

### 2. API Keys Ready
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] OpenWeatherMap API key obtained
- [ ] OpenAI API key obtained
- [ ] Resend API key obtained
- [ ] All keys tested locally

### 3. Code Quality
- [ ] All git commits made
- [ ] Code pushed to GitHub (when ready)
- [ ] README.md updated with project info
- [ ] Documentation complete

## Deployment to Vercel

### 1. Prepare Vercel Account
- [ ] Sign up at https://vercel.com (free)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`

### 2. Deploy Frontend + API
```bash
cd apps/web
vercel deploy --prod
```

- [ ] Deployment successful
- [ ] Note the deployment URL

### 3. Configure Environment Variables

In Vercel Dashboard (Project Settings > Environment Variables):

#### Required Variables:
- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `OPENWEATHER_API_KEY` - OpenWeatherMap key
- [ ] `OPENAI_API_KEY` - OpenAI key
- [ ] `RESEND_API_KEY` - Resend key
- [ ] `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL
- [ ] `CRON_SECRET` - Random string for cron job security

#### Optional Variables:
- [ ] `UPSTASH_REDIS_REST_URL` - If using Upstash
- [ ] `UPSTASH_REDIS_REST_TOKEN` - If using Upstash
- [ ] `QSTASH_URL` - If using QStash for cron
- [ ] `QSTASH_TOKEN` - If using QStash

### 4. Production Database Setup

- [ ] Create production Supabase project
- [ ] Copy DATABASE_URL to Vercel
- [ ] Run migrations on production:
  ```bash
  # In packages/database with production DATABASE_URL
  pnpm prisma migrate deploy
  ```
- [ ] Seed production data (optional):
  ```bash
  pnpm prisma db seed
  ```

### 5. Set Up Cron Jobs

Choose ONE option:

#### Option A: Vercel Cron (Requires Pro Plan $20/mo)
- [ ] Uncomment crons section in vercel.json
- [ ] Redeploy
- [ ] Verify in Vercel Dashboard > Cron

#### Option B: GitHub Actions (FREE)
- [ ] Create `.github/workflows/weather-cron.yml`:
  ```yaml
  name: Weather Check Cron
  on:
    schedule:
      - cron: '0 * * * *'  # Every hour
    workflow_dispatch:
  jobs:
    check-weather:
      runs-on: ubuntu-latest
      steps:
        - name: Trigger Weather Check
          run: |
            curl -X POST https://your-app.vercel.app/api/cron/weather-check \
              -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
  ```
- [ ] Add CRON_SECRET to GitHub Secrets
- [ ] Test workflow manually

#### Option C: Upstash QStash (FREE)
- [ ] Sign up at https://upstash.com
- [ ] Create schedule at https://console.upstash.com/qstash
- [ ] URL: `https://your-app.vercel.app/api/cron/weather-check`
- [ ] Schedule: `0 * * * *`
- [ ] Add Authorization header: `Bearer YOUR_CRON_SECRET`

## Post-Deployment Testing

### 1. Verify Deployment
- [ ] Visit deployment URL
- [ ] Dashboard loads correctly
- [ ] No console errors
- [ ] API endpoints work:
  ```bash
  curl https://your-app.vercel.app/api/dashboard/stats
  curl https://your-app.vercel.app/api/bookings
  curl https://your-app.vercel.app/api/weather/alerts
  ```

### 2. Test Complete Workflow
- [ ] Create a test booking (via Prisma Studio or API)
- [ ] Wait for or manually trigger cron job
- [ ] Verify weather check runs
- [ ] Check if conflict detected (if weather is bad)
- [ ] Verify email sent (check Resend dashboard)
- [ ] Check database for events logged

### 3. Monitor Logs
- [ ] Check Vercel Functions logs
- [ ] Check Supabase logs
- [ ] Check Resend email delivery
- [ ] Check OpenWeatherMap usage
- [ ] Check OpenAI usage

### 4. Performance Check
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] No errors in Vercel logs
- [ ] Database queries optimized

## Monitoring & Maintenance

### Daily
- [ ] Check Vercel deployment status
- [ ] Monitor API usage (OpenWeatherMap, OpenAI)
- [ ] Check email delivery rate (Resend)

### Weekly
- [ ] Review error logs
- [ ] Check database size (Supabase free tier: 500MB)
- [ ] Monitor function execution time
- [ ] Review cron job execution logs

### Monthly
- [ ] Review API costs (should be ~$5-10)
- [ ] Check for Vercel/Supabase limits
- [ ] Update dependencies if needed
- [ ] Review and clean old data

## Rollback Plan

If deployment fails:

1. **Revert Vercel Deployment**:
   ```bash
   vercel rollback
   ```

2. **Database Issues**:
   - Supabase provides automatic backups
   - Restore from backup if needed

3. **Keep Previous Version**:
   - GitHub has full history
   - Can redeploy from any commit

## Troubleshooting

### Deployment Fails
- Check build logs in Vercel
- Verify all env vars are set
- Check TypeScript errors
- Ensure dependencies are installed

### Cron Job Not Running
- Verify schedule configuration
- Check authentication header
- Review function logs
- Test endpoint manually

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure connection pooling is enabled
- Check IP allowlist (Supabase allows all by default)

### Email Not Sending
- Check Resend API key
- Verify sender domain
- Check email logs in Resend dashboard
- Ensure FROM address is verified

## Success Criteria

Deployment is successful when:
- ✅ Dashboard loads without errors
- ✅ API endpoints return correct data
- ✅ Cron job runs every hour
- ✅ Weather checks detect conflicts
- ✅ Emails send successfully
- ✅ No errors in production logs
- ✅ All features work as expected

## Demo Video Checklist

Record a 5-10 minute demo showing:
- [ ] Dashboard overview
- [ ] Create a booking
- [ ] Show weather check (or simulate)
- [ ] Show conflict detection
- [ ] Show AI-generated reschedule options
- [ ] Show email notification
- [ ] Show booking confirmation
- [ ] Explain architecture briefly
- [ ] Show code highlights
- [ ] Discuss free tier usage

## Final Steps

- [ ] Update README with deployment URL
- [ ] Add screenshots to README
- [ ] Create demo video
- [ ] Share project link
- [ ] Celebrate! 🎉

---

**Estimated Time**: 2-3 hours for first deployment
**Ongoing Cost**: ~$5-10/month (just OpenAI)
**Difficulty**: Beginner-friendly with this checklist

