const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'Categories',
    }
  );

  // Relationships
  Category.associate = (models) => {
    Category.hasMany(models.Post, {
      foreignKey: 'category_id',
      as: 'posts',
      onDelete: 'SET NULL',
    });

    Category.hasMany(models.Course, {
      foreignKey: 'category_id',
      as: 'courses',
      onDelete: 'SET NULL',
    });
  };

  return Category;
};
