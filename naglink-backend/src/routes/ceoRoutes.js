const express = require("express");

const { authenticate, isCEO } = require("../middleware/auth");

const {
  getCEODashboard,
  getCEOExpenses,
  approveExpense,
  editAndApproveExpense,
} = require("../controllers/ceoController");

const router = express.Router();

router.use(authenticate, isCEO);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
router.get("/dashboard", getCEODashboard);

/*
|--------------------------------------------------------------------------
| Expense Requisitions
|--------------------------------------------------------------------------
*/

// View all expense requisitions
router.get("/expenses", getCEOExpenses);

// Approve expense without changes
router.put("/expenses/:id/approve", approveExpense);

// Edit expense and approve
router.put("/expenses/:id/edit-approve", editAndApproveExpense);

module.exports = router;