const sequelize = require('./db');
const User = require('./models/user');
const Course = require('./models/course');

(async () => {
    try {
        await sequelize.authenticate();

        // Seed users
        const trainer = await User.create({
            name: 'John Trainer',
            email: 'trainer@example.com',
            password: 'password123', // Note: This is plain text for simplicity. Hash it if needed.
            role: 'trainer',
        });

        const student = await User.create({
            name: 'Jane Student',
            email: 'student@example.com',
            password: 'password123',
            role: 'student',
        });

        // Seed courses
        await Course.create({
            trainer_id: trainer.id,
            title: 'Yoga Basics',
            description: 'Introduction to yoga for beginners.',
            price: 50.0,
        });

        console.log('Seed data created successfully!');
    } catch (err) {
        console.error('Error creating seed data:', err);
    } finally {
        sequelize.close();
    }
})();
