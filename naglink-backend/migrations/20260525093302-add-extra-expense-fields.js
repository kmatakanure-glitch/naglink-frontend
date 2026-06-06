'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Expenses', 'zimTolls', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Expenses', 'mozaTolls', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Expenses', 'roadAccess', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Expenses', 'vidCosts', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Expenses', 'emaCosts', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Expenses', 'portHealth', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Expenses', 'portFee', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Expenses', 'agentRunner', { type: Sequelize.FLOAT, defaultValue: 0 });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Expenses', 'zimTolls');
    await queryInterface.removeColumn('Expenses', 'mozaTolls');
    await queryInterface.removeColumn('Expenses', 'roadAccess');
    await queryInterface.removeColumn('Expenses', 'vidCosts');
    await queryInterface.removeColumn('Expenses', 'emaCosts');
    await queryInterface.removeColumn('Expenses', 'portHealth');
    await queryInterface.removeColumn('Expenses', 'portFee');
    await queryInterface.removeColumn('Expenses', 'agentRunner');
  },
};