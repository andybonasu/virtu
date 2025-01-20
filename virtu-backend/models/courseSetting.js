const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CourseSetting = sequelize.define(
    'CourseSetting',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      configType: {
        type: DataTypes.ENUM('day_plan', 'reps_sets', 'module_config', 'custom'),
        allowNull: false,
      },
      configKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      configValue: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      timestamps: true,
      tableName: 'CourseSettings',
    }
  );

  // Relationships
  CourseSetting.associate = (models) => {
    CourseSetting.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course',
      onDelete: 'CASCADE',
    });
  };

  return CourseSetting;
};
