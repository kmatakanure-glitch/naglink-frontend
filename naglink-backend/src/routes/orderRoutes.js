const express = require('express');
const { authenticate, isAdmin, isDriver } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  approveOrder,
  getAllOrders,
  updateOrderStatus,
  trackOrder,
  getExpenses,
  addOrderExpenses,
  downloadOrderExpensesPDF,
} = require('../controllers/orderController');

const router = express.Router();

// Public tracking (no auth required)
router.get('/track/:trackingNumber', trackOrder);

// Customer routes
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/expenses/all', authenticate, isAdmin, getExpenses);
router.post('/:id/expenses', authenticate, isAdmin, addOrderExpenses);
router.get('/:id/expenses/pdf', authenticate, isAdmin, downloadOrderExpensesPDF);
router.get('/:id', authenticate, getOrderById);

// Admin routes
router.get('/', authenticate, isAdmin, getAllOrders);
router.put('/:id/approve', authenticate, isAdmin, approveOrder);

// Driver routes
router.patch('/:id/status', authenticate, isDriver, updateOrderStatus);

module.exports = router;