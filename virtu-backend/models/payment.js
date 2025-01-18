const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the database connection

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
    },
}, {
    tableName: 'payments',
    timestamps: true,
});

module.exports = Payment;

const User = require('./user');
const Course = require('./course');

// Define relationships
Payment.belongsTo(User, { foreignKey: 'user_id' });
Payment.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Payment;
