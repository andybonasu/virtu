const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ToDo = sequelize.define(
    'ToDo',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      task: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'overdue'),
        allowNull: false,
        defaultValue: 'pending',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        allowNull: false,
        defaultValue: 'Medium',
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'ToDos',
    }
  );

  // Relationships
  ToDo.associate = (models) => {
    ToDo.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });

    ToDo.belongsTo(models.ToDo, {
      foreignKey: 'dependencyId',
      as: 'dependency',
      onDelete: 'SET NULL',
    });
  };

  return ToDo;
};
