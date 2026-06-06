const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  requestQuote,
  getMyQuotes,
  provideQuotePrice,
  getAllQuotes,
  openQuote,
} = require("../controllers/quoteController");

const router = express.Router();

// =============================
// CUSTOMER ROUTES
// =============================

// Request a quote
router.post("/", authenticate, requestQuote);

// Customer gets own quotes
router.get("/my-quotes", authenticate, getMyQuotes);

// =============================
// ADMIN ROUTES
// =============================

// Get all quotes
router.get("/", authenticate, isAdmin, getAllQuotes);

// Open quote (pending -> open)
router.put("/:id/open", authenticate, isAdmin, openQuote);

// Submit quote price (open -> closed)
router.put("/:id/price", authenticate, isAdmin, provideQuotePrice);

module.exports = router;