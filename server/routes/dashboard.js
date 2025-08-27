const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get dashboard data for parent
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user info
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get payment statistics
    const totalPayments = await Payment.countDocuments({ userId });
    const pendingPayments = await Payment.countDocuments({ userId, status: 'pending' });
    const completedPayments = await Payment.countDocuments({ userId, status: 'completed' });

    // Get recent payments
    const recentPayments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate total amount paid this month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyPayments = await Payment.find({
      userId,
      status: 'completed',
      paidAt: { $gte: currentMonth }
    });

    const totalPaidThisMonth = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Get payments by type
    const paymentsByType = await Payment.aggregate([
      { $match: { userId: user._id, status: 'completed' } },
      { $group: { _id: '$paymentType', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      user,
      statistics: {
        totalPayments,
        pendingPayments,
        completedPayments,
        totalPaidThisMonth,
        paymentsByType
      },
      recentPayments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard - get all payments
router.get('/admin/overview', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get overall statistics
    const totalPayments = await Payment.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const completedPayments = await Payment.countDocuments({ status: 'completed' });

    // Get monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed', paidAt: { $gte: currentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get revenue by payment type
    const revenueByType = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentType', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get recent transactions
    const recentTransactions = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      statistics: {
        totalPayments,
        pendingPayments,
        completedPayments,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        revenueByType
      },
      recentTransactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;