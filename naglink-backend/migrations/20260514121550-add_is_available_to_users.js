'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Check if column exists before adding
      const tableDescription = await queryInterface.describeTable('Users');
      if (!tableDescription.isAvailable) {
        await queryInterface.addColumn('Users', 'isAvailable', {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        });
        console.log('Added isAvailable column to Users table');
      }
    } catch (error) {
      console.log('Column might already exist:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const tableDescription = await queryInterface.describeTable('Users');
      if (tableDescription.isAvailable) {
        await queryInterface.removeColumn('Users', 'isAvailable');
      }
    } catch (error) {
      console.log('Error removing column:', error.message);
    }
  }
};