'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    assigned_course_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'Payments',
    updatedAt: false
  });

  Payment.associate = models => {
    Payment.belongsTo(models.User, { as: 'client', foreignKey: 'client_id' });
    Payment.belongsTo(models.User, { as: 'trainer', foreignKey: 'trainer_id' });
    Payment.belongsTo(models.AssignedCourse, { foreignKey: 'assigned_course_id' });
  };

  return Payment;
};
