# 🚀 Find-a-Flight-School Marketplace - Quick Start Guide

## Prerequisites
- [x] Node.js 18+ installed
- [x] pnpm installed (`npm install -g pnpm`)
- [x] Supabase account (free tier)
- [x] OpenAI API key (for AI matching)

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/Davaakhatan/fsp.git
cd fsp

# Install dependencies
pnpm install
```

## Step 2: Set Up Supabase

### 2.1 Create a New Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name: `fsp-marketplace`
4. Set a strong database password
5. Select a region (closest to you)
6. Wait for project creation (~2 minutes)

### 2.2 Run Database Schema
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click "New Query"
4. Copy the entire contents of `database-schema-marketplace.sql`
5. Paste into the SQL editor
6. Click "Run" (bottom right)
7. Wait for completion (~30 seconds)

### 2.3 Run Seed Data
1. In SQL Editor, click "New Query" again
2. Copy the entire contents of `database-seed-marketplace.sql`
3. Paste into the SQL editor
4. Click "Run"
5. Wait for completion (~10 seconds)

### 2.4 Get Your Supabase Credentials
1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`, keep this secret!)

## Step 3: Set Up Environment Variables

Create `.env.local` in `apps/web/`:

```bash
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (for AI matching)
OPENAI_API_KEY=sk-proj-...

# Local Development
NODE_ENV=development
VITE_APP_URL=http://localhost:5175
```

## Step 4: Run the App Locally

```bash
# From project root
cd apps/web

# Run both frontend and API server
pnpm dev
```

The app will be available at **http://localhost:5175**

## Step 5: Test the Marketplace

### Search & Browse
1. Open http://localhost:5175
2. You should see the marketplace homepage
3. Search for schools by location (e.g., "San Diego", "Phoenix")
4. Browse the 6 seeded flight schools

### View School Profiles
1. Click on any school card
2. View full profile with programs, aircraft, reviews
3. Check out the Trust Tier badges

### AI Matching (Coming Soon)
1. Click "Find My Perfect School"
2. Complete the questionnaire
3. Get AI-powered recommendations

### Comparison (Coming Soon)
1. Select 2-4 schools
2. Click "Compare"
3. See side-by-side comparison

## Troubleshooting

### Database Connection Issues
- Double-check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Make sure RLS policies are enabled (they are in the schema)
- Check Supabase dashboard for any error logs

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port Already in Use
```bash
# Change port in apps/web/vite.config.ts
server: {
  port: 5176, // or any other port
}
```

## Next Steps

1. **Run through all features** to ensure they work
2. **Customize the UI** to match your brand
3. **Add more schools** via SQL or admin interface
4. **Deploy to Vercel** (see deployment guide)

## Need Help?

- Check `docs/` folder for detailed documentation
- Review `memory-bank/` for project context
- Open an issue on GitHub

---

**Happy Building! 🚀**

