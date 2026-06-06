const db = require("../models");

const Order = db.Order;
const OrderStatusUpdate = db.OrderStatusUpdate;
const User = db.User;

const createNotification = require("../utils/createNotification");

const addStatusUpdate = async (req, res) => {
  try {
    const { orderId } = req.params;

    const {
      title,
      note,
      latitude,
      longitude,
      status,
    } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      req.user.role === "driver" &&
      order.driverId !== req.userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const update = await OrderStatusUpdate.create({
      orderId,
      updatedBy: req.userId,
      status: status || order.status,
      title,
      note,
      latitude,
      longitude,
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Shipment Update",
      message: `${title} for Order #${order.id}`,
      type: "shipment_update",
    });

    await createNotification({
      roleTarget: "admin",
      orderId: order.id,
      title: "Shipment Update",
      message: `${title} for Order #${order.id}`,
      type: "shipment_update",
    });

    res.status(201).json({
      message: "Journey update added successfully",
      update,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error adding journey update",
      error: error.message,
    });
  }
};

module.exports = {
  addStatusUpdate,
};