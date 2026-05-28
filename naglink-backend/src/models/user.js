"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: "customerId",
        as: "orders",
      });

      User.hasMany(models.Order, {
        foreignKey: "driverId",
        as: "driverOrders",
      });

      User.hasMany(models.Quote, {
        foreignKey: "customerId",
        as: "quotes",
      });

      User.hasOne(models.Truck, {
        foreignKey: "assignedDriverId",
        as: "assignedTruck",
      });

      User.hasMany(models.OrderLocation, {
        foreignKey: "driverId",
        as: "locationUpdates",
      });

      User.hasMany(models.OrderStatusUpdate, {
        foreignKey: "updatedBy",
        as: "orderStatusUpdates",
      });

      User.hasMany(models.Notification, {
        foreignKey: "userId",
        as: "notifications",
      });

      User.hasMany(models.Invoice, {
        foreignKey: "customerId",
        as: "invoices",
      });

      User.hasMany(models.Message, {
        foreignKey: "senderId",
        as: "sentMessages",
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM("customer", "driver", "admin"),
        defaultValue: "customer",
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};