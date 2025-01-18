const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the database connection

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('unread', 'read'),
        defaultValue: 'unread',
    },
}, {
    tableName: 'notifications',
    timestamps: true,
});

module.exports = Notification;

const User = require('./user');

// Define relationships
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Notification;
