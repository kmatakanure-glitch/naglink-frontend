const db = require("../models");

const Order = db.Order;
const User = db.User;
const Truck = db.Truck;
const OrderLocation = db.OrderLocation;
const OrderStatusUpdate = db.OrderStatusUpdate;
const Expense = db.Expense;

const { Op } = require("sequelize");
const PDFDocument = require("pdfkit");
const createNotification = require("../utils/createNotification");

const generateOrderNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `ORD-${datePart}-${randomPart}`;
};

const buildOrderLookupWhere = (value) => {
  const cleanValue = String(value || "").trim();

  const conditions = [{ orderNumber: cleanValue }];

  if (!Number.isNaN(Number(cleanValue))) {
    conditions.push({ id: Number(cleanValue) });
  }

  return { [Op.or]: conditions };
};

const statusUpdateInclude = {
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
};

const locationInclude = {
  model: OrderLocation,
  as: "locations",
  separate: true,
  order: [["createdAt", "DESC"]],
};

const createOrder = async (req, res) => {
  try {
    const { pickupLocation, deliveryLocation, goodsDescription, weight } =
      req.body;

    let orderNumber;
    let exists = true;

    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await Order.findOne({ where: { orderNumber } });
    }

    const order = await Order.create({
      customerId: req.userId,
      orderNumber,
      pickupLocation,
      deliveryLocation,
      goodsDescription,
      weight,
      status: "pending",
      approvalStatus: "pending",
    });

    await createNotification({
      roleTarget: "admin",
      orderId: order.id,
      title: "New Order Submitted",
      message: `Order ${order.orderNumber} has been submitted and is waiting for approval.`,
      type: "order_created",
    });

    res.status(201).json({
      message: "Order created successfully. Waiting for admin approval.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.userId },
      include: [
        {
          model: User,
          as: "driver",
          attributes: ["username", "email", "phone"],
        },
        {
          model: Truck,
          as: "truck",
          attributes: ["truckName", "licensePlate", "imageUrl"],
        },
        locationInclude,
        statusUpdateInclude,
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ orders });
  } catch (error) {
    console.error("Get my orders error:", error);

    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: buildOrderLookupWhere(id),
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["username", "email", "phone", "companyName"],
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
        locationInclude,
        statusUpdateInclude,
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role === "customer" && order.customerId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "driver" && order.driverId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Get order by id error:", error);

    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

const approveOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, driverId, departureTime, forecastedArrival } = req.body;

    const order = await Order.findOne({
      where: buildOrderLookupWhere(id),
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!driverId) {
      return res.status(400).json({ message: "Please select a driver" });
    }

    const driver = await User.findByPk(driverId);

    if (!driver || driver.role !== "driver") {
      return res.status(400).json({ message: "Invalid driver selected" });
    }

    if (!driver.isAvailable) {
      return res.status(400).json({
        message: "Driver is currently on another trip",
      });
    }

    const assignedTruck = await Truck.findOne({
      where: { assignedDriverId: driverId },
    });

    if (!assignedTruck) {
      return res.status(400).json({
        message: "This driver does not have an assigned truck",
      });
    }

    if (!assignedTruck.isAvailable) {
      return res.status(400).json({
        message: "The driver's assigned truck is currently on another trip",
      });
    }

    await driver.update({ isAvailable: false });
    await assignedTruck.update({ isAvailable: false });

    await order.update({
      price,
      driverId,
      truckId: assignedTruck.id,
      departureTime,
      forecastedArrival,
      approvalStatus: "approved",
      status: "approved",
    });

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status: "approved",
      title: "Order Approved",
      note: `Order approved and assigned to ${driver.username}.`,
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Order Approved",
      message: `Your order ${order.orderNumber || `#${order.id}`} has been approved. Price: $${price}.`,
      type: "order_approved",
    });

    await createNotification({
      userId: driverId,
      roleTarget: "driver",
      orderId: order.id,
      title: "New Order Assigned",
      message: `You have been assigned order ${order.orderNumber || `#${order.id}`}.`,
      type: "order_assigned",
    });

    res.json({
      message: "Order approved successfully",
      order,
      assignedTruck,
    });
  } catch (error) {
    console.error("Approve order error:", error);

    res.status(500).json({
      message: "Error approving order",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["username", "email", "phone", "companyName"],
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
        locationInclude,
        statusUpdateInclude,
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await Order.findOne({
      where: buildOrderLookupWhere(id),
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role === "driver" && order.driverId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "customer" && order.customerId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const validStatuses = [
      "en_route_to_loading",
      "loading",
      "loading_approved",
      "in_transit",
      "arrived_at_destination",
      "waiting_to_offload",
      "offloading",
      "offloading_approved",
      "delivered",
      "customer_confirmed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await order.update({ status });

    await OrderStatusUpdate.create({
      orderId: order.id,
      updatedBy: req.userId,
      status,
      title: status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      note: note || null,
    });

    if (order.customerId && req.user.role !== "customer") {
      await createNotification({
        userId: order.customerId,
        roleTarget: "customer",
        orderId: order.id,
        title: "Order Status Updated",
        message: `Order ${order.orderNumber || `#${order.id}`} status changed to ${status.replaceAll(
          "_",
          " "
        )}.`,
        type: "order_status_update",
      });
    }

    if (req.user.role !== "admin") {
      await createNotification({
        roleTarget: "admin",
        orderId: order.id,
        title: "Order Status Updated",
        message: `Order ${order.orderNumber || `#${order.id}`} was updated to ${status.replaceAll(
          "_",
          " "
        )}.`,
        type: "order_status_update",
      });
    }

    if (order.driverId && req.user.role !== "driver") {
      await createNotification({
        userId: order.driverId,
        roleTarget: "driver",
        orderId: order.id,
        title: "Order Status Updated",
        message: `Order ${order.orderNumber || `#${order.id}`} was updated to ${status.replaceAll(
          "_",
          " "
        )}.`,
        type: "order_status_update",
      });
    }

    if (["delivered", "customer_confirmed"].includes(status)) {
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
    }

    res.json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Error updating order status",
      error: error.message,
    });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const order = await Order.findOne({
      where: buildOrderLookupWhere(trackingNumber),
      include: [
        {
          model: Truck,
          as: "truck",
          attributes: ["truckName", "licensePlate", "capacity"],
        },
        {
          model: User,
          as: "driver",
          attributes: ["username", "email", "phone"],
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
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const plainOrder = order.get({ plain: true });

    res.json({
      tracking: {
        ...plainOrder,
        locations: plainOrder.locations || [],
        statusUpdates: plainOrder.statusUpdates || [],
      },
    });
  } catch (error) {
    console.error("Track order error:", error);

    res.status(500).json({
      message: "Error tracking order",
      error: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [
        {
          model: Order,
          as: "order",
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
            { model: Truck, as: "truck" },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ expenses });
  } catch (error) {
    console.error("Get expenses error:", error);

    res.status(500).json({
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

const addOrderExpenses = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fuel,
      tollgate,
      maintenance,
      driverAllowance,
      loadingCost,
      offloadingCost,
      otherDescription,
      otherCost,
      zimTolls,
      mozaTolls,
      roadAccess,
      vidCosts,
      emaCosts,
      portHealth,
      portFee,
      agentRunner,
    } = req.body;

    const order = await Order.findOne({
      where: buildOrderLookupWhere(id),
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const totalAmount =
      Number(fuel || 0) +
      Number(tollgate || 0) +
      Number(maintenance || 0) +
      Number(driverAllowance || 0) +
      Number(loadingCost || 0) +
      Number(offloadingCost || 0) +
      Number(otherCost || 0) +
      Number(zimTolls || 0) +
      Number(mozaTolls || 0) +
      Number(roadAccess || 0) +
      Number(vidCosts || 0) +
      Number(emaCosts || 0) +
      Number(portHealth || 0) +
      Number(portFee || 0) +
      Number(agentRunner || 0);


    const expense = await Expense.create({
      orderId: order.id,
      fuel: fuel || 0,
      tollgate: tollgate || 0,
      maintenance: maintenance || 0,
      driverAllowance: driverAllowance || 0,
      loadingCost: loadingCost || 0,
      offloadingCost: offloadingCost || 0,
      otherDescription,
      otherCost: otherCost || 0,
      zimTolls: zimTolls || 0,
      mozaTolls: mozaTolls || 0,
      roadAccess: roadAccess || 0,
      vidCosts: vidCosts || 0,
      emaCosts: emaCosts || 0,
      portHealth: portHealth || 0,
      portFee: portFee || 0,
      agentRunner: agentRunner || 0,
      totalAmount,

    });

    res.status(201).json({
      message: "Expenses added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add expenses error:", error);

    res.status(500).json({
      message: "Error adding expenses",
      error: error.message,
    });
  }
};

// const downloadOrderExpensesPDF = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const expenses = await Expense.findAll({
//       where: { orderId: id },
//       include: [
//         {
//           model: Order,
//           as: "order",
//           include: [
//             {
//               model: User,
//               as: "customer",
//               attributes: ["username", "email", "phone"],
//             },
//             {
//               model: User,
//               as: "driver",
//               attributes: ["username", "email", "phone"],
//             },
//             { model: Truck, as: "truck" },
//           ],
//         },
//       ],
//     });

//     if (!expenses.length) {
//       return res.status(404).json({
//         message: "No expenses found for this order",
//       });
//     }

//     const order = expenses[0].order;
//     const doc = new PDFDocument({ margin: 50 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=order_${id}_expenses.pdf`
//     );

//     doc.pipe(res);

//     doc.fontSize(22).text("Order Expenses Report", { align: "center" });
//     doc.moveDown();

//     doc.fontSize(12).text(`Order: #${order.id}`);
//     doc.text(`Customer: ${order.customer?.username || "N/A"}`);
//     doc.text(`Driver: ${order.driver?.username || "N/A"}`);
//     doc.text(`Truck: ${order.truck?.truckName || "N/A"}`);
//     doc.text(
//       `Route: ${order.pickupLocation || "N/A"} to ${
//         order.deliveryLocation || "N/A"
//       }`
//     );
//     doc.moveDown();

//     let grandTotal = 0;

//     expenses.forEach((expense, index) => {
//       grandTotal += Number(expense.totalAmount || 0);

//       doc.fontSize(14).text(`Expense Entry ${index + 1}`, {
//         underline: true,
//       });
//       doc.fontSize(11).text(`Fuel: $${expense.fuel || 0}`);
//       doc.text(`Tollgate: $${expense.tollgate || 0}`);
//       doc.text(`Maintenance: $${expense.maintenance || 0}`);
//       doc.text(`Driver Allowance: $${expense.driverAllowance || 0}`);
//       doc.text(`Loading Cost: $${expense.loadingCost || 0}`);
//       doc.text(`Offloading Cost: $${expense.offloadingCost || 0}`);
//       doc.text(
//         `Other: ${expense.otherDescription || "N/A"} - $${
//           expense.otherCost || 0
//         }`
//       );
//       doc.text(`Total: $${Number(expense.totalAmount || 0).toFixed(2)}`);
//       doc.moveDown();
//     });

//     doc.fontSize(16).text(`Grand Total: $${grandTotal.toFixed(2)}`, {
//       align: "right",
//     });

//     doc.end();
//   } catch (error) {
//     res.status(500).json({
//       message: "Error generating PDF",
//       error: error.message,
//     });
//   }
// };

const downloadOrderExpensesPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: buildOrderLookupWhere(id),
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const expenses = await Expense.findAll({
      where: { orderId: order.id },
      include: [
        {
          model: Order,
          as: "order",
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
            { model: Truck, as: "truck" },
          ],
        },
      ],
    });

    if (!expenses.length) {
      return res.status(404).json({
        message: "No expenses found for this order",
      });
    }

    const reportOrder = expenses[0].order;
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=order_${reportOrder.orderNumber || reportOrder.id}_expenses.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("Order Expenses Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(
      `Order: ${reportOrder.orderNumber || `#${reportOrder.id}`}`
    );
    doc.text(`Customer: ${reportOrder.customer?.username || "N/A"}`);
    doc.text(`Driver: ${reportOrder.driver?.username || "N/A"}`);
    doc.text(`Truck: ${reportOrder.truck?.truckName || "N/A"}`);
    doc.text(
      `Route: ${reportOrder.pickupLocation || "N/A"} to ${
        reportOrder.deliveryLocation || "N/A"
      }`
    );
    doc.moveDown();

    let grandTotal = 0;

    expenses.forEach((expense, index) => {
      grandTotal += Number(expense.totalAmount || 0);

      doc.fontSize(14).text(`Expense Entry ${index + 1}`, {
        underline: true,
      });

      doc.fontSize(11).text(`Fuel: $${expense.fuel || 0}`);
      doc.text(`Tollgate: $${expense.tollgate || 0}`);
      doc.text(`Zim Tolls: $${expense.zimTolls || 0}`);
      doc.text(`Moza Tolls: $${expense.mozaTolls || 0}`);
      doc.text(`Road Access: $${expense.roadAccess || 0}`);
      doc.text(`VID Costs: $${expense.vidCosts || 0}`);
      doc.text(`EMA Costs: $${expense.emaCosts || 0}`);
      doc.text(`Port Health: $${expense.portHealth || 0}`);
      doc.text(`Port Fee: $${expense.portFee || 0}`);
      doc.text(`Agent / Runner: $${expense.agentRunner || 0}`);
      doc.text(`Maintenance: $${expense.maintenance || 0}`);
      doc.text(`Driver Allowance: $${expense.driverAllowance || 0}`);
      doc.text(`Loading Cost: $${expense.loadingCost || 0}`);
      doc.text(`Offloading Cost: $${expense.offloadingCost || 0}`);
      doc.text(
        `Other: ${expense.otherDescription || "N/A"} - $${
          expense.otherCost || 0
        }`
      );

      doc.text(`Total: $${Number(expense.totalAmount || 0).toFixed(2)}`);
      doc.moveDown();
    });

    doc.fontSize(16).text(`Grand Total: $${grandTotal.toFixed(2)}`, {
      align: "right",
    });

    doc.end();
  } catch (error) {
    console.error("Generate expense PDF error:", error);

    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  approveOrder,
  getAllOrders,
  updateOrderStatus,
  trackOrder,
  getExpenses,
  addOrderExpenses,
  downloadOrderExpensesPDF,
};