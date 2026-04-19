const { Pool } = require('pg');
require('dotenv').config();

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const poolConfig = {
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 60000,
};

// If we have separate components, use them to avoid URI parsing issues with special characters
if (process.env.DB_PASSWORD) {
    Object.assign(poolConfig, {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'postgres',
        ssl: { rejectUnauthorized: false }
    });
} else if (dbUrl) {
    Object.assign(poolConfig, {
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false },
    });
} else {
    console.error('FATAL ERROR: No Database configuration found.');
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
