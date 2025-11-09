# Vercel Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- [x] Supabase account and project created
- [x] All API keys acquired (OpenAI, OpenWeatherMap, Resend)
- [x] Vercel account created
- [x] GitHub repository with latest code

## Step 1: Prepare Environment Variables

Create a `.env.production` file or prepare these variables for Vercel:

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

# Application
VITE_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/davaakhatanzorigtbaatar/Downloads/Private/2024/2025/CLassboxes/Gauntlet\ AI/Projects/FSP
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? fsp
# - Directory? apps/web
# - Override settings? No
```

### Option B: Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `Davaakhatan/fsp`
4. Configure Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

5. Add Environment Variables (all from above)
6. Click "Deploy"

## Step 3: Set Up Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable from the list above
4. Make sure to select:
   - **Production**: ✓
   - **Preview**: ✓
   - **Development**: ✓

## Step 4: Configure GitHub Actions for Cron Jobs

GitHub Actions is already configured in `.github/workflows/weather-cron.yml`.

### Add Secrets to GitHub:

1. Go to https://github.com/Davaakhatan/fsp/settings/secrets/actions
2. Click "New repository secret"
3. Add these secrets:
   - `VERCEL_DEPLOY_URL`: Your Vercel deployment URL
   - `CRON_SECRET`: Any random string (e.g., `generate_secure_random_string_here`)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `RESEND_API_KEY`: Your Resend API key

## Step 5: Verify Deployment

### Check Deployment Status
1. Go to Vercel Dashboard → Your Project → Deployments
2. Wait for build to complete (usually 2-3 minutes)
3. Click "Visit" to open your deployed app

### Test Functionality
1. **Dashboard loads**: Should show stats and data
2. **Create a booking**: Test the booking form
3. **View alerts**: Check weather alerts page
4. **Generate reschedule options**: Test AI feature
5. **Check toast notifications**: Verify user feedback works

### Monitor Logs
1. Go to Vercel Dashboard → Your Project → Logs
2. Check for any errors
3. Monitor API responses

### Test GitHub Actions Cron
1. Go to https://github.com/Davaakhatan/fsp/actions
2. Click "Weather Check Cron Job"
3. Click "Run workflow" to test manually
4. Check if it runs successfully

## Step 6: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Ensure `pnpm-lock.yaml` is committed
- Check Node.js version (should be 18.x)

### API Endpoints Return 404
- Verify `apps/web/vercel.json` is present
- Check rewrites configuration
- Ensure API files are in `apps/web/api/` directory

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify database tables exist

### GitHub Actions Cron Not Running
- Check secrets are added to GitHub
- Verify workflow file is in `.github/workflows/`
- Check Actions tab for error messages
- Ensure repository Actions are enabled

### Environment Variables Not Loading
- Verify variable names match exactly (case-sensitive)
- Check that variables are set for Production environment
- Redeploy after adding new variables

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Dashboard shows data from Supabase
- [ ] Booking creation works
- [ ] Weather alerts display correctly
- [ ] AI reschedule generation works
- [ ] Toast notifications appear
- [ ] GitHub Actions cron job runs hourly
- [ ] Email notifications send (test with Resend)
- [ ] All pages are accessible
- [ ] Mobile responsive design works
- [ ] No console errors in browser

## Monitoring

### Vercel Analytics
- Enable in Vercel Dashboard → Your Project → Analytics
- Track page views and performance

### Error Tracking
- Check Vercel Logs regularly
- Monitor Supabase dashboard for database errors
- Check GitHub Actions for cron job failures

### Usage Monitoring
- **Vercel**: Monitor bandwidth and function invocations
- **Supabase**: Check database size and bandwidth
- **OpenAI**: Monitor token usage in OpenAI dashboard
- **OpenWeatherMap**: Check API call count
- **Resend**: Monitor email sends

## Cost Optimization

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month, 100 hours serverless function execution
- **Supabase**: 500MB database, 2GB bandwidth/month
- **OpenWeatherMap**: 1,000 calls/day (cached for 30 min)
- **Resend**: 3,000 emails/month
- **OpenAI**: Pay-per-use (~$5-10/month estimated)

### Tips to Stay Within Limits
1. Cache weather API calls (already implemented)
2. Limit AI reschedule generations
3. Use GitHub Actions for cron (free)
4. Optimize database queries
5. Monitor usage weekly

## Support

If you encounter issues:
1. Check Vercel logs: `vercel logs <deployment-url>`
2. Check Supabase logs in dashboard
3. Review GitHub Actions logs
4. Check browser console for errors

## Next Steps

After successful deployment:
1. Share the deployment URL
2. Test all features thoroughly
3. Monitor for 24 hours
4. Record demo video
5. Update README with deployment link

---

**Deployment URL**: `https://your-project.vercel.app` (will be available after deployment)

**Status**: Ready to Deploy! 🚀

