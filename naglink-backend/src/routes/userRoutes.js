const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  createDriver,
  getAllDrivers,
  getAllCustomers,
  getAllDriversWithStatus,
  updateDriver,
} = require("../controllers/userController");

const { uploadDriverImage } = require("../config/upload");

const router = express.Router();

router.post(
  "/drivers",
  authenticate,
  isAdmin,
  uploadDriverImage.single("profileImage"),
  createDriver
);

router.get("/drivers", authenticate, isAdmin, getAllDrivers);
router.get("/drivers/all", authenticate, isAdmin, getAllDriversWithStatus);

router.put(
  "/drivers/:id",
  authenticate,
  isAdmin,
  uploadDriverImage.single("profileImage"),
  updateDriver
);

router.get("/customers", authenticate, isAdmin, getAllCustomers);

module.exports = router;