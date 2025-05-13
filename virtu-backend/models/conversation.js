'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user1_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user2_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'Conversations',
    updatedAt: false
  });

  Conversation.associate = models => {
    Conversation.belongsTo(models.User, { as: 'user1', foreignKey: 'user1_id' });
    Conversation.belongsTo(models.User, { as: 'user2', foreignKey: 'user2_id' });
    Conversation.hasMany(models.Message, { foreignKey: 'conversation_id' });
  };

  return Conversation;
};
