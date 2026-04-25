const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cems',
  password: process.env.DB_PASSWORD || '2006',
  port: process.env.DB_PORT || 5050,
});

async function alterDb() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;');
    
    // Set all existing students to true, existing admins to true (since they were created before this)
    await pool.query('UPDATE users SET is_approved = true;');

    console.log('Database altered successfully');
  } catch (err) {
    console.error('Error altering database', err);
  } finally {
    await pool.end();
  }
}

alterDb();
