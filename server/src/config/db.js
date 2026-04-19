const { Pool } = require('pg');
require('dotenv').config();

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const poolConfig = {
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 60000,
};

// If we have separate components, use them to avoid URI parsing issues with special characters
// Map standard names to their values, checking for Vercel-specific names as fallbacks
const user = process.env.DB_USER || process.env.DATABASE_POSTGRES_USER || 'postgres';
const password = process.env.DB_PASSWORD || process.env.DATABASE_POSTGRES_PASSWORD;
const host = process.env.DB_HOST || process.env.DATABASE_POSTGRES_HOST;
const database = process.env.DB_NAME || process.env.DATABASE_POSTGRES_DATABASE || 'postgres';
const port = process.env.DB_PORT || 5432;

if (password && host) {
    Object.assign(poolConfig, {
        user,
        password,
        host,
        port,
        database,
        ssl: { rejectUnauthorized: false }
    });
} else if (dbUrl) {
    Object.assign(poolConfig, {
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false },
    });
} else {
    console.warn('⚠️ No specific Database credentials found. Falling back to default connection logic.');
}


const pool = new Pool(poolConfig);

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
