require('dotenv').config();
const { Client } = require('pg');

// Expected relationships
const expectedRelationships = [
    { table: 'courses', column: 'trainer_id', references: 'users(id)' },
    { table: 'todos', column: 'user_id', references: 'users(id)' },
    { table: 'sessions', column: 'course_id', references: 'courses(id)' },
    { table: 'payments', column: 'user_id', references: 'users(id)' },
    { table: 'payments', column: 'course_id', references: 'courses(id)' },
    { table: 'notifications', column: 'user_id', references: 'users(id)' },
    { table: 'socialmediaintegrations', column: 'user_id', references: 'users(id)' },
    { table: 'users', column: 'category_id', references: 'categories(id)' },
    { table: 'userbadges', column: 'user_id', references: 'users(id)' },
    { table: 'userbadges', column: 'badge_id', references: 'badges(id)' },
    { table: 'trainerverifications', column: 'user_id', references: 'users(id)' }
];

describe('Table Relationships', () => {
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

    test('All expected relationships should exist', async () => {
        for (const relationship of expectedRelationships) {
            const { table, column, references } = relationship;
            const query = `
                SELECT tc.constraint_name
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                WHERE tc.table_name = '${table}'
                  AND kcu.column_name = '${column}'
                  AND ccu.table_name || '(' || ccu.column_name || ')' = '${references}';
            `;
            console.log(`Query for ${table}.${column} -> ${references}: ${query}`);
            const result = await client.query(query);
            console.log(`Result for ${table}.${column}:`, result.rows);
            expect(result.rows.length).toBeGreaterThan(0);
        }
    });
    
});
