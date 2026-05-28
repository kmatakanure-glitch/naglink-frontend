const db = require("../models");

const Order = db.Order;
const User = db.User;
const Truck = db.Truck;
const Invoice = db.Invoice;
const OrderStatusUpdate = db.OrderStatusUpdate;

const { Op, Sequelize } = require("sequelize");
const createNotification = require("../utils/createNotification");

const getOrderLabel = (order) => order.orderNumber || `#${order.id}`;

const getDashboardStats = async (req, res) => {
  try {
    const totalTrucks = await Truck.count();

    const availableTrucks = await Truck.count({
      where: { isAvailable: true },
    });

    const totalDrivers = await User.count({
      where: { role: "driver" },
    });

    const totalCustomers = await User.count({
      where: { role: "customer" },
    });

    const pendingOrders = await Order.count({
      where: { approvalStatus: "pending" },
    });

    const loadingPending = await Order.count({
      where: {
        status: "loading",
        loadingApproved: false,
      },
    });

    const loadingRejected = await Order.count({
      where: {
        status: "loading_rejected",
      },
    });

    const offloadingPending = await Order.count({
      where: {
        status: "offloading",
        offloadingApproved: false,
      },
    });

    const offloadingRejected = await Order.count({
      where: {
        status: "offloading_rejected",
      },
    });

    const inTransitOrders = await Order.count({
      where: { status: "in_transit" },
    });

    const completedOrders = await Order.count({
      where: {
        status: {
          [Op.in]: ["delivered", "customer_confirmed"],
        },
      },
    });

    const revenueOrders = await Order.findAll({
      where: {
        status: {
          [Op.in]: ["delivered", "customer_confirmed"],
        },
        price: {
          [Op.ne]: null,
        },
      },
      attributes: ["price", "createdAt"],
      order: [["createdAt", "ASC"]],
    });

    const totalRevenue = revenueOrders.reduce(
      (sum, order) => sum + Number(order.price || 0),
      0
    );

    const weeklyMap = {};

    revenueOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const year = date.getFullYear();

      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);

      const weekNumber = Math.ceil(
        (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
      );

      const weekKey = `${year} W${weekNumber}`;

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = 0;
      }

      weeklyMap[weekKey] += Number(order.price || 0);
    });

    const revenueByWeek = Object.entries(weeklyMap)
      .map(([week, revenue]) => ({
        week,
        revenue,
      }))
      .slice(-5);

    const highestRevenueWeek =
      revenueByWeek.length > 0
        ? revenueByWeek.reduce((highest, current) =>
            current.revenue > highest.revenue ? current : highest
          )
        : null;

    const pendingPayments =
      (await Order.sum("price", {
        where: {
          status: {
            [Op.notIn]: ["delivered", "customer_confirmed", "cancelled"],
          },
          price: {
            [Op.ne]: null,
          },
        },
      })) || 0;

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["username"],
        },
        {
          model: User,
          as: "driver",
          attributes: ["username"],
        },
      ],
    });

    res.json({
      trucks: {
        total: totalTrucks,
        available: availableTrucks,
        inUse: totalTrucks - availableTrucks,
      },
      drivers: totalDrivers,
      customers: totalCustomers,
      orders: {
        pending: pendingOrders,
        loadingPending,
        loadingRejected,
        offloadingPending,
        offloadingRejected,
        inTransit: inTransitOrders,
        completed: completedOrders,
      },
      finances: {
        totalRevenue,
        pendingPayments,
        revenueByWeek,
        highestRevenueWeek,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);

    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const trips = await Order.findAll({
      where,
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["username", "email", "phone"],
        },
        {
          model: User,
          as: "driver",
          attributes: ["username", "email", "phone"],
        },
        {
          model: Truck,
          as: "truck",
        },
        {
          model: Invoice,
          as: "invoice",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ trips });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching trips",
      error: error.message,
    });
  }
};

