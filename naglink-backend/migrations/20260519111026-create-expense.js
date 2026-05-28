'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER
      },
      fuel: {
        type: Sequelize.FLOAT
      },
      tollgate: {
        type: Sequelize.FLOAT
      },
      maintenance: {
        type: Sequelize.FLOAT
      },
      driverAllowance: {
        type: Sequelize.FLOAT
      },
      loadingCost: {
        type: Sequelize.FLOAT
      },
      offloadingCost: {
        type: Sequelize.FLOAT
      },
      otherDescription: {
        type: Sequelize.TEXT
      },
      otherCost: {
        type: Sequelize.FLOAT
      },
      totalAmount: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  }
};