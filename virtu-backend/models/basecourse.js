'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BaseCourse extends Model {
    static associate(models) {
      BaseCourse.belongsTo(models.User, {
        as: 'trainer',
        foreignKey: 'trainer_id'
      });

      BaseCourse.hasOne(models.PublicCourse, {
        foreignKey: 'base_course_id'
      });

      BaseCourse.hasMany(models.AssignedCourse, {
        foreignKey: 'base_course_id'
      });
    }
  }

  BaseCourse.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: 'BaseCourse',
    tableName: 'BaseCourses',
    timestamps: false
  });

  return BaseCourse;
};
