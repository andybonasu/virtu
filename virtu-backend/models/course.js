const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the database connection

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    trainer_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: 'courses',
    timestamps: true,
});

module.exports = Course;

const User = require('./user');
const Session = require('./session');
const Payment = require('./payment');

// Define relationships
Course.belongsTo(User, { foreignKey: 'trainer_id' });
Course.hasMany(Session, { foreignKey: 'course_id' });
Course.hasMany(Payment, { foreignKey: 'course_id' });

module.exports = Course;


