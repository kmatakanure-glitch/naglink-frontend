const db = require('../models');
const Invoice = db.Invoice;
const Order = db.Order;
const User = db.User;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate invoice for an order (Admin only)
const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order with customer details
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer', attributes: ['username', 'email', 'phone', 'companyName', 'address'] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if invoice already exists
    let invoice = await Invoice.findOne({ where: { orderId } });
    
    if (!invoice) {
      // Generate unique invoice number
      const invoiceNumber = `INV-${Date.now()}-${orderId}`;
      
      // Create invoice record
      invoice = await Invoice.create({
        orderId: order.id,
        customerId: order.customerId,
        invoiceNumber: invoiceNumber,
        amount: order.price,
        status: 'pending',
        invoiceDate: new Date()
      });
    }
    
    res.status(201).json({
      message: 'Invoice generated successfully',
      invoice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating invoice', error: error.message });
  }
};

// Get invoice by order ID
const getInvoiceByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const invoice = await Invoice.findOne({
      where: { orderId },
      include: [
        { 
          model: Order, 
          as: 'order',
          include: [
            { model: User, as: 'customer' },
            { model: User, as: 'driver' },
            { model: db.Truck, as: 'truck' }
          ]
        },
        { model: User, as: 'customer' }
      ]
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this order' });
    }
    
    // Check permission
    if (req.user.role === 'customer' && invoice.customerId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

// Get customer's all invoices
const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { customerId: req.userId },
      include: [
        { 
          model: Order, 
          as: 'order',
          attributes: ['id', 'pickupLocation', 'deliveryLocation', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ invoices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

// Generate PDF invoice (downloadable/printable)
const generatePDF = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const invoice = await Invoice.findOne({
      where: { orderId },
      include: [
        { 
          model: Order, 
          as: 'order',
          include: [
            { model: User, as: 'customer' },
            { model: User, as: 'driver' },
            { model: db.Truck, as: 'truck' }
          ]
        },
        { model: User, as: 'customer' }
      ]
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `invoice_${invoice.invoiceNumber}.pdf`;
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Company Header
    doc.fontSize(20).text('NAGLINK LOGISTICS', { align: 'center' });
    doc.fontSize(10).text('123 Transport Avenue, Harare, Zimbabwe', { align: 'center' });
    doc.text('Email: info@naglink.com | Phone: +263 123 456 789', { align: 'center' });
    doc.moveDown();
    
    // Invoice Title
    doc.fontSize(16).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Invoice Details
    doc.fontSize(10);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`);
    doc.text(`Status: ${invoice.status.toUpperCase()}`);
    doc.moveDown();
    
    // Customer Details
    doc.fontSize(12).text('Bill To:', { underline: true });
    doc.fontSize(10);
    doc.text(invoice.order.customer.companyName || invoice.order.customer.username);
    doc.text(invoice.order.customer.address || 'N/A');
    doc.text(`Email: ${invoice.order.customer.email}`);
    doc.text(`Phone: ${invoice.order.customer.phone}`);
    doc.moveDown();
    
    // Order Details
    doc.fontSize(12).text('Shipment Details:', { underline: true });
    doc.fontSize(10);
    doc.text(`Order ID: ${invoice.order.id}`);
    doc.text(`Pickup Location: ${invoice.order.pickupLocation}`);
    doc.text(`Delivery Location: ${invoice.order.deliveryLocation}`);
    doc.text(`Goods Description: ${invoice.order.goodsDescription}`);
    doc.text(`Weight: ${invoice.order.weight}`);
    if (invoice.order.departureTime) {
      doc.text(`Departure Time: ${new Date(invoice.order.departureTime).toLocaleString()}`);
    }
    if (invoice.order.forecastedArrival) {
      doc.text(`Forecasted Arrival: ${new Date(invoice.order.forecastedArrival).toLocaleString()}`);
    }
    doc.moveDown();
    
    // Driver Information (if assigned)
    if (invoice.order.driver) {
      doc.fontSize(12).text('Driver Information:', { underline: true });
      doc.fontSize(10);
      doc.text(`Driver Name: ${invoice.order.driver.username}`);
      doc.text(`Driver Email: ${invoice.order.driver.email}`);
      doc.text(`Driver Phone: ${invoice.order.driver.phone}`);
      doc.moveDown();
    }
    
    // Truck Information (if assigned)
    if (invoice.order.truck) {
      doc.fontSize(12).text('Truck Information:', { underline: true });
      doc.fontSize(10);
      doc.text(`Truck: ${invoice.order.truck.truckName}`);
      doc.text(`License Plate: ${invoice.order.truck.licensePlate}`);
      doc.moveDown();
    }
    
    // Payment Table
    doc.fontSize(12).text('Payment Summary:', { underline: true });
    
    // Calculate table position
    let y = doc.y;
    const tableTop = y;
    
    // Table headers
    doc.fontSize(10);
    doc.text('Description', 50, tableTop);
    doc.text('Amount (USD)', 400, tableTop);
    
    doc.moveDown();
    doc.text('Transportation Services', 50);
    doc.text(`$${invoice.amount}`, 400);
    
    doc.moveDown();
    doc.text('Total Amount', 50);
    doc.text(`$${invoice.amount}`, 400, { bold: true });
    
    doc.moveDown(2);
    
    // Payment Instructions
    doc.fontSize(10);
    doc.text('Payment Instructions:', { underline: true });
    doc.text('Please make payment to:');
    doc.text('Bank: NAGLINK Bank');
    doc.text('Account Name: NAGLINK Logistics');
    doc.text('Account Number: 1234567890');
    doc.text('Reference: ' + invoice.invoiceNumber);
    doc.moveDown();
    
    // Footer
    doc.fontSize(8);
    doc.text('Thank you for choosing NAGLINK Logistics!', { align: 'center' });
    doc.text('This is a computer-generated invoice and does not require a signature.', { align: 'center' });
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};

// Update invoice status (when payment is made)
const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Only admin or the customer who owns the invoice can update payment status
    if (req.user.role !== 'admin' && invoice.customerId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await invoice.update({ status });
    
    res.json({
      message: `Invoice status updated to ${status}`,
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice', error: error.message });
  }
};

// Get all invoices (Admin only)
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: User, as: 'customer', attributes: ['username', 'email'] },
        { model: Order, as: 'order', attributes: ['id', 'status'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ invoices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

module.exports = {
  generateInvoice,
  getInvoiceByOrder,
  getMyInvoices,
  generatePDF,
  updateInvoiceStatus,
  getAllInvoices
};