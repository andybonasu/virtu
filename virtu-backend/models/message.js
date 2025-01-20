const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define(
    'Message',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('sent', 'delivered', 'read'),
        allowNull: false,
        defaultValue: 'sent',
      },
    },
    {
      timestamps: true,
      tableName: 'Messages',
    }
  );

  // Relationships
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender',
      onDelete: 'CASCADE',
    });

    Message.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      as: 'receiver',
      onDelete: 'CASCADE',
    });

    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversation_id',
      as: 'conversation',
      onDelete: 'CASCADE',
    });
  };

  return Message;
};
