require('dotenv').config();
const { Client } = require('pg');

// List of expected tables
const expectedTables = [
    'users',
    'courses',
    'todos',
    'sessions',
    'payments',
    'notifications',
    'socialmediaintegrations',
    'categories',
    'badges',
    'userbadges',
    'trainerverifications'
];

describe('Table Verification', () => {
    let client;

    beforeAll(async () => {
        client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        await client.connect();
    });

    afterAll(async () => {
        await client.end();
    });

    test('All expected tables should exist', async () => {
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
    
        // Normalize table names to lowercase for comparison
        const tableNames = result.rows.map(row => row.table_name.toLowerCase());
        const normalizedExpectedTables = expectedTables.map(table => table.toLowerCase());
    
        normalizedExpectedTables.forEach(table => {
            expect(tableNames).toContain(table);
        });
    });
});


