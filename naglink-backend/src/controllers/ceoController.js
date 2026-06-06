const db = require("../models");

const Order = db.Order;
const User = db.User;
const Expense = db.Expense;
const Truck = db.Truck;

const { Op } = require("sequelize");
const createNotification = require("../utils/createNotification");

const expenseFields = [
  "fuel",
  "tollgate",
  "maintenance",
  "driverAllowance",
  "loadingCost",
  "offloadingCost",
  "zimTolls",
  "mozaTolls",
  "roadAccess",
  "vidCosts",
  "emaCosts",
  "portHealth",
  "portFee",
  "agentRunner",
  "otherCost",
];

const getExpenseTotal = (expense) => {
  return expenseFields.reduce(
    (sum, field) => sum + Number(expense?.[field] || 0),
    0
  );
};

const getWeekKey = (dateValue) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);
  const weekNumber = Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
  );

  return `${year} W${weekNumber}`;
};

const buildExpensePayload = (body) => {
  const payload = {};

  expenseFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = Number(body[field] || 0);
    }
  });

  if (body.otherDescription !== undefined) {
    payload.otherDescription = body.otherDescription;
  }

  return payload;
};

const getCEODashboard = async (req, res) => {
  try {
    const totalOrders = await Order.count();

    const completedOrders = await Order.count({
      where: {
        status: {
          [Op.in]: ["delivered", "customer_confirmed"],
        },
      },
    });

    const activeOrders = await Order.count({
      where: {
        status: {
          [Op.notIn]: ["delivered", "customer_confirmed", "cancelled"],
        },
      },
    });

    const orders = await Order.findAll({
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
        {
          model: Expense,
          as: "expenses",
          where: { status: "approved" },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const approvedExpenses = await Expense.findAll({
      where: { status: "approved" },
    });

    const pendingExpenseCount = await Expense.count({
      where: { status: "pending" },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.price || 0),
      0
    );

    const totalExpenses = approvedExpenses.reduce(
      (sum, expense) => sum + getExpenseTotal(expense),
      0
    );

    const totalProfit = totalRevenue - totalExpenses;

    const profitMargin =
      totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

    const expenseBreakdown = {
      fuel: 0,
      tollgate: 0,
      maintenance: 0,
      driverAllowance: 0,
      loadingCost: 0,
      offloadingCost: 0,
      zimTolls: 0,
      mozaTolls: 0,
      roadAccess: 0,
      vidCosts: 0,
      emaCosts: 0,
      portHealth: 0,
      portFee: 0,
      agentRunner: 0,
      otherCost: 0,
    };

    approvedExpenses.forEach((expense) => {
      expenseFields.forEach((field) => {
        expenseBreakdown[field] += Number(expense?.[field] || 0);
      });
    });

    const weeklyMap = {};

    orders.forEach((order) => {
      const weekKey = getWeekKey(order.createdAt);

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          week: weekKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
        };
      }

      weeklyMap[weekKey].revenue += Number(order.price || 0);
    });

    approvedExpenses.forEach((expense) => {
      const weekKey = getWeekKey(expense.approvedAt || expense.createdAt);

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          week: weekKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
        };
      }

      weeklyMap[weekKey].expenses += getExpenseTotal(expense);
    });

    Object.keys(weeklyMap).forEach((weekKey) => {
      weeklyMap[weekKey].profit =
        weeklyMap[weekKey].revenue - weeklyMap[weekKey].expenses;
    });

    const revenueByWeek = Object.values(weeklyMap).slice(-6);

    const profitPerLoad = orders.map((order) => {
      const expenseTotal =
        order.expenses?.reduce((sum, exp) => sum + getExpenseTotal(exp), 0) ||
        0;

      const revenue = Number(order.price || 0);
      const profit = revenue - expenseTotal;

      return {
        id: order.id,
        orderNumber: order.orderNumber || `#${order.id}`,
        customer: order.customer?.username || "N/A",
        driver: order.driver?.username || "N/A",
        pickupLocation: order.pickupLocation,
        deliveryLocation: order.deliveryLocation,
        revenue,
        expenses: expenseTotal,
        profit,
        profitMargin:
          revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0,
        createdAt: order.createdAt,
      };
    });

    res.json({
      overview: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        profitMargin,
        totalOrders,
        completedOrders,
        activeOrders,
        pendingExpenseCount,
      },
      expenseBreakdown,
      revenueByWeek,
      profitPerLoad,
    });
  } catch (error) {
    console.error("CEO dashboard error:", error);

    res.status(500).json({
      message: "Error fetching CEO dashboard",
      error: error.message,
    });
  }
};

const getCEOExpenses = async (req, res) => {
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
            {
              model: Truck,
              as: "truck",
              attributes: ["truckName", "licensePlate"],
            },
          ],
        },
        {
          model: User,
          as: "requestedByUser",
          attributes: ["id", "username", "email", "role"],
        },
        {
          model: User,
          as: "approvedByUser",
          attributes: ["id", "username", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ expenses });
  } catch (error) {
    console.error("CEO get expenses error:", error);

    res.status(500).json({
      message: "Error fetching CEO expenses",
      error: error.message,
    });
  }
};

const approveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { ceoEditNote = "" } = req.body;

    const expense = await Expense.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const wasEditedByCEO = false;

    await expense.update({
      totalAmount: getExpenseTotal(expense),
      status: "approved",
      approvedBy: req.userId,
      approvedAt: new Date(),
      wasEditedByCEO,
      ceoEditNote: ceoEditNote || null,
    });

    await createNotification({
      userId: expense.requestedBy,
      roleTarget: "admin",
      orderId: expense.orderId,
      title: "Expense Approved",
      message: `Expense requisition for order ${
        expense.order?.orderNumber || `#${expense.orderId}`
      } has been approved.`,
      type: "expense_approved",
    });

    res.json({
      message: "Expense approved successfully",
      expense,
    });
  } catch (error) {
    console.error("Approve expense error:", error);

    res.status(500).json({
      message: "Error approving expense",
      error: error.message,
    });
  }
};

const editAndApproveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { ceoEditNote = "" } = req.body;

    const expense = await Expense.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const updatePayload = buildExpensePayload(req.body);

    const previewExpense = {
      ...expense.get({ plain: true }),
      ...updatePayload,
    };

    const totalAmount = getExpenseTotal(previewExpense);

    await expense.update({
      ...updatePayload,
      totalAmount,
      status: "approved",
      approvedBy: req.userId,
      approvedAt: new Date(),
      wasEditedByCEO: true,
      ceoEditNote:
        ceoEditNote ||
        "CEO edited the requisition amounts before approving.",
    });

    await createNotification({
      userId: expense.requestedBy,
      roleTarget: "admin",
      orderId: expense.orderId,
      title: "Expense Edited and Approved",
      message: `Expense requisition for order ${
        expense.order?.orderNumber || `#${expense.orderId}`
      } was edited by CEO and approved. New approved amount: $${totalAmount.toFixed(
        2
      )}.`,
      type: "expense_edited_approved",
    });

    res.json({
      message: "Expense edited and approved successfully",
      expense,
    });
  } catch (error) {
    console.error("Edit and approve expense error:", error);

    res.status(500).json({
      message: "Error editing and approving expense",
      error: error.message,
    });
  }
};

module.exports = {
  getCEODashboard,
  getCEOExpenses,
  approveExpense,
  editAndApproveExpense,
};