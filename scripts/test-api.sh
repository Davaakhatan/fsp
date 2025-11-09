#!/bin/bash

# Test API Endpoints Locally
# Make sure dev server is running first

set -e

API_URL="http://localhost:3000"

echo "🧪 Testing Flight Schedule Pro API"
echo "=================================="
echo ""

# Test 1: Dashboard Stats
echo "📊 Test 1: Dashboard Stats"
curl -s "$API_URL/api/dashboard/stats" | jq .
echo ""

# Test 2: List Bookings
echo "📅 Test 2: List Bookings"
curl -s "$API_URL/api/bookings" | jq '.[0:2]'
echo ""

# Test 3: Weather Alerts
echo "⚠️  Test 3: Weather Alerts"
curl -s "$API_URL/api/weather/alerts" | jq .
echo ""

# Test 4: Create Booking (requires IDs from seeded data)
echo "✏️  Test 4: Create Booking"
echo "Skipping - requires valid student/instructor/aircraft IDs"
echo "You can test manually with Prisma Studio data"
echo ""

# Test 5: Health Check
echo "❤️  Test 5: Health Check"
if curl -s -o /dev/null -w "%{http_code}" "$API_URL" | grep -q "200"; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding"
fi
echo ""

echo "✅ API tests complete!"
echo ""
echo "💡 Tips:"
echo "  - Use Prisma Studio to view/edit data: pnpm db:studio"
echo "  - Check API logs in the terminal where dev server is running"
echo "  - Test cron job: curl -X POST $API_URL/api/cron/weather-check -H 'Authorization: Bearer YOUR_CRON_SECRET'"

