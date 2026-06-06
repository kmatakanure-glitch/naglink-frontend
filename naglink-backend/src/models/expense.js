"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });

      Expense.belongsTo(models.User, {
        foreignKey: "requestedBy",
        as: "requestedByUser",
      });

      Expense.belongsTo(models.User, {
        foreignKey: "approvedBy",
        as: "approvedByUser",
      });
    }
  }

  Expense.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      fuel: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      tollgate: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      zimTolls: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      mozaTolls: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      roadAccess: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      vidCosts: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      emaCosts: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      portHealth: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      portFee: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      agentRunner: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      maintenance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      driverAllowance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      loadingCost: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      offloadingCost: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      otherDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      otherCost: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      totalAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      status: {
        type: DataTypes.STRING("pending", "approved", "rejected"),
        defaultValue: "pending",
      },

      requestedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      wasEditedByCEO: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      ceoEditNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Expense",
    }
  );

  return Expense;
};