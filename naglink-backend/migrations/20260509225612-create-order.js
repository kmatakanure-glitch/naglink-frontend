'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
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
      truckId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Trucks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pickupLocation: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      deliveryLocation: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      goodsDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'in_transit', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      departureTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      forecastedArrival: {
        type: Sequelize.DATE,
        allowNull: true
      },
      approvalStatus: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
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
    await queryInterface.dropTable('Orders');
  }
};