// Load environment variables
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const sequelize = require('./db'); // Database connection

// Import models
const User = require('./models/user');
const Course = require('./models/course');
const ToDo = require('./models/todo');
const Session = require('./models/session');
const Payment = require('./models/payment');
const Notification = require('./models/notification');
const SocialMediaIntegration = require('./models/socialMediaIntegration');

// Define relationships
User.hasMany(Course, { foreignKey: 'trainer_id' });
Course.belongsTo(User, { foreignKey: 'trainer_id' });

User.hasMany(ToDo, { foreignKey: 'user_id' });
ToDo.belongsTo(User, { foreignKey: 'user_id' });

Course.hasMany(Session, { foreignKey: 'course_id' });
Session.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

Course.hasMany(Payment, { foreignKey: 'course_id' });
Payment.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(SocialMediaIntegration, { foreignKey: 'user_id' });
SocialMediaIntegration.belongsTo(User, { foreignKey: 'user_id' });

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Routes (placeholder for future API endpoints)
app.get('/', (req, res) => {
    res.send('Virtu Backend API is Running!');
});

// Sync models with the database
sequelize.sync({ force: false }) // Set `force: true` to reset tables during development
    .then(() => {
        console.log('Database synchronized with relationships!');
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const bcrypt = require('bcrypt'); // For password hashing

// User Registration API
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const jwt = require('jsonwebtoken'); // For token generation

// User Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, 'process.env.JWT_SECRET', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], 'process.env.JWT_SECRET', (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: 'Failed to authenticate token' });
      }
      req.userId = decoded.id;
      req.role = decoded.role;
      next();
  });
};

// Profile route with authentication
app.get('/profile', authenticate, async (req, res) => {
  try {
      const user = await User.findByPk(req.userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

