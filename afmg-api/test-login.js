import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testLogin(email, password) {
  try {
    console.log(`🔍 Testing login for: ${email}`);
    
    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email, password_hash, full_name FROM profiles WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ User not found');
      return false;
    }

    const user = userResult.rows[0];
    console.log(`👤 Found user: ${user.full_name} (${user.email})`);

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (passwordMatch) {
      console.log('✅ Password correct - Login would succeed!');
      return true;
    } else {
      console.log('❌ Password incorrect');
      return false;
    }

  } catch (error) {
    console.error('❌ Error during login test:', error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 Testing login credentials...\n');
  
  // First, let's see all users in the database
  try {
    const allUsers = await pool.query('SELECT email, full_name FROM profiles ORDER BY email');
    console.log('📋 All users in database:');
    allUsers.rows.forEach(user => {
      console.log(`👤 ${user.email} - ${user.full_name}`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
  }
  
  await testLogin('admin@afmg.co.uk', 'password123');
  console.log('');
  await testLogin('ccharles@aspirefootballgroup.co.uk', 'password123');
  console.log('');
  await testLogin('ccharles@aspirefootballin', 'password123'); // Trying the truncated version from DB
  
  process.exit(0);
}

main();