const express = require("express");
const { authenticate } = require("../middleware/auth");

const {
  addStatusUpdate,
} = require("../controllers/orderStatusUpdateController");

const router = express.Router();

router.post("/:orderId", authenticate, addStatusUpdate);

module.exports = router;