'use strict';
module.exports = (sequelize, DataTypes) => {
  const BaseCourse = sequelize.define('BaseCourse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'BaseCourses',
    updatedAt: false
  });

  BaseCourse.associate = models => {
    BaseCourse.belongsTo(models.User, {
      as: 'trainer',
      foreignKey: 'trainer_id'
    });
    BaseCourse.hasMany(models.AssignedCourse, {
      foreignKey: 'base_course_id'
    });    
    BaseCourse.hasOne(models.PublicCourse, {
      foreignKey: 'base_course_id'
    });    
  };

  return BaseCourse;
};
