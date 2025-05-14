'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PublicCourse extends Model {
    static associate(models) {
      PublicCourse.belongsTo(models.BaseCourse, {
        foreignKey: 'base_course_id'
      });

      PublicCourse.belongsTo(models.User, {
        as: 'trainer',
        foreignKey: 'trainer_id'
      });
    }
  }

  PublicCourse.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    base_course_id: {
      type: DataTypes.UUID,
      allowNull: false
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
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PublicCourse',
    tableName: 'PublicCourses',
    timestamps: false
  });

  return PublicCourse;
};
