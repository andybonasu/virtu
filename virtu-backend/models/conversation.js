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
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'Conversations',
    }
  );

  // Relationships
  Conversation.associate = (models) => {
    // Relationship to User for the creator of the conversation
    Conversation.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
      onDelete: 'CASCADE',
    });

    // Relationship to User for the trainer
    Conversation.belongsTo(models.User, {
      foreignKey: 'trainer_id',
      as: 'trainer',
      onDelete: 'CASCADE',
    });

    // Relationship to User for the client
    Conversation.belongsTo(models.User, {
      foreignKey: 'client_id',
      as: 'client',
      onDelete: 'CASCADE',
    });

    // Relationship to Course
    Conversation.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course',
      onDelete: 'SET NULL',
    });

    // Relationship to Messages
    Conversation.hasMany(models.Message, {
      foreignKey: 'conversation_id',
      as: 'messages',
      onDelete: 'CASCADE',
    });
  };

  return Conversation;
};
