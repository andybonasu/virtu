const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserBadge = sequelize.define(
    'UserBadge',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      earnedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      tableName: 'UserBadges',
    }
  );

  // Relationships
  UserBadge.associate = (models) => {
    UserBadge.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });

    UserBadge.belongsTo(models.Badge, {
      foreignKey: 'badge_id',
      as: 'badge',
      onDelete: 'CASCADE',
    });
  };

  return UserBadge;
};
