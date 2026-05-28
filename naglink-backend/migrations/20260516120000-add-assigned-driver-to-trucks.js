"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Trucks");

    if (!table.assignedDriverId) {
      await queryInterface.addColumn("Trucks", "assignedDriverId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Trucks");

    if (table.assignedDriverId) {
      await queryInterface.removeColumn("Trucks", "assignedDriverId");
    }
  },
};