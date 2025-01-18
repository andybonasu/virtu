const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the database connection

const ToDo = sequelize.define('ToDo', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending',
    },
}, {
    tableName: 'todos',
    timestamps: true,
});

module.exports = ToDo;

const User = require('./user');

// Define relationships
ToDo.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ToDo;
