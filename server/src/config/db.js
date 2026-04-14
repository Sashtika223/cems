const { Pool } = require('pg');
require('dotenv').config();
if (!process.env.DATABASE_URL) {
    console.error('FATAL ERROR: DATABASE_URL is not defined in environment variables.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 30000,      
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
