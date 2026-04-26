const { Pool } = require('pg');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT || 5432;

const poolConfig = {
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 60000,
};

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
        ssl: { rejectUnauthorized: false },
    });
} else {
    console.error('❌ No Database credentials found in environment variables');
}



const pool = new Pool(poolConfig);

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // Removed process.exit(-1) for better serverless compatibility
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
