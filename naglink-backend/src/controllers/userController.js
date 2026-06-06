const db = require("../models");
const bcrypt = require("bcryptjs");

const User = db.User;
const Truck = db.Truck;
const Order = db.Order;

// Admin creates a driver
const createDriver = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      address,
      idNumber,
      passportNumber,
      licenseNumber,
    } = req.body;

    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    if (idNumber) {
      const existingId = await User.findOne({
        where: { idNumber },
      });

      if (existingId) {
        return res.status(400).json({
          message: "ID number already exists",
        });
      }
    }

    if (passportNumber) {
      const existingPassport = await User.findOne({
        where: { passportNumber },
      });

      if (existingPassport) {
        return res.status(400).json({
          message: "Passport number already exists",
        });
      }
    }

    if (licenseNumber) {
      const existingLicense = await User.findOne({
        where: { licenseNumber },
      });

      if (existingLicense) {
        return res.status(400).json({
          message: "License number already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(
      password || "driver123",
      10
    );

    const profileImageUrl = req.file
      ? `${req.protocol}://${req.get(
          "host"
        )}/uploads/drivers/${req.file.filename}`
      : null;

    const driver = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address: address || null,
      idNumber: idNumber || null,
      passportNumber: passportNumber || null,
      licenseNumber: licenseNumber || null,
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
        address: driver.address,
        idNumber: driver.idNumber,
        passportNumber: driver.passportNumber,
        licenseNumber: driver.licenseNumber,
        role: driver.role,
        isAvailable: driver.isAvailable,
        profileImageUrl: driver.profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Create driver error:", error);

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
        "idNumber",
        "passportNumber",
        "licenseNumber",
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
            "orderNumber",
            "status",
            "pickupLocation",
            "deliveryLocation",
            "goodsDescription",
            "updatedAt",
          ],

          where: {
            status: [
              "approved",
              "loading",
              "in_transit",
              "offloading",
            ],
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
    console.error("Get drivers with status error:", error);

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
        "idNumber",
        "passportNumber",
        "licenseNumber",
        "profileImageUrl",
        "isAvailable",
      ],

      include: [
        {
          model: Truck,
          as: "assignedTruck",

          attributes: [
            "id",
            "truckName",
            "licensePlate",
            "imageUrl",
          ],
        },
      ],
    });

    res.json({ drivers });
  } catch (error) {
    console.error("Get available drivers error:", error);

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

      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "companyName",
      ],
    });

    res.json({ customers });
  } catch (error) {
    console.error("Get customers error:", error);

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

    const {
      username,
      email,
      phone,
      address,
      idNumber,
      passportNumber,
      licenseNumber,
      isAvailable,
    } = req.body;

    const driver = await User.findOne({
      where: {
        id,
        role: "driver",
      },
    });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    if (email && email !== driver.email) {
      const existingEmail = await User.findOne({
        where: { email },
      });

      if (existingEmail) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    if (idNumber && idNumber !== driver.idNumber) {
      const existingId = await User.findOne({
        where: { idNumber },
      });

      if (existingId) {
        return res.status(400).json({
          message: "ID number already exists",
        });
      }
    }

    if (
      passportNumber &&
      passportNumber !== driver.passportNumber
    ) {
      const existingPassport = await User.findOne({
        where: { passportNumber },
      });

      if (existingPassport) {
        return res.status(400).json({
          message: "Passport number already exists",
        });
      }
    }

    if (
      licenseNumber &&
      licenseNumber !== driver.licenseNumber
    ) {
      const existingLicense = await User.findOne({
        where: { licenseNumber },
      });

      if (existingLicense) {
        return res.status(400).json({
          message: "License number already exists",
        });
      }
    }

    const profileImageUrl = req.file
      ? `${req.protocol}://${req.get(
          "host"
        )}/uploads/drivers/${req.file.filename}`
      : driver.profileImageUrl;

    await driver.update({
      username: username || driver.username,
      email: email || driver.email,
      phone: phone || driver.phone,
      address:
        address !== undefined
          ? address
          : driver.address,

      idNumber:
        idNumber !== undefined
          ? idNumber
          : driver.idNumber,

      passportNumber:
        passportNumber !== undefined
          ? passportNumber
          : driver.passportNumber,

      licenseNumber:
        licenseNumber !== undefined
          ? licenseNumber
          : driver.licenseNumber,

      isAvailable:
        isAvailable !== undefined
          ? isAvailable
          : driver.isAvailable,

      profileImageUrl,
    });

    res.json({
      message: "Driver updated successfully",
      driver,
    });
  } catch (error) {
    console.error("Update driver error:", error);

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