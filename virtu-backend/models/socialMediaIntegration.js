const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the database connection

const SocialMediaIntegration = sequelize.define('SocialMediaIntegration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_details: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
}, {
    tableName: 'social_media_integrations',
    timestamps: true,
});

module.exports = SocialMediaIntegration;

const User = require('./user');

// Define relationships
SocialMediaIntegration.belongsTo(User, { foreignKey: 'user_id' });

module.exports = SocialMediaIntegration;
