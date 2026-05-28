'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderTruck extends Model {
    static associate(models) {
      OrderTruck.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
      OrderTruck.belongsTo(models.Truck, { foreignKey: 'truckId', as: 'truck' });
      OrderTruck.belongsTo(models.User, { foreignKey: 'driverId', as: 'driver' });
    }
  }
  
  OrderTruck.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    truckId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trucks',
        key: 'id'
      }
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    packageNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('assigned', 'loading', 'in_transit', 'offloading', 'delivered', 'cancelled'),
      defaultValue: 'assigned'
    },
    loadingDocumentUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    offloadingDocumentUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loadingApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    offloadingApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    loadingNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actualDepartureTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    forecastedArrival: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actualArrivalTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currentLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'OrderTruck',
    tableName: 'OrderTrucks'
  });
  
  return OrderTruck;
};