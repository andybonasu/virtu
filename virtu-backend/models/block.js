'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    static associate(models) {
      Block.belongsTo(models.Section, {
        foreignKey: 'section_id'
      });
    }
  }

  Block.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Block',
    tableName: 'Blocks',
    timestamps: false
  });

  return Block;
};
