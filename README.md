# Flight School Pro 🛩️

> Find-a-Flight-School Marketplace - Helping Students Find Their Perfect Flight Training Match

A modern, student-facing marketplace platform that makes finding and comparing flight schools easy. Features universal school directory, trust tiers, AI-powered matching, and tools for student conversion.

## 🎉 **Project Status: Phase 1 MVP Complete - Live in Production!**

**🔗 Live Demo**: https://fsp-marketplace.vercel.app (or your actual Vercel URL)

**📹 Demo Video**: [Link to your demo video]

## ✨ Features

### ✅ **Implemented - Phase 1 MVP**

#### **Marketplace Core**
- 🔍 **Universal School Directory**: Browse and search 6 flight schools nationwide
- 🗺️ **Location-Based Search**: Geographic filtering with PostGIS for distance-based results
- ⭐ **Trust Tiers**: Premier, Verified FSP, Community-Verified, Unverified badges
- 📊 **School Comparison**: Side-by-side comparison of programs, costs, and features
- 📝 **Student Reviews**: Submit and read verified student feedback with detailed ratings
- 💰 **Financing Calculator**: Interactive cost estimation and payment planning
- 🤖 **AI Matching System**: Smart questionnaire-based school recommendations
- 📧 **Inquiry System**: Students can contact schools directly through the platform

#### **Admin Portal**
- 👨‍💼 **Role-Based Access**: Platform Admin, School Admin, and Student roles
- 🏫 **School Admin Dashboard**: Manage inquiries and reviews for your school
- 🔐 **Authentication**: Secure sign-up/sign-in with Supabase Auth
- 🛡️ **Row-Level Security**: Database policies ensure data privacy and access control
- 📬 **Inquiry Management**: Track and respond to prospective student inquiries
- ✅ **Review Moderation**: Approve/reject reviews before they go public

#### **Technical Features**
- 🎨 **Modern UI/UX**: Minimalist, user-friendly design with smooth animations
- 📱 **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- ⚡ **Fast Performance**: Optimized with TanStack Query caching and lazy loading
- 🔄 **Real-time Updates**: Instant data refresh and status changes
- 🛡️ **Error Boundaries**: Graceful error handling throughout the app
- 🔔 **Toast Notifications**: User feedback for all actions
- 🚀 **Production Ready**: TypeScript strict mode, no compilation errors

### 🚧 **Planned Features**

#### **Phase 2: School Onboarding**
- 📋 School claim flow
- 🖼️ Photo/video uploads
- 📄 Document management
- 💳 Subscription tiers

#### **Phase 3: Advanced Features**
- 📅 Tour booking integration
- 💬 Live chat support
- 📊 Analytics dashboard
- 🔔 Email/SMS notifications

#### **Phase 4: AI Enhancements**
- 🎯 ML-powered matching refinement
- 💬 AI chatbot for student questions
- 📈 Predictive analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed
- Supabase account (free tier or Pro)
- Vercel account (for deployment)

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Davaakhatan/fsp.git
cd fsp

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cd apps/web
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# 4. Set up Supabase database
# - Go to Supabase dashboard → SQL Editor
# - Run migrations from supabase/migrations/ folder in order
# - Enable PostGIS extension if not already enabled

# 5. Start development server
pnpm dev
```

Visit **http://localhost:5175** 🎉

### Required Environment Variables

Create `apps/web/.env.local`:

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (Optional - for AI Matching feature)
VITE_OPENAI_API_KEY=sk-proj-your_openai_api_key
```

### Database Setup

1. **Create Supabase Project**: Go to https://supabase.com and create a new project
2. **Enable PostGIS**: Run `CREATE EXTENSION IF NOT EXISTS postgis;` in SQL Editor
3. **Run Migrations**: Execute SQL files from `supabase/migrations/` folder in order:
   - `create-schools-schema.sql`
   - `create-reviews-schema.sql`
   - `create-inquiries-schema.sql`
   - `create-school-admins.sql`
   - `insert-sample-schools.sql`
   - And all RLS policy files

## 📁 Project Structure

```
FSP/
├── apps/
│   └── web/                       # Main React application
│       ├── src/
│       │   ├── components/        # Reusable UI components
│       │   ├── pages/             # Page components
│       │   ├── hooks/             # Custom React hooks
│       │   ├── lib/               # API client and utilities
│       │   ├── contexts/          # React contexts (Auth)
│       │   └── services/          # Business logic (AI, etc.)
│       └── public/                # Static assets
├── packages/
│   └── shared/                    # Shared types and constants
├── supabase/
│   └── migrations/                # Database schema and RLS policies
├── memory-bank/                   # Project documentation
├── docs/                          # Additional guides
└── .cursor/rules/                 # AI coding standards
```

## 🎨 Tech Stack

### Frontend
- **React 18** + TypeScript + Vite
- **TailwindCSS** for styling
- **TanStack Query** for data fetching and caching
- **Zustand** for state management
- **React Router** for navigation
- **Lucide Icons** for UI icons

### Backend
- **Supabase PostgreSQL** with PostGIS extension
- **Supabase Auth** for authentication
- **Row-Level Security (RLS)** for data access control
- **Vercel Serverless Functions** (for future API endpoints)

### AI & APIs
- **OpenAI GPT-4** via AI SDK (optional, for AI Matching)
- **Supabase REST API** with PostgREST

### DevOps
- **Vercel** for deployment and hosting
- **GitHub** for version control
- **pnpm** for package management

