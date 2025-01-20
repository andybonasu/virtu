const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Questionnaire = sequelize.define(
    'Questionnaire',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      questions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      responseCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      tableName: 'Questionnaires',
    }
  );

  // Relationships
  Questionnaire.associate = (models) => {
    Questionnaire.belongsTo(models.User, {
      foreignKey: 'trainer_id',
      as: 'trainer',
      onDelete: 'CASCADE',
    });
  };

  return Questionnaire;
};
