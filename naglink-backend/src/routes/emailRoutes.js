const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  sendDriverAssignmentEmail,
  sendApprovalEmail,
  sendMessageToDriver,
  getMessageHistory
} = require('../controllers/emailController');

const router = express.Router();

// Admin routes
router.post('/driver-assignment', authenticate, isAdmin, sendDriverAssignmentEmail);
router.post('/approval', authenticate, isAdmin, sendApprovalEmail);

// Customer routes
router.post('/message-driver', authenticate, sendMessageToDriver);
router.get('/messages/:orderId', authenticate, getMessageHistory);

module.exports = router;