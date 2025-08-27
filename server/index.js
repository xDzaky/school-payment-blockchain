const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { findAvailablePort } = require('./utils/portHandler');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const dashboardRoutes = require('./routes/dashboard');
const universalPaymentRoutes = require('./routes/universalPayment');
const webhookRoutes = require('./routes/webhooks');

const app = express();
const DEFAULT_PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'school_payment'
})
.then(() => {
  console.log('✅ MongoDB Atlas connected successfully');
  console.log('📊 Database: school_payment');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/users', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/universal-payment', universalPaymentRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'School Payment System API - Universal Payment Gateway',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server with dynamic port
async function startServer() {
  try {
    const port = await findAvailablePort(DEFAULT_PORT);
    app.listen(port, '0.0.0.0', () => {
      console.log('🚀 SchoolPay Server Started');
      console.log('================================');
      console.log(`📡 Server: http://localhost:${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💰 Auto-Convert: ${process.env.AUTO_CONVERT_ENABLED === 'true' ? '✅ Enabled' : '❌ Disabled'}`);
      console.log('================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed');
    process.exit(0);
  });
});