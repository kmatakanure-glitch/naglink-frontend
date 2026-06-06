const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.User;

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      return res.status(401).json({
        message: "Please authenticate",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      message: "Please authenticate",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};

const isDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({
      message: "Access denied. Driver only.",
    });
  }

  next();
};

const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({
      message: "Access denied. Customer only.",
    });
  }

  next();
};

const isCEO = (req, res, next) => {
  if (req.user.role !== "ceo") {
    return res.status(403).json({
      message: "Access denied. CEO only.",
    });
  }

  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isDriver,
  isCustomer,
  isCEO,
};