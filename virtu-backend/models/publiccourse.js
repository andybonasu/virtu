'use strict';
module.exports = (sequelize, DataTypes) => {
  const PublicCourse = sequelize.define('PublicCourse', {
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
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'PublicCourses',
    updatedAt: false
  });

  PublicCourse.associate = models => {
    PublicCourse.belongsTo(models.BaseCourse, {
      foreignKey: 'base_course_id'
    });
    PublicCourse.belongsTo(models.User, {
      as: 'trainer',
      foreignKey: 'trainer_id'
    });
  };

  return PublicCourse;
};
