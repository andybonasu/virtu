const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define(
    'Course',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER, // Duration in hours or days
        allowNull: true,
      },
      level: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false,
        defaultValue: 'Beginner',
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      prerequisites: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      objectives: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      structure: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'Courses',
    }
  );

  // Relationships
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'trainer_id',
      as: 'trainer',
      onDelete: 'CASCADE',
    });

    Course.hasMany(models.Session, {
      foreignKey: 'course_id',
      as: 'sessions',
      onDelete: 'CASCADE',
    });

    Course.hasMany(models.Payment, {
      foreignKey: 'course_id',
      as: 'payments',
      onDelete: 'CASCADE',
    });

    Course.hasMany(models.CourseSetting, {
      foreignKey: 'course_id',
      as: 'settings',
      onDelete: 'CASCADE',
    });

    Course.hasMany(models.Conversation, {
      foreignKey: 'course_id',
      as: 'conversations',
      onDelete: 'SET NULL',
    });
  };

  return Course;
};
