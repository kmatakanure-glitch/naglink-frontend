const express = require('express');
const { authenticate, isDriver } = require('../middleware/auth');
const { uploadLoadingDoc, uploadOffloadingDoc } = require('../config/upload');
const {
  getMyAssignedOrders,
  startLoading,
  uploadOffloadingDocument,
  completeTrip,
  getMyTripHistory
} = require('../controllers/driverController');

const router = express.Router();

// All driver routes require authentication and driver role
router.use(authenticate, isDriver);

router.get('/my-orders', getMyAssignedOrders);
router.post('/:id/start-loading', uploadLoadingDoc.single('loadingDocument'), startLoading);
router.post('/:id/upload-offloading', uploadOffloadingDoc.single('offloadingDocument'), uploadOffloadingDocument);
router.post('/:id/complete-trip', completeTrip);
router.get('/my-history', getMyTripHistory);

module.exports = router;