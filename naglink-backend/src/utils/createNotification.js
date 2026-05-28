const db = require("../models");

const Notification = db.Notification;

const createNotification = async ({
  userId = null,
  roleTarget = null,
  orderId = null,
  title,
  message,
  type = "info",
}) => {
  try {
    if (!title || !message) return null;

    const notification = await Notification.create({
      userId,
      roleTarget,
      orderId,
      title,
      message,
      type,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("Notification creation error:", error);
    return null;
  }
};

module.exports = createNotification;