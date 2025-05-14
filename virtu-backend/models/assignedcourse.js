'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssignedCourse extends Model {
    static associate(models) {
      AssignedCourse.belongsTo(models.BaseCourse, {
        foreignKey: 'base_course_id'
      });

      AssignedCourse.belongsTo(models.User, {
        as: 'trainer',
        foreignKey: 'trainer_id'
      });

      AssignedCourse.belongsTo(models.User, {
        as: 'client',
        foreignKey: 'client_id'
      });

      AssignedCourse.hasMany(models.Section, {
        foreignKey: 'assigned_course_id'
      });

      AssignedCourse.hasMany(models.Payment, {
        foreignKey: 'assigned_course_id'
      });
    }
  }

  AssignedCourse.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    base_course_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AssignedCourse',
    tableName: 'AssignedCourses',
    timestamps: false
  });

  return AssignedCourse;
};
