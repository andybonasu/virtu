const { Sequelize } = require('sequelize');

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize('virtu_app', 'postgres', 'Anudeepb@123', {
    host: 'localhost',
    dialect: 'postgres', // Using PostgreSQL
    logging: false,      // Set to true to enable SQL query logging
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
