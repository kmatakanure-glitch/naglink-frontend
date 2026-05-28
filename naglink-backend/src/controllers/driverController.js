const db = require("../models");

const Order = db.Order;
const User = db.User;
const Truck = db.Truck;
const OrderLocation = db.OrderLocation;
const OrderStatusUpdate = db.OrderStatusUpdate;

const createNotification = require("../utils/createNotification");

const getOrderLabel = (order) => order.orderNumber || `#${order.id}`;

// Driver gets orders assigned to them
const getMyAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { driverId: req.userId },
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["username", "email", "phone", "companyName"],
        },
        {
          model: Truck,
          as: "truck",
        },
        {
          model: OrderLocation,
          as: "locations",
          separate: true,
          order: [["createdAt", "DESC"]],
        },
        {
          model: OrderStatusUpdate,
          as: "statusUpdates",
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              as: "updatedByUser",
              attributes: ["username", "role"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ orders });
  } catch (error) {
    console.error("Driver orders error:", error);

    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Driver starts loading
const startLoading = async (req, res) => {
  try {
    const { id } = req.params;
    const { packageNumber, weight, loadingNotes } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.driverId !== req.userId) {
      return res.status(403).json({
        message: "Access denied. This order is not assigned to you.",
      });
    }

    if (order.status !== "approved") {
      return res.status(400).json({
        message: `Cannot start loading. Order status is ${order.status}`,
      });
    }

    let loadingDocumentUrl = null;

    if (req.file) {
      loadingDocumentUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/loading-docs/${req.file.filename}`;
    }

    await order.update({
      packageNumber,
      weight: weight || order.weight,
      loadingNotes,
      loadingDocumentUrl,
      status: "loading",
    });

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "loading",
      title: "Loading Started",
      note: loadingNotes || "Driver started loading cargo.",
      locationName: order.pickupLocation,
      proofImageUrl: loadingDocumentUrl,
    });

    const orderLabel = getOrderLabel(order);

    await createNotification({
      roleTarget: "admin",
      orderId: order.id,
      title: "Loading Started",
      message: `Driver started loading for order ${orderLabel}. Waiting for admin approval.`,
      type: "loading_started",
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Loading Started",
      message: `Loading has started for your order ${orderLabel}.`,
      type: "loading_started",
    });

    res.json({
      message:
        "Loading details submitted successfully. Waiting for admin approval.",
      order,
    });
  } catch (error) {
    console.error("Start loading error:", error);

    res.status(500).json({
      message: "Error updating loading details",
      error: error.message,
    });
  }
};

// Driver uploads offloading document
const uploadOffloadingDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.driverId !== req.userId) {
      return res.status(403).json({
        message: "Access denied. This order is not assigned to you.",
      });
    }

    if (
      !["in_transit", "arrived_at_destination", "waiting_to_offload"].includes(
        order.status
      )
    ) {
      return res.status(400).json({
        message: `Cannot upload POD. Order status is ${order.status}`,
      });
    }

    let offloadingDocumentUrl = null;

    if (req.file) {
      offloadingDocumentUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/offloading-docs/${req.file.filename}`;
    }

    await order.update({
      offloadingDocumentUrl,
      status: "offloading",
    });

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "offloading",
      title: "Offloading Started",
      note: "Driver uploaded proof of delivery/offloading document.",
      locationName: order.deliveryLocation,
      proofImageUrl: offloadingDocumentUrl,
    });

    const orderLabel = getOrderLabel(order);

    await createNotification({
      roleTarget: "admin",
      orderId: order.id,
      title: "Offloading Started",
      message: `Driver uploaded offloading proof for order ${orderLabel}. Waiting for admin approval.`,
      type: "offloading_started",
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Offloading Started",
      message: `Offloading has started for your order ${orderLabel}.`,
      type: "offloading_started",
    });

    res.json({
      message:
        "Offloading document uploaded successfully. Waiting for admin approval.",
      order,
    });
  } catch (error) {
    console.error("Upload offloading error:", error);

    res.status(500).json({
      message: "Error uploading offloading document",
      error: error.message,
    });
  }
};

// Driver marks trip as complete
const completeTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.driverId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!order.offloadingApproved) {
      return res.status(400).json({
        message: "Cannot complete trip. Offloading has not been approved yet.",
      });
    }

    await order.update({ status: "delivered" });

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "delivered",
      title: "Order Delivered",
      note: "Driver marked the order as delivered.",
      locationName: order.deliveryLocation,
    });

    const orderLabel = getOrderLabel(order);

    await createNotification({
      roleTarget: "admin",
      orderId: order.id,
      title: "Order Delivered",
      message: `Driver marked order ${orderLabel} as delivered.`,
      type: "order_delivered",
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Order Delivered",
      message: `Your order ${orderLabel} has been marked as delivered.`,
      type: "order_delivered",
    });

    if (order.truckId) {
      await Truck.update(
        { isAvailable: true },
        { where: { id: order.truckId } }
      );
    }

    await User.update({ isAvailable: true }, { where: { id: req.userId } });

    res.json({
      message: "Trip completed successfully! Order delivered.",
      order,
    });
  } catch (error) {
    console.error("Complete trip error:", error);

    res.status(500).json({
      message: "Error completing trip",
      error: error.message,
    });
  }
};

const getMyTripHistory = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        driverId: req.userId,
        status: "delivered",
      },
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["username", "companyName"],
        },
        {
          model: Truck,
          as: "truck",
        },
        {
          model: OrderStatusUpdate,
          as: "statusUpdates",
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              as: "updatedByUser",
              attributes: ["username", "role"],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.json({ history: orders });
  } catch (error) {
    console.error("Trip history error:", error);

    res.status(500).json({
      message: "Error fetching trip history",
      error: error.message,
    });
  }
};

module.exports = {
  getMyAssignedOrders,
  startLoading,
  uploadOffloadingDocument,
  completeTrip,
  getMyTripHistory,
};