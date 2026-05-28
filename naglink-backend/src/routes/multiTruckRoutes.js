const express = require('express');
const { authenticate, isAdmin, isDriver } = require('../middleware/auth');
const {
  createMultiTruckOrder,
  getOrderWithTrucks,
  updateTruckStatus,
  approveTruckLoading,
  approveTruckOffloading
} = require('../controllers/multiTruckController');

const router = express.Router();

// Public tracking (no auth needed)
router.get('/track/:orderId', getOrderWithTrucks);

// Admin routes
router.post('/create', authenticate, isAdmin, createMultiTruckOrder);
router.put('/admin/loading/:orderTruckId', authenticate, isAdmin, approveTruckLoading);
router.put('/admin/offloading/:orderTruckId', authenticate, isAdmin, approveTruckOffloading);

// Driver routes
router.put('/driver/status/:orderTruckId', authenticate, isDriver, updateTruckStatus);

module.exports = router;