'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define relationships here
      User.hasMany(models.BaseCourse, {
        foreignKey: 'trainer_id'
      });

      User.hasMany(models.AssignedCourse, {
        as: 'assignedCoursesAsTrainer',
        foreignKey: 'trainer_id'
      });

      User.hasMany(models.AssignedCourse, {
        as: 'assignedCoursesAsClient',
        foreignKey: 'client_id'
      });

      User.hasMany(models.PublicCourse, {
        foreignKey: 'trainer_id'
      });

      User.hasMany(models.Payment, {
        as: 'paymentsAsClient',
        foreignKey: 'client_id'
      });

      User.hasMany(models.Payment, {
        as: 'paymentsAsTrainer',
        foreignKey: 'trainer_id'
      });

      User.hasMany(models.Submission, {
        foreignKey: 'client_id'
      });

      User.hasMany(models.Message, {
        foreignKey: 'sender_id'
      });

      User.hasMany(models.Conversation, {
        as: 'conversations1',
        foreignKey: 'user1_id'
      });

      User.hasMany(models.Conversation, {
        as: 'conversations2',
        foreignKey: 'user2_id'
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'trainer', 'client'),
      allowNull: false
    },
    background_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false // disables Sequelize auto `createdAt` / `updatedAt`
  });

  return User;
};
