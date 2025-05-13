'use strict';
module.exports = (sequelize, DataTypes) => {
  const AdminAction = sequelize.define('AdminAction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    admin_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    action_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'created_at'
    }
  }, {
    tableName: 'AdminActions',
    updatedAt: false
  });

  AdminAction.associate = models => {
    AdminAction.belongsTo(models.User, {
      as: 'admin',
      foreignKey: 'admin_id'
    });
  };

  return AdminAction;
};
