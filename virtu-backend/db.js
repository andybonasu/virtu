const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Disable query logging
  }
);

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connection successful!'))
  .catch((err) => console.error('Database connection failed:', err));

module.exports = sequelize;
