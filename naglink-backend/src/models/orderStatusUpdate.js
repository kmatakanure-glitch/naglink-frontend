"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderStatusUpdate extends Model {
    static associate(models) {
      OrderStatusUpdate.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });

      OrderStatusUpdate.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "updatedByUser",
      });
    }
  }

  OrderStatusUpdate.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      proofImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      locationName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "OrderStatusUpdate",
      tableName: "OrderStatusUpdates",
    }
  );

  return OrderStatusUpdate;
};