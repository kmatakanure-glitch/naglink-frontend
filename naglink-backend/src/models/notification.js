"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Notification.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
  }

  Notification.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      roleTarget: {
        type: DataTypes.ENUM("admin", "customer", "driver"),
        allowNull: true,
      },

      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "info",
      },

      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "Notifications",
    }
  );

  return Notification;
};