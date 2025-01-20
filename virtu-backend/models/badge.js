const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Badge = sequelize.define(
    'Badge',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      iconUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      criteria: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'Badges',
    }
  );

  // Relationships
  Badge.associate = (models) => {
    Badge.hasMany(models.UserBadge, {
      foreignKey: 'badge_id',
      as: 'userBadges',
      onDelete: 'CASCADE',
    });
  };

  return Badge;
};
