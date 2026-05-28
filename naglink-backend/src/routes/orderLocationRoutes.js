const express = require("express");
const { authenticate, isDriver } = require("../middleware/auth");

const {
  createLocationUpdate,
} = require("../controllers/orderLocationController");

const router = express.Router();

router.post("/:orderId", authenticate, isDriver, createLocationUpdate);

module.exports = router;