"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'ceo';
    `);
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL enum values cannot be safely removed easily.
  },
};