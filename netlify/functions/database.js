import pkg from 'pg';
const { Pool } = pkg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Database query helper
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Query executed in ${duration}ms:`, text.substring(0, 50) + '...');
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Initialize database tables
export const initializeTables = async () => {
  try {
    console.log('Checking database tables...');

    // Check if players table exists
    const playersTableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'players'
      );
    `);

    if (!playersTableCheck.rows[0].exists) {
      console.log('Creating players table...');
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
      console.log('Players table created');
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
      console.log('Creating profiles table...');
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
      console.log('Profiles table created');
    }

    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};