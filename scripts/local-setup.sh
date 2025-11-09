#!/bin/bash

# Local Testing Setup Script for Flight Schedule Pro
# This script helps you set up the environment for local testing

set -e

echo "🚀 Flight Schedule Pro - Local Testing Setup"
echo "=============================================="
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed"
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm is installed"
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Build shared packages
echo "🔨 Building shared packages..."
pnpm --filter @fsp/shared build
echo "✅ @fsp/shared built"
echo ""

echo "🔨 Building database package..."
pnpm --filter @fsp/database build
echo "✅ @fsp/database built"
echo ""

# Check if .env.local exists
if [ ! -f "apps/web/.env.local" ]; then
    echo "⚠️  .env.local file not found!"
    echo ""
    echo "Please create apps/web/.env.local with the following variables:"
    echo ""
    echo "VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=your-supabase-anon-key"
    echo "DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
    echo "VITE_OPENWEATHER_API_KEY=your-openweathermap-api-key"
    echo "OPENAI_API_KEY=your-openai-api-key"
    echo "RESEND_API_KEY=your-resend-api-key"
    echo ""
    echo "📖 See docs/local-testing-quick-start.md for detailed instructions"
    echo ""
    exit 1
else
    echo "✅ .env.local file found"
fi
echo ""

# Setup database
echo "🗄️  Setting up database..."
echo "Generating Prisma Client..."
pnpm --filter @fsp/database prisma generate

echo "Pushing schema to database..."
pnpm --filter @fsp/database prisma db push

echo "✅ Database setup complete"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  pnpm --filter @fsp/web dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""

