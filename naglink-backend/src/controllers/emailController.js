const nodemailer = require('nodemailer');
const db = require('../models');
const Message = db.Message;
const Order = db.Order;
const User = db.User;

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email to driver about new assignment
const sendDriverAssignmentEmail = async (req, res) => {
  try {
    const { orderId, driverEmail, message } = req.body;
    
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer' },
        { model: db.Truck, as: 'truck' }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: driverEmail,
      subject: `New Delivery Assignment - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">NAGLINK Logistics - New Delivery Assignment</h2>
          <p>Hello Driver,</p>
          <p>You have been assigned a new delivery. Please find details below:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.customer.username}</p>
            <p><strong>Pickup Location:</strong> ${order.pickupLocation}</p>
            <p><strong>Delivery Location:</strong> ${order.deliveryLocation}</p>
            <p><strong>Goods:</strong> ${order.goodsDescription}</p>
            <p><strong>Weight:</strong> ${order.weight}</p>
            ${order.departureTime ? `<p><strong>Departure Time:</strong> ${new Date(order.departureTime).toLocaleString()}</p>` : ''}
            ${order.forecastedArrival ? `<p><strong>Forecasted Arrival:</strong> ${new Date(order.forecastedArrival).toLocaleString()}</p>` : ''}
            ${order.truck ? `<p><strong>Truck Assigned:</strong> ${order.truck.truckName} (${order.truck.licensePlate})</p>` : ''}
          </div>
          
          ${message ? `<div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Additional Message from Admin:</strong></p>
            <p>${message}</p>
          </div>` : ''}
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Important:</strong> Please confirm your acceptance of this assignment by replying to this email or contacting the dispatch office.</p>
          </div>
          
          <p>Thank you for your service!</p>
          <p><strong>NAGLINK Logistics Team</strong></p>
          <hr>
          <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      `
    };
    
    // Save message to database
    await Message.create({
      senderId: req.userId,
      receiverEmail: driverEmail,
      subject: `New Delivery Assignment - Order #${orderId}`,
      content: message || 'You have been assigned a new delivery.',
      orderId: orderId
    });
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      message: 'Email sent to driver successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

// Send approval email to customer
const sendApprovalEmail = async (req, res) => {
  try {
    const { orderId, customerEmail, price, departureTime, forecastedArrival, driverDetails } = req.body;
    
    const order = await Order.findByPk(orderId);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Approved - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">NAGLINK Logistics - Order Approved</h2>
          <p>Dear Customer,</p>
          <p>Your order has been approved! Here are the details:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Price Charged:</strong> $${price}</p>
            <p><strong>Pickup Location:</strong> ${order.pickupLocation}</p>
            <p><strong>Delivery Location:</strong> ${order.deliveryLocation}</p>
            <p><strong>Departure Time:</strong> ${new Date(departureTime).toLocaleString()}</p>
            <p><strong>Forecasted Arrival Time:</strong> ${new Date(forecastedArrival).toLocaleString()}</p>
          </div>
          
          ${driverDetails ? `<div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Driver Contact Details:</h3>
            <p><strong>Driver Name:</strong> ${driverDetails.name}</p>
            <p><strong>Driver Email:</strong> ${driverDetails.email}</p>
            <p><strong>Driver Phone:</strong> ${driverDetails.phone}</p>
          </div>` : ''}
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p>You can track your order using this link:</p>
            <p><a href="YOUR_FRONTEND_URL/track/${orderId}">Click here to track your order</a></p>
          </div>
          
          <p>An invoice has been generated and is available in your account dashboard.</p>
          <p>Thank you for choosing NAGLINK Logistics!</p>
          <hr>
          <p style="font-size: 12px; color: #777;">For any questions, please contact our support team.</p>
        </div>
      `
    };
    
    // Save message to database
    await Message.create({
      senderId: req.userId,
      receiverEmail: customerEmail,
      subject: `Order Approved - Order #${orderId}`,
      content: `Your order has been approved. Price: $${price}, Departure: ${new Date(departureTime).toLocaleString()}`,
      orderId: orderId
    });
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      message: 'Approval email sent to customer successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending approval email', error: error.message });
  }
};

// Customer sends message to driver
const sendMessageToDriver = async (req, res) => {
  try {
    const { orderId, subject, content } = req.body;
    
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'driver' }
      ]
    });
    
    if (!order || !order.driver) {
      return res.status(404).json({ message: 'Driver not assigned to this order' });
    }
    
    // Only customer who owns the order can send message
    if (order.customerId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.driver.email,
      subject: `Message from Customer - Order #${orderId}: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>Message regarding Order #${orderId}</h3>
          <p><strong>From:</strong> Customer</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${content}</p>
          <hr>
          <p>Please respond to this customer regarding their order.</p>
        </div>
      `
    };
    
    // Save message to database
    await Message.create({
      senderId: req.userId,
      receiverEmail: order.driver.email,
      subject: subject,
      content: content,
      orderId: orderId
    });
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      message: 'Message sent to driver successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get message history for an order
const getMessageHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const messages = await Message.findAll({
      where: { orderId },
      include: [
        { model: User, as: 'sender', attributes: ['username', 'email', 'role'] }
      ],
      order: [['sentAt', 'ASC']]
    });
    
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

module.exports = {
  sendDriverAssignmentEmail,
  sendApprovalEmail,
  sendMessageToDriver,
  getMessageHistory
};