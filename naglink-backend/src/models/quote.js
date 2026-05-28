'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quote extends Model {
    static associate(models) {
      // Quote belongs to Customer
      Quote.belongsTo(models.User, { foreignKey: 'customerId', as: 'customer' });
      
      // Quote belongs to Order
      Quote.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    }
  }
  
  Quote.init({
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pickupCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deliveryCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    goodsType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preferredService: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estimatedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    status: {
  type: DataTypes.ENUM("pending", "open", "closed"),
  defaultValue: "pending",
}
  }, {
    sequelize,
    modelName: 'Quote',
  });
  
  return Quote;
};