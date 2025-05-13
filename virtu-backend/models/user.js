'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
        // A trainer can have many base courses
        User.hasMany(models.BaseCourse, {
          as: 'baseCourses',
          foreignKey: 'trainer_id'
        });
        User.hasMany(models.AssignedCourse, {
          as: 'assignedCoursesAsClient',
          foreignKey: 'client_id'
        });
        User.hasMany(models.AssignedCourse, {
          as: 'assignedCoursesAsTrainer',
          foreignKey: 'trainer_id'
        });             
        User.hasMany(models.Submission, {
          as: 'submissions',
          foreignKey: 'client_id'
        });     
        User.hasMany(models.PublicCourse, {
          as: 'publicCourses',
          foreignKey: 'trainer_id'
        });
        User.hasMany(models.Payment, { as: 'paymentsAsClient', foreignKey: 'client_id' });
        User.hasMany(models.Payment, { as: 'paymentsAsTrainer', foreignKey: 'trainer_id' });
        User.hasMany(models.Conversation, { as: 'conversations1', foreignKey: 'user1_id' });
        User.hasMany(models.Conversation, { as: 'conversations2', foreignKey: 'user2_id' });
        User.hasMany(models.Message, {
          foreignKey: 'sender_id'
        });     
        User.hasMany(models.AdminAction, {
          as: 'adminLogs',
          foreignKey: 'admin_id'
        });
           
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    role: DataTypes.ENUM('client', 'trainer', 'admin'),
    background_url: DataTypes.STRING,
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
