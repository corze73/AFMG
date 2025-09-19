import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create connection pool to Neon database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to Neon database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Database query helper function
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 Query executed in ${duration}ms:`, text.substring(0, 50) + '...');
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Get a client from the pool for transactions
export const getClient = () => pool.connect();

// Test connection function
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    console.log('🔍 Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

// Initialize database tables if they don't exist
export const initializeTables = async () => {
  try {
    console.log('🔄 Checking database tables...');

    // Check if players table exists
    const playersTableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'players'
      );
    `);

    if (!playersTableCheck.rows[0].exists) {
      console.log('📋 Creating players table...');
      await query(`
        CREATE TABLE players (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          position TEXT NOT NULL,
          preferred_foot TEXT NOT NULL CHECK (preferred_foot IN ('Left', 'Right', 'Both')),
          current_club TEXT,
          previous_club TEXT,
          image_url TEXT,
          bio TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('✅ Players table created');
    }

    // Check if profiles table exists
    const profilesTableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      );
    `);

    if (!profilesTableCheck.rows[0].exists) {
      console.log('📋 Creating profiles table...');
      await query(`
        CREATE TABLE profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          full_name TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          profile_image_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('✅ Profiles table created');
    }

    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default pool;