"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderLocation extends Model {
    static associate(models) {
      OrderLocation.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });

      OrderLocation.belongsTo(models.User, {
        foreignKey: "driverId",
        as: "driver",
      });
    }
  }

  OrderLocation.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },

      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },

      locationName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderLocation",
      tableName: "OrderLocations",
    }
  );

  return OrderLocation;
};