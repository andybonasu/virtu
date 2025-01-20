const request = require('supertest');
const app = require('../virtu-backend/index'); // Adjust path to your index.js

describe('User Management APIs', () => {
    let token;

    test('Register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'student'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    test('Login with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        token = response.body.token; // Save token for further tests
    });

    test('Fetch user profile with valid token', async () => {
        const response = await request(app)
            .get('/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.email).toBe('test@example.com');
    });

    test('Update user profile', async () => {
        const response = await request(app)
            .put('/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated User'
            });
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe('Updated User');
    });

    test('Delete user account', async () => {
        const response = await request(app)
            .delete('/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Account deleted successfully');
    });
});
