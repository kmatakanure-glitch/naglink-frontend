"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "customerId",
        as: "customer",
      });

      Order.belongsTo(models.User, {
        foreignKey: "driverId",
        as: "driver",
      });

      Order.belongsTo(models.Truck, {
        foreignKey: "truckId",
        as: "truck",
      });

      Order.hasMany(models.Expense, {
        foreignKey: "orderId",
        as: "expenses",
      });

      Order.hasMany(models.OrderTruck, {
        foreignKey: "orderId",
        as: "trucks",
      });

      Order.hasMany(models.OrderLocation, {
        foreignKey: "orderId",
        as: "locations",
      });

      Order.hasMany(models.OrderStatusUpdate, {
        foreignKey: "orderId",
        as: "statusUpdates",
      });

      Order.hasMany(models.Notification, {
        foreignKey: "orderId",
        as: "notifications",
      });

      Order.hasOne(models.Quote, {
        foreignKey: "orderId",
        as: "quote",
      });

      Order.hasOne(models.Invoice, {
        foreignKey: "orderId",
        as: "invoice",
      });
    }
  }

  Order.init(
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      truckId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      pickupLocation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      deliveryLocation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      goodsDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      weight: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      packageNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "approved",
          "en_route_to_loading",
          "loading",
          "loading_rejected",
          "loading_approved",
          "in_transit",
          "arrived_at_destination",
          "waiting_to_offload",
          "offloading",
          "offloading_rejected",
          "offloading_approved",
          "delivered",
          "customer_confirmed",
          "cancelled"
        ),
        defaultValue: "pending",
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      departureTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      forecastedArrival: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      approvalStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },

      loadingDocumentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      offloadingDocumentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      loadingApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      offloadingApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      loadingNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      loadingRejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      offloadingRejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};