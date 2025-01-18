const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the database connection

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    media: {
        type: DataTypes.STRING, // URL to media files like videos or images
        allowNull: true,
    },
}, {
    tableName: 'sessions',
    timestamps: true,
});

module.exports = Session;

const Course = require('./course');

// Define relationships
Session.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Session;
