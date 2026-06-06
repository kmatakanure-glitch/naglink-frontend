'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create junction table for Order-Truck many-to-many relationship
    await queryInterface.createTable('OrderTrucks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      truckId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Trucks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      packageNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('assigned', 'loading', 'in_transit', 'offloading', 'delivered', 'cancelled'),
        defaultValue: 'assigned'
      },
      loadingDocumentUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      offloadingDocumentUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      loadingApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      offloadingApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      loadingNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      departureTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actualDepartureTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      forecastedArrival: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actualArrivalTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      currentLocation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastUpdate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
    await queryInterface.dropTable('OrderTrucks');
  }
};