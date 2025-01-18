const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('trainer', 'student', 'admin'),
        defaultValue: 'student',
    },
}, {
    tableName: 'users', // Specify the table name explicitly
    timestamps: true,   // Add createdAt and updatedAt fields automatically
});

module.exports = User;

const Course = require('./course');
const ToDo = require('./todo');
const Payment = require('./payment');
const Notification = require('./notification');
const SocialMediaIntegration = require('./socialMediaIntegration');

// Define relationships
User.hasMany(Course, { foreignKey: 'trainer_id' });
User.hasMany(ToDo, { foreignKey: 'user_id' });
User.hasMany(Payment, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });
User.hasMany(SocialMediaIntegration, { foreignKey: 'user_id' });

module.exports = User;
