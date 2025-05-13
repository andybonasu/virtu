'use strict';
module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
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
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'submitted_at'
    }
  }, {
    tableName: 'Submissions',
    updatedAt: false
  });

  Submission.associate = models => {
    Submission.belongsTo(models.User, {
      as: 'client',
      foreignKey: 'client_id'
    });
    Submission.belongsTo(models.Section, {
      foreignKey: 'section_id'
    });
  };

  return Submission;
};