const approveLoading = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["loading", "loading_rejected"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot approve loading while order status is ${order.status}`,
      });
    }

    await order.update({
      loadingApproved: true,
      loadingRejectionReason: null,
      status: "in_transit",
    });

    const orderLabel = getOrderLabel(order);

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "in_transit",
      title: "Loading Approved",
      note: "Admin approved loading proof. Order is now in transit.",
      locationName: order.pickupLocation,
    });

    await createNotification({
      userId: order.driverId,
      roleTarget: "driver",
      orderId: order.id,
      title: "Loading Approved",
      message: `Loading proof for order ${orderLabel} has been approved. You can proceed in transit.`,
      type: "loading_approved",
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Order In Transit",
      message: `Loading proof for your order ${orderLabel} has been approved. The order is now in transit.`,
      type: "loading_approved",
    });

    res.json({
      message: "Loading approved. Order is now in transit.",
      order,
    });
  } catch (error) {
    console.error("Approve loading error:", error);

    res.status(500).json({
      message: "Error approving loading",
      error: error.message,
    });
  }
};

const rejectLoading = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const rejectionReason =
      reason ||
      "Loading proof image was not clear. Please re-upload a clear document/image.";

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "loading") {
      return res.status(400).json({
        message: `Cannot reject loading proof while order status is ${order.status}`,
      });
    }

    await order.update({
      loadingApproved: false,
      loadingDocumentUrl: null,
      loadingRejectionReason: rejectionReason,
      status: "loading_rejected",
    });

    const orderLabel = getOrderLabel(order);

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "loading_rejected",
      title: "Loading Proof Rejected",
      note: rejectionReason,
      locationName: order.pickupLocation,
    });

    await createNotification({
      userId: order.driverId,
      roleTarget: "driver",
      orderId: order.id,
      title: "Re-upload Loading Proof",
      message: `Loading proof for order ${orderLabel} was rejected. Reason: ${rejectionReason}`,
      type: "loading_rejected",
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Loading Proof Re-upload Requested",
      message: `Admin requested the driver to re-upload loading proof for your order ${orderLabel}.`,
      type: "loading_rejected",
    });

    res.json({
      message: "Loading proof rejected. Driver has been asked to re-upload.",
      order,
    });
  } catch (error) {
    console.error("Reject loading error:", error);

    res.status(500).json({
      message: "Error rejecting loading proof",
      error: error.message,
    });
  }
};

const approveOffloading = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["offloading", "offloading_rejected"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot approve offloading while order status is ${order.status}`,
      });
    }

    await order.update({
      offloadingApproved: true,
      offloadingRejectionReason: null,
      status: "delivered",
    });

    const orderLabel = getOrderLabel(order);

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "delivered",
      title: "Offloading Approved",
      note: "Admin approved offloading proof. Order is now delivered.",
      locationName: order.deliveryLocation,
    });

    await createNotification({
      userId: order.driverId,
      roleTarget: "driver",
      orderId: order.id,
      title: "Offloading Approved",
      message: `Offloading proof for order ${orderLabel} has been approved.`,
      type: "offloading_approved",
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Order Delivered",
      message: `Offloading proof for your order ${orderLabel} has been approved. Your order has been delivered successfully.`,
      type: "offloading_approved",
    });

    if (order.truckId) {
      await Truck.update(
        { isAvailable: true },
        { where: { id: order.truckId } }
      );
    }

    if (order.driverId) {
      await User.update(
        { isAvailable: true },
        { where: { id: order.driverId } }
      );
    }

    res.json({
      message: "Offloading approved. Order completed.",
      order,
    });
  } catch (error) {
    console.error("Approve offloading error:", error);

    res.status(500).json({
      message: "Error approving offloading",
      error: error.message,
    });
  }
};

const rejectOffloading = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const rejectionReason =
      reason ||
      "Offloading/POD proof image was not clear. Please re-upload a clear document/image.";

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "offloading") {
      return res.status(400).json({
        message: `Cannot reject offloading proof while order status is ${order.status}`,
      });
    }

    await order.update({
      offloadingApproved: false,
      offloadingDocumentUrl: null,
      offloadingRejectionReason: rejectionReason,
      status: "offloading_rejected",
    });

    const orderLabel = getOrderLabel(order);

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "offloading_rejected",
      title: "Offloading Proof Rejected",
      note: rejectionReason,
      locationName: order.deliveryLocation,
    });

    await createNotification({
      userId: order.driverId,
      roleTarget: "driver",
      orderId: order.id,
      title: "Re-upload Offloading Proof",
      message: `Offloading proof for order ${orderLabel} was rejected. Reason: ${rejectionReason}`,
      type: "offloading_rejected",
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Offloading Proof Re-upload Requested",
      message: `Admin requested the driver to re-upload offloading proof for your order ${orderLabel}.`,
      type: "offloading_rejected",
    });

    res.json({
      message: "Offloading proof rejected. Driver has been asked to re-upload.",
      order,
    });
  } catch (error) {
    console.error("Reject offloading error:", error);

    res.status(500).json({
      message: "Error rejecting offloading proof",
      error: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const tripsWithExpenses = await Order.findAll({
      where: {
        status: {
          [Op.in]: ["delivered", "customer_confirmed"],
        },
        price: {
          [Op.gt]: 0,
        },
      },
      attributes: [
        "id",
        "orderNumber",
        "pickupLocation",
        "deliveryLocation",
        "price",
        "createdAt",
      ],
      include: [
        {
          model: Truck,
          as: "truck",
          attributes: ["truckName", "licensePlate"],
        },
      ],
    });

    res.json({ expenses: tripsWithExpenses });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

const getCashflow = async (req, res) => {
  try {
    const { period } = req.query;

    const revenueData = await Order.findAll({
      where: {
        status: {
          [Op.in]: ["delivered", "customer_confirmed"],
        },
        price: {
          [Op.ne]: null,
        },
      },
      attributes: [
        [
          Sequelize.fn(
            "DATE_TRUNC",
            period || "day",
            Sequelize.col("createdAt")
          ),
          "date",
        ],
        [Sequelize.fn("SUM", Sequelize.col("price")), "total"],
      ],
      group: [
        Sequelize.fn(
          "DATE_TRUNC",
          period || "day",
          Sequelize.col("createdAt")
        ),
      ],
      order: [
        [
          Sequelize.fn(
            "DATE_TRUNC",
            period || "day",
            Sequelize.col("createdAt")
          ),
          "ASC",
        ],
      ],
    });

    res.json({
      revenue: revenueData,
      pending: [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cashflow",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllTrips,
  approveLoading,
  rejectLoading,
  approveOffloading,
  rejectOffloading,
  getExpenses,
  getCashflow,
};