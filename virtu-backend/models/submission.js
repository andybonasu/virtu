'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      Submission.belongsTo(models.User, {
        as: 'client',
        foreignKey: 'client_id'
      });

      Submission.belongsTo(models.Section, {
        foreignKey: 'section_id'
      });
    }
  }

  Submission.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    section_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    text_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    submitted_at: {
      type: DataTypes.DATE,
      field: 'submitted_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Submission',
    tableName: 'Submissions',
    timestamps: false
  });

  return Submission;
};
