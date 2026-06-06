const db = require("../models");

const Order = db.Order;
const OrderLocation = db.OrderLocation;
const createNotification = require("../utils/createNotification");

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Naglink-Logistics-System/1.0",
        },
      }
    );

    const data = await response.json();

    const road =
      data.address?.road ||
      data.address?.pedestrian ||
      data.address?.footway ||
      data.address?.path;

    const suburb =
      data.address?.suburb ||
      data.address?.neighbourhood ||
      data.address?.residential ||
      data.address?.quarter;

    const area =
      data.address?.city_district ||
      data.address?.district ||
      data.address?.county;

    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      data.address?.state;

    const province = data.address?.state;
    const country = data.address?.country;

    const parts = [road, suburb, area, city, province, country].filter(
      (item, index, array) => item && array.indexOf(item) === index
    );

    return parts.length > 0
      ? parts.join(", ")
      : data.display_name || `${latitude}, ${longitude}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${latitude}, ${longitude}`;
  }
};

const createLocationUpdate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { latitude, longitude, accuracy } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.driverId !== req.userId) {
      return res.status(403).json({
        message: "You can only update location for your assigned order",
      });
    }

    const orderLabel = order.orderNumber || `#${order.id}`;
    const locationName = await reverseGeocode(latitude, longitude);

    const location = await OrderLocation.create({
      orderId,
      driverId: req.userId,
      latitude,
      longitude,
      accuracy,
      locationName,
    });

    await createNotification({
      userId: order.customerId,
      roleTarget: "customer",
      orderId: order.id,
      title: "Driver Location Updated",
      message: `Driver updated location for order ${orderLabel}: ${locationName}.`,
      type: "location_update",
    });

    await createNotification({
      roleTarget: "admin",
      orderId: order.id,
      title: "Driver Location Updated",
      message: `Driver updated location for order ${orderLabel}: ${locationName}.`,
      type: "location_update",
    });

    res.status(201).json({
      message: "Location updated successfully",
      location,
    });
  } catch (error) {
    console.error("Location update error:", error);

    res.status(500).json({
      message: "Error updating location",
      error: error.message,
    });
  }
};

module.exports = {
  createLocationUpdate,
};