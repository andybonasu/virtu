'use strict';
module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
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
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'created_at'
    }
  }, {
    tableName: 'Sections',
    updatedAt: false
  });

  Section.associate = models => {
    Section.belongsTo(models.AssignedCourse, {
      foreignKey: 'assigned_course_id'
    });
    Section.hasMany(models.Block, {
      foreignKey: 'section_id'
    });    
    Section.hasMany(models.Submission, {
      foreignKey: 'section_id'
    });    
  };

  return Section;
};
