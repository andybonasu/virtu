module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("Users");

    // Add `approvalStatus` only if it does not already exist
    if (!tableDescription.approvalStatus) {
      await queryInterface.addColumn("Users", "approvalStatus", {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      });
    }

    // Add `rejectionReason` only if it does not already exist
    if (!tableDescription.rejectionReason) {
      await queryInterface.addColumn("Users", "rejectionReason", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    await queryInterface.changeColumn("Users", "isVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Check if TrainerVerifications table exists before modifying
    const trainerVerificationsTable = await queryInterface.describeTable("TrainerVerifications");

    // Rename `isVerified` to `status` in TrainerVerifications
    if (trainerVerificationsTable.isVerified) {
      await queryInterface.renameColumn("TrainerVerifications", "isVerified", "status");
    }

    // Add `reviewer_id` column if it doesn't exist
    if (!trainerVerificationsTable.reviewer_id) {
      await queryInterface.addColumn("TrainerVerifications", "reviewer_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "SET NULL",
      });
    }

    // Add `comments` column if it doesn't exist
    if (!trainerVerificationsTable.comments) {
      await queryInterface.addColumn("TrainerVerifications", "comments", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // ✅ Safe ENUM Update for `verificationType`
    await queryInterface.sequelize.query(`
      ALTER TABLE "TrainerVerifications" ALTER COLUMN "verificationType" TYPE TEXT USING "verificationType"::text;
      DROP TYPE IF EXISTS "enum_TrainerVerifications_verificationType";
      CREATE TYPE "enum_TrainerVerifications_verificationType" AS ENUM ('ID Proof', 'Certification', 'Other', 'Fitness Certification');
      ALTER TABLE "TrainerVerifications" ALTER COLUMN "verificationType" TYPE "enum_TrainerVerifications_verificationType" USING "verificationType"::text::"enum_TrainerVerifications_verificationType";
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "approvalStatus");
    await queryInterface.removeColumn("Users", "rejectionReason");

    await queryInterface.changeColumn("Users", "isVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.renameColumn("TrainerVerifications", "status", "isVerified");
    await queryInterface.removeColumn("TrainerVerifications", "reviewer_id");
    await queryInterface.removeColumn("TrainerVerifications", "comments");

    // Revert ENUM back to original
    await queryInterface.sequelize.query(`
      ALTER TABLE "TrainerVerifications" ALTER COLUMN "verificationType" TYPE TEXT USING "verificationType"::text;
      DROP TYPE IF EXISTS "enum_TrainerVerifications_verificationType";
      CREATE TYPE "enum_TrainerVerifications_verificationType" AS ENUM ('ID Proof', 'Certification', 'Other');
      ALTER TABLE "TrainerVerifications" ALTER COLUMN "verificationType" TYPE "enum_TrainerVerifications_verificationType" USING "verificationType"::text::"enum_TrainerVerifications_verificationType";
    `);
  },
};
