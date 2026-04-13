const { Client } = require('pg');
require('dotenv').config();

const createDb = async () => {
    // Connect to 'postgres' default database to create project database
    const client = new Client({
        connectionString: 'postgres://postgres:2006@localhost:5050/postgres'
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL default database.');
        
        await client.query('CREATE DATABASE cems');
        console.log('Database "cems" created successfully!');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('Database "cems" already exists.');
        } else {
            console.error('Error creating database:', err);
        }
    } finally {
        await client.end();
    }
};

createDb();
