"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'en_route_to_loading';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'loading_approved';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'arrived_at_destination';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'waiting_to_offload';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'offloading_approved';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" ADD VALUE IF NOT EXISTS 'customer_confirmed';
    `);
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL does not safely remove enum values directly.
  },
};