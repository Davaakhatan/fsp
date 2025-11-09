#!/bin/bash

# Quick Start Script for Local Testing
# This script helps you get the project running locally

set -e  # Exit on error

echo "🚀 Flight Schedule Pro - Quick Start"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing now..."
    npm install -g pnpm
fi

echo "✅ Prerequisites OK"
echo ""

# Check environment file
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.template .env.local
    echo "📝 Please edit .env.local with your API keys before continuing."
    echo "   You need:"
    echo "   - Supabase DATABASE_URL"
    echo "   - OPENWEATHER_API_KEY"
    echo "   - OPENAI_API_KEY"
    echo "   - RESEND_API_KEY"
    echo ""
    read -p "Press Enter once you've added your API keys..."
fi

echo "✅ Environment file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo "✅ Dependencies installed"
echo ""

# Setup database
echo "🗄️  Setting up database..."
cd packages/database

echo "  Generating Prisma client..."
pnpm prisma generate

echo "  Running migrations..."
pnpm prisma migrate dev --name init

echo "  Seeding database..."
pnpm prisma db seed

cd ../..

echo "✅ Database ready"
echo ""

# Start dev server
echo "🎉 Setup complete! Starting development server..."
echo ""
echo "📍 Dashboard: http://localhost:3000"
echo "📍 API: http://localhost:3000/api"
echo "📍 Prisma Studio: Run 'pnpm db:studio' in another terminal"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

pnpm dev

