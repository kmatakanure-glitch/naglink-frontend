const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  generateInvoice,
  getInvoiceByOrder,
  getMyInvoices,
  generatePDF,
  updateInvoiceStatus,
  getAllInvoices
} = require('../controllers/invoiceController');

const router = express.Router();

// Customer routes
router.get('/my-invoices', authenticate, getMyInvoices);
router.get('/order/:orderId', authenticate, getInvoiceByOrder);
router.get('/order/:orderId/pdf', authenticate, generatePDF);

// Admin routes
router.post('/order/:orderId/generate', authenticate, isAdmin, generateInvoice);
router.get('/', authenticate, isAdmin, getAllInvoices);
router.patch('/:id/status', authenticate, updateInvoiceStatus);

module.exports = router;