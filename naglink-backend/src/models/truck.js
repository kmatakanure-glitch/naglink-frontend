"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Truck extends Model {
    static associate(models) {
      Truck.hasMany(models.Order, { foreignKey: "truckId", as: "orders" });

      Truck.hasMany(models.OrderTruck, {
        foreignKey: "truckId",
        as: "orderAssignments",
      });

      Truck.belongsTo(models.User, {
        foreignKey: "assignedDriverId",
        as: "assignedDriver",
      });
    }
  }

  Truck.init(
    {
      truckName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      capacity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      assignedDriverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Truck",
    }
  );

  return Truck;
};