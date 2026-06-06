"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Users");

    if (!table.profileImageUrl) {
      await queryInterface.addColumn("Users", "profileImageUrl", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Users");

    if (table.profileImageUrl) {
      await queryInterface.removeColumn("Users", "profileImageUrl");
    }
  },
};