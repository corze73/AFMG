import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    const fullName = process.argv[4] || 'Admin User';

    if (!email || !password) {
      console.log('Usage: node src/scripts/createAdmin.js <email> <password> [full_name]');
      console.log('Example: node src/scripts/createAdmin.js admin@afmg.co.uk mypassword "John Doe"');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM profiles WHERE email = $1', [email.toLowerCase()]);
    
    if (existingUser.rows.length > 0) {
      console.log('❌ User with this email already exists');
      process.exit(1);
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const result = await query(
      `INSERT INTO profiles (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at`,
      [email.toLowerCase(), passwordHash, fullName, 'admin']
    );

    const newUser = result.rows[0];

    console.log('✅ Admin user created successfully!');
    console.log('User details:');
    console.log(`- ID: ${newUser.id}`);
    console.log(`- Email: ${newUser.email}`);
    console.log(`- Name: ${newUser.full_name}`);
    console.log(`- Role: ${newUser.role}`);
    console.log(`- Created: ${newUser.created_at}`);
    console.log('');
    console.log('You can now login with these credentials in the AFMG frontend.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

createAdminUser();