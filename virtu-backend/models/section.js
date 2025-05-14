'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate(models) {
      Section.belongsTo(models.AssignedCourse, {
        foreignKey: 'assigned_course_id'
      });

      Section.hasMany(models.Block, {
        foreignKey: 'section_id'
      });

      Section.hasMany(models.Submission, {
        foreignKey: 'section_id'
      });
    }
  }

  Section.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    assigned_course_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Section',
    tableName: 'Sections',
    timestamps: false
  });

  return Section;
};
