import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAllTables() {
  try {
    console.log('🔍 Checking all tables in database...\n');
    
    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Available tables:');
    for (const table of tablesResult.rows) {
      console.log(`📁 ${table.table_name}`);
      
      try {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table.table_name}`);
        console.log(`   └─ ${countResult.rows[0].count} rows`);
        
        // If it's a user-related table, show some data
        if (table.table_name.includes('user') || table.table_name.includes('profile') || table.table_name.includes('admin')) {
          const sampleResult = await pool.query(`SELECT * FROM ${table.table_name} LIMIT 3`);
          if (sampleResult.rows.length > 0) {
            console.log('   └─ Sample data:');
            sampleResult.rows.forEach(row => {
              console.log('      ', JSON.stringify(row, null, 2));
            });
          }
        }
      } catch (error) {
        console.log(`   └─ Error: ${error.message}`);
      }
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAllTables();