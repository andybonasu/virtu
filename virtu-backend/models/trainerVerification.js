const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TrainerVerification = sequelize.define(
    "TrainerVerification",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      trainer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      document_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verificationType: {
        type: DataTypes.ENUM("ID Proof", "Certification", "Other"),
        allowNull: false,
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reviewer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
    },
    {
      timestamps: true, // ✅ Keeps createdAt & updatedAt columns
      tableName: "TrainerVerifications", // ✅ Explicitly defines table name
    }
  );

  // Relationships
  TrainerVerification.associate = (models) => {
    TrainerVerification.belongsTo(models.User, {
      foreignKey: "trainer_id",
      as: "trainer",
      onDelete: "CASCADE",
    });

    TrainerVerification.belongsTo(models.User, {
      foreignKey: "reviewer_id",
      as: "reviewer",
      onDelete: "SET NULL",
    });
  };

  return TrainerVerification;
};
