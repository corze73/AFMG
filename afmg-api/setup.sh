#!/bin/bash

# AFMG Migration Setup Script
echo "🚀 AFMG Migration Setup Script"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the afmg-api directory."
    exit 1
fi

echo "📋 Setup Steps:"
echo "1. Configure environment variables"
echo "2. Install dependencies (if not already done)"
echo "3. Start the API server"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "🔧 IMPORTANT: You need to update .env with your actual values:"
    echo "   - DATABASE_URL: Your Neon database connection string"
    echo "   - CLOUDINARY credentials: Your Cloudinary account details"
    echo "   - JWT_SECRET: A secure secret key"
    echo ""
    echo "📝 Edit the .env file now and then run this script again."
    exit 1
else
    echo "✅ Found .env file"
fi

# Check if DATABASE_URL is configured
if grep -q "postgresql://username:password" .env; then
    echo "⚠️  DATABASE_URL is not configured in .env"
    echo "📝 Please update DATABASE_URL with your Neon database connection string"
    echo "   Example: DATABASE_URL=postgresql://user:pass@host/db?sslmode=require"
    exit 1
else
    echo "✅ DATABASE_URL configured"
fi

# Check if Cloudinary is configured
if grep -q "your-cloudinary" .env; then
    echo "⚠️  Cloudinary is not configured in .env"
    echo "📝 Please update CLOUDINARY_* variables with your Cloudinary account details"
    exit 1
else
    echo "✅ Cloudinary configured"
fi

# Check if JWT_SECRET is configured
if grep -q "your-super-secret" .env; then
    echo "⚠️  JWT_SECRET is not properly configured"
    echo "📝 Please update JWT_SECRET with a secure secret key"
    exit 1
else
    echo "✅ JWT_SECRET configured"
fi

echo ""
echo "🔍 Testing API server startup..."

# Try to start the server in test mode
npm run dev &
SERVER_PID=$!

# Wait a bit for startup
sleep 3

# Test if server is responding
if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
    echo "✅ API server started successfully!"
    echo "📍 API running at: http://localhost:3001/api"
    
    # Test health endpoint
    echo ""
    echo "🩺 Health Check Results:"
    curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || echo "Health check response received"
    
    echo ""
    echo "🎉 AFMG API Setup Complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Create an admin user:"
    echo "   node src/scripts/createAdmin.js admin@afmg.co.uk your-password 'Admin Name'"
    echo ""
    echo "2. Test the frontend connection:"
    echo "   The frontend should now be able to connect to http://localhost:3001/api"
    echo ""
    echo "3. Start developing:"
    echo "   - API server: npm run dev (already running)"
    echo "   - Frontend: cd ../.. && npm run dev"
    echo ""
    echo "Press Ctrl+C to stop the API server when done testing."
    
    # Keep server running
    wait $SERVER_PID
    
else
    echo "❌ API server failed to start"
    echo "Check the error messages above and ensure:"
    echo "- DATABASE_URL is correct and database is accessible"
    echo "- All environment variables are properly configured"
    echo "- Port 3001 is not already in use"
    
    # Kill the server process
    kill $SERVER_PID 2>/dev/null
    exit 1
fi