**Total Cost**: FREE (Supabase Pro optional: $25/month for PostGIS)

## 📖 Key Pages

1. **Homepage** (`/`) - Hero section, search, featured schools
2. **Browse Schools** (`/search`) - Advanced filtering and search
3. **School Profile** (`/schools/:slug`) - Detailed school information, reviews, inquiry form
4. **Comparison** (`/compare`) - Side-by-side school comparison
5. **AI Matching** (`/find-match`) - Smart questionnaire-based matching
6. **Financing Hub** (`/financing`) - Cost calculator and financing info
7. **Sign In/Up** (`/signin`, `/signup`) - Authentication pages
8. **Admin Dashboards**:
   - Platform Admin: `/admin/dashboard` (overview of all schools)
   - School Admin: `/portal/inquiries`, `/portal/reviews`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Framework: Vite
   - Root Directory: `apps/web`
   - Build Command: `pnpm build`
   - Output Directory: `dist`

3. **Set Environment Variables**:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_OPENAI_API_KEY=sk-proj-... (optional)
   ```

4. **Deploy**: Click "Deploy" and wait for build to complete!

**Important**: Make sure to use `VITE_` prefix for all environment variables (Vite requirement).

## 🧪 Testing Locally

### Create Test Users

Run in Supabase SQL Editor:

```sql
-- Platform Admin (sees all schools)
-- Email: admin@flightschool.com
-- Password: admin123456
-- Role: admin

-- School Admin (sees only their school)
-- Email: admin@phoenixaviation.com
-- Password: admin123456
-- Role: school_admin
-- Linked to: Phoenix Aviation Academy

-- Regular Student User
-- Email: student@example.com
-- Password: student123456
-- Role: user
```

### Test Flow

1. **Browse as Guest**: Visit homepage, search schools, view profiles
2. **Submit Inquiry**: Fill out contact form on school profile
3. **Leave Review**: Submit a review for a school (goes to moderation)
4. **Sign In as School Admin**: Manage inquiries and approve reviews
5. **Sign In as Platform Admin**: See all inquiries/reviews across all schools
6. **Try AI Matching**: Complete the questionnaire and get matched schools

## 🎯 Key Features Demonstrated

### 1. **Trust Tier System**
- **Premier**: Top-tier schools with FSP operational data integration
- **Verified FSP**: Schools using FSP for operations
- **Community-Verified**: Alumni-verified schools
- **Unverified**: New listings pending verification

### 2. **Smart Search & Filtering**
- Geographic search with distance calculation
- Filter by training type (Part 141/61)
- Budget range filtering
- Aircraft fleet filtering
- VA approval filtering

### 3. **AI-Powered Matching**
- 9-question personalized questionnaire
- Intelligent scoring algorithm
- Budget, location, and training preference matching
- Detailed reasoning for each match

### 4. **Admin Portal**
- Role-based access control (RBAC)
- School-specific data isolation
- Platform-wide admin oversight
- Real-time inquiry/review management

### 5. **Modern UX**
- Smooth animations and transitions
- Loading skeletons for better perceived performance
- Toast notifications for user feedback
- Mobile-responsive design
- Accessibility best practices

## 📊 Current Data

- **6 Flight Schools** across major US cities
- **Sample Programs**: PPL, IFR, Commercial, CFI
- **Trust Tiers**: Mix of Premier, Verified, and Community-Verified
- **Reviews**: Sample approved reviews for each school
- **3 Admin Users**: Platform admin, school admin, regular user

## 🎯 Project Overview

This is a fully functional MVP of a flight school marketplace platform built to demonstrate modern full-stack development skills.

**Key Achievements:**
- ✅ Built complete marketplace in 1 week
- ✅ Production-ready code with zero TypeScript errors
- ✅ Deployed and live on Vercel
- ✅ Full authentication and authorization system
- ✅ AI-powered matching algorithm
- ✅ Mobile-responsive design
- ✅ Clean, maintainable codebase

**What Makes This Special:**
- **Real-world application**: Solves actual problem for flight school discovery
- **Modern stack**: Latest React patterns, TypeScript strict mode, serverless architecture
- **Security-first**: Row-Level Security policies, role-based access control
- **AI integration**: Optional GPT-4 powered school matching
- **Production quality**: Error boundaries, loading states, toast notifications, form validation
- **Cost-effective**: Runs on free tier (or $25/month for PostGIS)

## 🤝 Contributing

This project demonstrates expertise in:
- Modern React/TypeScript development
- Supabase backend with RLS
- AI integration with OpenAI
- Beautiful UI/UX design
- Role-based access control
- Geographic data with PostGIS
- Full-stack deployment pipeline

Feel free to explore, learn, and build upon it!

## 📄 License

MIT

## 🙏 Acknowledgments

Built with amazing tools:
- [Supabase](https://supabase.com) - Database, Auth, and RLS
- [Vercel](https://vercel.com) - Hosting and deployment
- [TailwindCSS](https://tailwindcss.com) - Styling framework
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [OpenAI](https://openai.com) - AI matching (optional)
- [Lucide Icons](https://lucide.dev) - Beautiful icons

## 📞 Support

For questions or issues:
1. Check [memory-bank/](memory-bank/) for detailed documentation
2. Review [docs/](docs/) for setup guides
3. Check Supabase logs for database issues
4. Check Vercel logs for deployment issues

---

**Status**: ✅ Phase 1 MVP Complete - Live in Production! 🎉

**Built with**: React • TypeScript • Supabase • TailwindCSS • Vercel
