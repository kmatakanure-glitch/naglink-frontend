const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const truckRoutes = require('./routes/truckRoutes');
const orderRoutes = require('./routes/orderRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const emailRoutes = require('./routes/emailRoutes');
const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const orderLocationRoutes = require("./routes/orderLocationRoutes");

const multiTruckRoutes = require('./routes/multiTruckRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const orderStatusUpdateRoutes = require("./routes/orderStatusUpdateRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/order-locations", orderLocationRoutes);

// Serve static files from uploads folder (for truck images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/multi-truck', multiTruckRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/order-status-updates", orderStatusUpdateRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NAGLINK API' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
};

startServer();