'use strict';
module.exports = (sequelize, DataTypes) => {
  const AssignedCourse = sequelize.define('AssignedCourse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    base_course_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'created_at'
    }
  }, {
    tableName: 'AssignedCourses',
    updatedAt: false
  });

  AssignedCourse.associate = models => {
    AssignedCourse.belongsTo(models.User, { as: 'client', foreignKey: 'client_id' });
    AssignedCourse.belongsTo(models.User, { as: 'trainer', foreignKey: 'trainer_id' });
    AssignedCourse.belongsTo(models.BaseCourse, { foreignKey: 'base_course_id' });
    AssignedCourse.hasMany(models.Section, {foreignKey: 'assigned_course_id'});
    AssignedCourse.hasMany(models.Payment, { foreignKey: 'assigned_course_id' });

    
  };

  return AssignedCourse;
};
