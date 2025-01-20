const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TrainerVerification = sequelize.define(
    'TrainerVerification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      document_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      verificationType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'TrainerVerifications',
    }
  );

  // Relationships
  TrainerVerification.associate = (models) => {
    TrainerVerification.belongsTo(models.User, {
      foreignKey: 'trainer_id',
      as: 'trainer',
      onDelete: 'CASCADE',
    });

    TrainerVerification.belongsTo(models.User, {
      foreignKey: 'reviewer_id',
      as: 'reviewer',
      onDelete: 'SET NULL',
    });
  };

  return TrainerVerification;
};
