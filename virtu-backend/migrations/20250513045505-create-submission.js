'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Submissions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      section_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Sections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      text_response: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      media_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Optional: enforce one submission per (client_id, section_id)
    await queryInterface.addConstraint('Submissions', {
      fields: ['section_id', 'client_id'],
      type: 'unique',
      name: 'unique_submission_per_section_client'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Submissions');
  }
};
