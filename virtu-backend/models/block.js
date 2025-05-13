'use strict';
module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define('Block', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    section_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    text_content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'Blocks',
    updatedAt: false
  });

  Block.associate = models => {
    Block.belongsTo(models.Section, {
      foreignKey: 'section_id'
    });
  };

  return Block;
};
