'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check and add columns only if they don't exist
    const tableDescription = await queryInterface.describeTable('Orders');
    
    // Update status enum if needed
    try {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_Orders_status" RENAME TO "enum_Orders_status_old";
        CREATE TYPE "enum_Orders_status" AS ENUM('pending', 'approved', 'loading', 'in_transit', 'offloading', 'delivered', 'cancelled');
        ALTER TABLE "Orders" ALTER COLUMN "status" DROP DEFAULT;
        ALTER TABLE "Orders" ALTER COLUMN "status" TYPE "enum_Orders_status" USING ("status"::text::"enum_Orders_status");
        ALTER TABLE "Orders" ALTER COLUMN "status" SET DEFAULT 'pending';
        DROP TYPE "enum_Orders_status_old";
      `);
    } catch (error) {
      console.log('Status enum already updated or error:', error.message);
    }
    
    // Add packageNumber if not exists
    if (!tableDescription.packageNumber) {
      await queryInterface.addColumn('Orders', 'packageNumber', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    // Add loadingDocumentUrl if not exists
    if (!tableDescription.loadingDocumentUrl) {
      await queryInterface.addColumn('Orders', 'loadingDocumentUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    // Add offloadingDocumentUrl if not exists
    if (!tableDescription.offloadingDocumentUrl) {
      await queryInterface.addColumn('Orders', 'offloadingDocumentUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    // Add loadingApproved if not exists
    if (!tableDescription.loadingApproved) {
      await queryInterface.addColumn('Orders', 'loadingApproved', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      });
    }
    
    // Add offloadingApproved if not exists
    if (!tableDescription.offloadingApproved) {
      await queryInterface.addColumn('Orders', 'offloadingApproved', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      });
    }
    
    // Add loadingNotes if not exists
    if (!tableDescription.loadingNotes) {
      await queryInterface.addColumn('Orders', 'loadingNotes', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Orders');
    
    if (tableDescription.packageNumber) {
      await queryInterface.removeColumn('Orders', 'packageNumber');
    }
    if (tableDescription.loadingDocumentUrl) {
      await queryInterface.removeColumn('Orders', 'loadingDocumentUrl');
    }
    if (tableDescription.offloadingDocumentUrl) {
      await queryInterface.removeColumn('Orders', 'offloadingDocumentUrl');
    }
    if (tableDescription.loadingApproved) {
      await queryInterface.removeColumn('Orders', 'loadingApproved');
    }
    if (tableDescription.offloadingApproved) {
      await queryInterface.removeColumn('Orders', 'offloadingApproved');
    }
    if (tableDescription.loadingNotes) {
      await queryInterface.removeColumn('Orders', 'loadingNotes');
    }
  }
};