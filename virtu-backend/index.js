const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};

// Log: Starting script
console.log('Starting index.js execution...');

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Enable for SQL query logs
  }
);

// Log: Sequelize initialized
console.log('Sequelize initialized.');

// Dynamically load all model files in the same directory as `index.js`
fs.readdirSync(path.join(__dirname, 'models')) // Adjust path to models directory
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
  .forEach((file) => {
    try {
      console.log(`Loading model file: ${file}`); // Log model file being loaded
      const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
      console.log(`Successfully loaded model: ${model.name}`);
    } catch (error) {
      console.error(`Error loading model file: ${file}`, error.message);
    }
  });

// Log: All models loaded
console.log('All models loaded:', Object.keys(db));

// Define relationships (associations)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Log: Relationships defined
console.log('Relationships defined.');

// Attach Sequelize instance and class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connection successful!'))
  .catch((err) => console.error('Database connection failed:', err));

// Sync database (use `force: true` for testing purposes)
sequelize
  .sync({ force: true }) // Drops tables and recreates them
  .then(() => console.log('Database synced successfully!'))
  .catch((err) => console.error('Error syncing database:', err));

// Log: Exporting models
console.log('Exporting models.');

module.exports = db;
