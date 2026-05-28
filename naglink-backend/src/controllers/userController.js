const db = require("../models");
const bcrypt = require("bcryptjs");

const User = db.User;
const Truck = db.Truck;
const Order = db.Order;

// Admin creates a driver
const createDriver = async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "driver123", 10);

    const profileImageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/drivers/${req.file.filename}`
      : null;

    const driver = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address: address || null,
      role: "driver",
      isAvailable: true,
      profileImageUrl,
    });

    res.status(201).json({
      message: "Driver created successfully",
      driver: {
        id: driver.id,
        username: driver.username,
        email: driver.email,
        phone: driver.phone,
        role: driver.role,
        isAvailable: driver.isAvailable,
        profileImageUrl: driver.profileImageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating driver",
      error: error.message,
    });
  }
};

// Get all drivers with profile, assigned truck, and current active order
const getAllDriversWithStatus = async (req, res) => {
  try {
    const drivers = await User.findAll({
      where: { role: "driver" },
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "address",
        "isAvailable",
        "profileImageUrl",
      ],
      include: [
        {
          model: Truck,
          as: "assignedTruck",
          attributes: [
            "id",
            "truckName",
            "licensePlate",
            "capacity",
            "imageUrl",
            "isAvailable",
          ],
        },
        {
          model: Order,
          as: "driverOrders",
          attributes: [
            "id",
            "status",
            "pickupLocation",
            "deliveryLocation",
            "goodsDescription",
            "updatedAt",
          ],
          where: {
            status: ["approved", "loading", "in_transit", "offloading"],
          },
          required: false,
          limit: 1,
          order: [["updatedAt", "DESC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ drivers });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching drivers",
      error: error.message,
    });
  }
};

// Get available drivers only
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.findAll({
      where: {
        role: "driver",
        isAvailable: true,
      },
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "profileImageUrl",
        "isAvailable",
      ],
      include: [
        {
          model: Truck,
          as: "assignedTruck",
          attributes: ["id", "truckName", "licensePlate", "imageUrl"],
        },
      ],
    });

    res.json({ drivers });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching drivers",
      error: error.message,
    });
  }
};

// Get customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: "customer" },
      attributes: ["id", "username", "email", "phone", "companyName"],
    });

    res.json({ customers });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

// Update driver profile
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, address, isAvailable } = req.body;

    const driver = await User.findOne({
      where: { id, role: "driver" },
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const profileImageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/drivers/${req.file.filename}`
      : driver.profileImageUrl;

    await driver.update({
      username: username || driver.username,
      email: email || driver.email,
      phone: phone || driver.phone,
      address: address !== undefined ? address : driver.address,
      isAvailable:
        isAvailable !== undefined ? isAvailable : driver.isAvailable,
      profileImageUrl,
    });

    res.json({
      message: "Driver updated successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating driver",
      error: error.message,
    });
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getAllCustomers,
  getAllDriversWithStatus,
  updateDriver,
};