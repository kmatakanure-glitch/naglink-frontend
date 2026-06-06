const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  getDashboardStats,
  getAllTrips,
  approveLoading,
  rejectLoading,
  approveOffloading,
  rejectOffloading,
  getExpenses,
  getCashflow,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/trips", getAllTrips);

router.post("/orders/:id/approve-loading", approveLoading);
router.post("/orders/:id/reject-loading", rejectLoading);

router.post("/orders/:id/approve-offloading", approveOffloading);
router.post("/orders/:id/reject-offloading", rejectOffloading);

router.get("/expenses", getExpenses);
router.get("/cashflow", getCashflow);

module.exports = router;