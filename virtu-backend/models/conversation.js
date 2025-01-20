const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Conversation = sequelize.define(
    'Conversation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      timestamps: true,
      tableName: 'Conversations',
    }
  );

  // Relationships
  Conversation.associate = (models) => {
    Conversation.belongsTo(models.User, {
      foreignKey: 'trainer_id',
      as: 'trainer',
      onDelete: 'CASCADE',
    });

    Conversation.belongsTo(models.User, {
      foreignKey: 'client_id',
      as: 'client',
      onDelete: 'CASCADE',
    });

    Conversation.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course',
      onDelete: 'SET NULL',
    });

    Conversation.hasMany(models.Message, {
      foreignKey: 'conversation_id',
      as: 'messages',
      onDelete: 'CASCADE',
    });
  };

  return Conversation;
};
