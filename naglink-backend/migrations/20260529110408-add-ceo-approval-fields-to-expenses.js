"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Expenses", "status", {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    });

    await queryInterface.addColumn("Expenses", "requestedBy", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("Expenses", "approvedBy", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("Expenses", "approvedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Expenses", "wasEditedByCEO", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("Expenses", "ceoEditNote", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Expenses", "ceoEditNote");
    await queryInterface.removeColumn("Expenses", "wasEditedByCEO");
    await queryInterface.removeColumn("Expenses", "approvedAt");
    await queryInterface.removeColumn("Expenses", "approvedBy");
    await queryInterface.removeColumn("Expenses", "requestedBy");
    await queryInterface.removeColumn("Expenses", "status");
  },
};