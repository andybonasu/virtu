const db = require('./models'); // Import the db object from models/index.js
const fs = require('fs');
const path = require('path');

// Log current working directory
console.log('Current working directory:', __dirname);

// Log all files and directories at the root level
console.log('Root directory contents:', fs.readdirSync(__dirname));

// Log the contents of the "models" directory
const modelsDir = path.join(__dirname, 'models');
if (fs.existsSync(modelsDir)) {
  console.log('Models directory contents:', fs.readdirSync(modelsDir));
} else {
  console.error('Models directory not found at:', modelsDir);
}

const seedData = async () => {
  try {
    // Authenticate database
    await db.sequelize.authenticate();
    console.log('Database connection successful!');

    // Sync database (force recreates all tables)
    await db.sequelize.sync({ force: true });
    console.log('Tables recreated successfully!');

    // Seed Users
    const users = await db.User.bulkCreate([
      {
        email: 'trainer1@example.com',
        password: 'hashedpassword123',
        role: 'trainer',
        name: 'John Trainer',
        profilePic: 'trainer1.png',
        bio: 'Expert fitness trainer.',
        contactNumber: '1234567890',
        location: 'New York',
        expertise: 'Fitness',
        socialLinks: { instagram: 'trainer1_ig', twitter: 'trainer1_tw' },
        isVerified: true,
      },
      {
        email: 'client1@example.com',
        password: 'hashedpassword456',
        role: 'client',
        name: 'Jane Client',
        profilePic: 'client1.png',
        bio: 'Loves yoga and fitness.',
        contactNumber: '0987654321',
        location: 'Los Angeles',
        socialLinks: {},
        isVerified: false,
      },
    ]);
    console.log('Users seeded!');

    // Seed Courses
    const courses = await db.Course.bulkCreate([
      { title: 'Intro to Fitness', description: 'Beginner fitness course.', price: 49.99, trainer_id: users[0].id },
      { title: 'Advanced Yoga', description: 'Master yoga techniques.', price: 69.99, trainer_id: users[0].id },
    ]);
    console.log('Courses seeded!');

    // Seed Course Settings
    const courseSettings = await db.CourseSetting.bulkCreate([
      {
        course_id: courses[0].id,
        configType: 'day_plan',
        configKey: 'Day 1',
        configValue: { description: 'Warm-up and stretching' },
      },
      {
        course_id: courses[0].id,
        configType: 'reps_sets',
        configKey: 'Workout',
        configValue: { exercise: 'Push-ups', sets: 3, reps: 15 },
      },
      {
        course_id: courses[1].id,
        configType: 'module_config',
        configKey: 'Yoga Basics',
        configValue: { duration: '45 minutes', level: 'Beginner' },
      },
      {
        course_id: courses[1].id,
        configType: 'custom',
        configKey: 'Meditation',
        configValue: { duration: '15 minutes', focus: 'Mindfulness' },
      },
    ]);
    console.log('Course Settings seeded!');

    const sessions = await db.Session.bulkCreate([
        {
          course_id: courses[0].id, // Ensure this ID exists in the Courses table
          name: 'Warm-Up Basics', // Required field
          duration: 60, // 60 minutes
          videoUrl: 'https://example.com/warmup.mp4', // Optional field
          materials: [{ type: 'PDF', url: 'warmup.pdf' }], // Array of resources
        },
        {
          course_id: courses[1].id, // Ensure this ID exists in the Courses table
          name: 'Yoga Advanced Techniques', // Required field
          duration: 90, // 90 minutes
          videoUrl: 'https://example.com/yoga.mp4', // Optional field
          materials: [
            { type: 'Video', url: 'yoga_tutorial.mp4' },
            { type: 'PDF', url: 'yoga_notes.pdf' },
          ], // Array of resources
        },
      ]);
      console.log('Sessions seeded!');
      

    // Seed Categories
    const categories = await db.Category.bulkCreate([
      { name: 'Fitness', description: 'All fitness-related courses' },
      { name: 'Yoga', description: 'All yoga-related courses' },
    ]);
    console.log('Categories seeded!');

    // Seed Conversations
    const conversations = await db.Conversation.bulkCreate([
        { title: 'Fitness Discussion', created_by: users[0].id, trainer_id: users[0].id, client_id: users[1].id },
        { title: 'Yoga Insights', created_by: users[1].id, trainer_id: users[1].id, client_id: users[0].id },
      ]);      
    console.log('Conversations seeded!');

    // Seed Messages
    const messages = await db.Message.bulkCreate([
      { conversation_id: conversations[0].id, sender_id: users[0].id, content: 'Hi everyone!' },
      { conversation_id: conversations[1].id, sender_id: users[1].id, content: 'Yoga helps with flexibility.' },
    ]);
    console.log('Messages seeded!');

    // Seed ToDos
    const todos = await db.ToDo.bulkCreate([
      { user_id: users[0].id, task: 'Update fitness course details', is_completed: false },
      { user_id: users[1].id, task: 'Complete questionnaire', is_completed: true },
    ]);
    console.log('ToDos seeded!');

    // Seed Questionnaires
    const questionnaires = await db.Questionnaire.bulkCreate([
      {
        trainer_id: users[0].id,
        title: 'Fitness Goals',
        questions: ['What is your fitness goal?', 'Do you have any injuries?'],
      },
      {
        trainer_id: users[1].id,
        title: 'Yoga Experience',
        questions: ['What is your yoga experience?', 'Preferred schedule?'],
      },
    ]);
    console.log('Questionnaires seeded!');

    // Seed Social Media Integrations
    const socialMediaIntegrations = await db.SocialMediaIntegration.bulkCreate([
        {
          user_id: users[0].id, // Trainer
          platform: 'Instagram',
          account_name: 'trainer1_insta',
          accessToken: 'access_token_instagram', // Example token
          refreshToken: 'refresh_token_instagram',
          expiresAt: new Date(Date.now() + 3600 * 1000), // Expires in 1 hour
        },
        {
          user_id: users[1].id, // Client
          platform: 'Twitter',
          account_name: 'client1_twitter',
          accessToken: 'access_token_twitter', // Example token
          refreshToken: 'refresh_token_twitter',
          expiresAt: new Date(Date.now() + 7200 * 1000), // Expires in 2 hours
        },
      ]);
      console.log('Social Media Integrations seeded!');
      

    // Seed Trainer Verifications
    const trainerVerifications = await db.TrainerVerification.bulkCreate([
        {
          trainer_id: users[0].id, // Reference to the seeded trainer
          document_url: 'certificates/trainer1_certificate.pdf', // Example document URL
          status: 'approved', // Status: 'pending', 'approved', or 'rejected'
          comments: 'Trainer verified successfully.',
          verificationType: 'fitness_certification', // Example verification type
          reviewedAt: new Date(), // Timestamp of the review
          reviewer_id: users[1].id, // Example reviewer
        },
      ]);
      console.log('Trainer Verifications seeded!');
      

    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await db.sequelize.close();
    console.log('Database connection closed.');
  }
};

seedData();
