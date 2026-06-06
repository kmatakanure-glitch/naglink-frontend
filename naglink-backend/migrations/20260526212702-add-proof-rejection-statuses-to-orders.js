"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'loading_rejected';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'offloading_rejected';
    `);

    await queryInterface.addColumn("Orders", "loadingRejectionReason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("Orders", "offloadingRejectionReason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "loadingRejectionReason");
    await queryInterface.removeColumn("Orders", "offloadingRejectionReason");

    // PostgreSQL enum values cannot be easily removed safely.
    // Leave enum values in place.
  },
};