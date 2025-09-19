# AFMG API Server

Backend API for the Aspire Football Management Group (AFMG) application, built with Express.js and Neon PostgreSQL database.

## 🚀 Quick Start

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update `.env` with your actual values:

```bash
# Database
DATABASE_URL=postgresql://username:password@hostname/database_name?sslmode=require

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📊 Database Setup

The API will automatically:
- Test the database connection on startup
- Create required tables (`players` and `profiles`) if they don't exist
- Initialize the database schema

### Required Tables Structure:

**players table:**
- `id` (UUID, primary key)
- `name` (text, required)
- `position` (text, required)
- `preferred_foot` (text, required: 'Left', 'Right', or 'Both')
- `current_club` (text, optional)
- `previous_club` (text, optional)
- `image_url` (text, optional)
- `bio` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**profiles table:**
- `id` (UUID, primary key)
- `email` (text, unique, required)
- `password_hash` (text, required)
- `full_name` (text, required)
- `role` (text, default: 'admin')
- `profile_image_url` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Admin users must be created directly in the database with bcrypt-hashed passwords.

### Creating an Admin User

Connect to your Neon database and run:

```sql
INSERT INTO profiles (email, password_hash, full_name, role)
VALUES (
  'admin@aspirefootballgroup.co.uk',
  '$2a$10$example-bcrypt-hash-here',
  'Admin User',
  'admin'
);
```

Generate a bcrypt hash for your password using Node.js:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

## 🛠️ API Endpoints

### Health Check
- `GET /api/health` - General health check
- `GET /api/health/database` - Database connection check
- `GET /api/health/cloudinary` - Cloudinary configuration check

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Players (Public reads, Protected writes)
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get single player
- `POST /api/players` - Create player (protected)
- `PUT /api/players/:id` - Update player (protected)
- `DELETE /api/players/:id` - Delete player (protected)

### File Upload
- `POST /api/upload/image` - Upload image to Cloudinary (protected)
- `DELETE /api/upload/image/:publicId` - Delete image from Cloudinary (protected)

## 🧪 Testing the API

### Test Health Check
```bash
curl http://localhost:3001/api/health
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aspirefootballgroup.co.uk","password":"your-password"}'
```

### Test Players Endpoint
```bash
curl http://localhost:3001/api/players
```

## 🔧 Configuration

### Required Environment Variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary account name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Optional Environment Variables:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## 🚨 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS** - Configured for frontend URL
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Parameter validation and sanitization
- **File Upload Security** - Type and size validation

## 📁 Project Structure

```
afmg-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection and utilities
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── players.js           # Player CRUD endpoints
│   │   ├── upload.js            # Image upload endpoints
│   │   └── health.js            # Health check endpoints
│   └── server.js                # Main server file
├── package.json
├── .env.example
└── README.md
```

## 🔗 Frontend Integration

This API is designed to work with the AFMG React frontend. The frontend should be configured with:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📝 Logs

The server provides comprehensive logging:
- Request logging via Morgan
- Database query logging with execution times
- Error logging with stack traces in development
- Startup checks for database and configuration

## 🆘 Troubleshooting

### Database Connection Issues
1. Check your `DATABASE_URL` format
2. Ensure your Neon database is running
3. Verify SSL settings match your Neon configuration

### Cloudinary Upload Issues
1. Verify all Cloudinary environment variables are set
2. Check API key permissions in Cloudinary dashboard
3. Ensure file types and sizes are within limits

### Authentication Issues
1. Verify JWT_SECRET is set and consistent
2. Check that admin users exist in the profiles table
3. Ensure password hashes are generated with bcrypt

Need help? Check the logs for detailed error messages.