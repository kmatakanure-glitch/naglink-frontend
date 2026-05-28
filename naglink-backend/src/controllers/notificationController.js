const db = require("../models");

const Notification = db.Notification;

// Get notifications for logged in user
const getNotifications = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role === "admin") {
      whereClause.roleTarget = "admin";
    }

    if (req.user.role === "driver") {
      whereClause.userId = req.userId;
    }

    if (req.user.role === "customer") {
      whereClause.userId = req.userId;
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    let whereClause = {
      isRead: false,
    };

    if (req.user.role === "admin") {
      whereClause.roleTarget = "admin";
    }

    if (req.user.role === "driver") {
      whereClause.userId = req.userId;
    }

    if (req.user.role === "customer") {
      whereClause.userId = req.userId;
    }

    const count = await Notification.count({
      where: whereClause,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await notification.update({
      isRead: true,
    });

    res.json({
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
};