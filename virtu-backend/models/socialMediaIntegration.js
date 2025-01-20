const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SocialMediaIntegration = sequelize.define(
    'SocialMediaIntegration',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'SocialMediaIntegrations',
    }
  );

  // Relationships
  SocialMediaIntegration.associate = (models) => {
    SocialMediaIntegration.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return SocialMediaIntegration;
};
