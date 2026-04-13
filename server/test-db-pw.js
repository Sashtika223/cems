const { Pool } = require('pg');

const passwords = ['postgres', 'root', 'admin', 'password', ''];

async function testPasswords() {
    for (const pwd of passwords) {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres', // connect to default database to just check auth
            password: pwd,
            port: 5050,
        });

        try {
            await pool.connect();
            console.log(`Success with password: "${pwd}"`);
            process.exit(0);
        } catch (err) {
            console.log(`Failed with password: "${pwd}" - ${err.message}`);
        } finally {
            await pool.end();
        }
    }
    console.log("None of the common passwords worked.");
}

testPasswords();
