const { Sequelize } = require('sequelize');

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000,
    },
});

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection successful!');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Export the Sequelize instance for use in other parts of the app
module.exports = sequelize;

