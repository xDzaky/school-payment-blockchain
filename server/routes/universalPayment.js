const express = require('express');
const { v4: uuidv4 } = require('uuid');
const UniversalPayment = require('../models/UniversalPayment');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Universal Payment QR
router.post('/create', auth, async (req, res) => {
  try {
    const { studentId, studentName, paymentType, amount, description } = req.body;
    
    const paymentId = uuidv4();
    
    // Create universal payment data
    const universalPayment = new UniversalPayment({
      paymentId,
      userId: req.user.userId,
      studentId,
      studentName,
      paymentType,
      amount,
      description
    });

    // Generate QR Code Data (JSON with all payment options)
    const qrData = {
      id: paymentId,
      type: 'universal_payment',
      amount: amount,
      currency: 'IDR',
      description: description,
      student: {
        id: studentId,
        name: studentName
      },
      
      // Payment URLs/Deep Links
      methods: {
        // Web Payment Page
        web: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pay/${paymentId}`,
        
        // Bank Transfer
        bank: {
          account: '1234567890',
          name: 'Sekolah ABC',
          bank: 'BCA',
          amount: amount
        },
        
        // E-Wallet Deep Links
        gopay: `gojek://gopay/merchanttransfer?toid=GOPAY_SEKOLAH_ABC&amount=${amount}&description=${encodeURIComponent(description)}`,
        ovo: `ovomobile://pay?merchant=SEKOLAH_ABC&amount=${amount}&description=${encodeURIComponent(description)}`,
        dana: `dana://pay?merchant=SEKOLAH_ABC&amount=${amount}&description=${encodeURIComponent(description)}`,
        
        // Cryptocurrency
        crypto: {
          polygon: {
            address: '0x8ba1f109551bD432803012645Hac136c5C1fD4E5',
            amount: (amount / 10000).toFixed(4), // Convert to MATIC
            network: 'polygon',
            token: 'MATIC'
          },
          ethereum: {
            address: '0x8ba1f109551bD432803012645Hac136c5C1fD4E5',
            amount: (amount / 50000000).toFixed(6), // Convert to ETH
            network: 'ethereum',
            token: 'ETH'
          },
          solana: {
            address: 'DdzFFzCqrhsuwQKiR3CdQ1FzuPAydtVCBjjh4dRNsgAz',
            amount: (amount / 2000000).toFixed(4), // Convert to SOL
            network: 'solana',
            token: 'SOL'
          },
          bitcoin: {
            address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            amount: (amount / 1500000000).toFixed(8), // Convert to BTC
            network: 'bitcoin',
            token: 'BTC'
          }
        }
      },
      
      expires: universalPayment.expiresAt.toISOString()
    };

    universalPayment.qrCodeData = JSON.stringify(qrData);
    await universalPayment.save();

    res.status(201).json({
      message: 'Universal payment created successfully',
      paymentId,
      qrData,
      webUrl: qrData.methods.web
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Payment Details
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await UniversalPayment.findOne({ 
      paymentId: req.params.paymentId 
    }).populate('userId', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.expiresAt < new Date()) {
      payment.status = 'expired';
      await payment.save();
      return res.status(410).json({ message: 'Payment expired' });
    }

    const qrData = JSON.parse(payment.qrCodeData);
    
    res.json({
      payment: {
        id: payment.paymentId,
        amount: payment.amount,
        description: payment.description,
        status: payment.status,
        student: {
          id: payment.studentId,
          name: payment.studentName
        },
        expiresAt: payment.expiresAt
      },
      paymentMethods: qrData.methods
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Payment (Universal) with Auto-Convert
router.post('/verify/:paymentId', async (req, res) => {
  try {
    const { method, transactionHash, transactionId, paidAmount, paidCurrency, autoConvert = true } = req.body;
    
    const payment = await UniversalPayment.findOne({ 
      paymentId: req.params.paymentId 
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Update payment details
    payment.paymentDetails = {
      method,
      transactionHash,
      transactionId,
      paidAmount,
      paidCurrency,
      exchangeRate: paidAmount / payment.amount
    };

    // Check if auto-convert should be triggered
    const shouldAutoConvert = autoConvert && 
      ['gopay', 'ovo', 'dana', 'bank'].includes(method) &&
      process.env.AUTO_CONVERT_ENABLED === 'true';

    if (shouldAutoConvert) {
      console.log(`Triggering auto-convert for payment ${req.params.paymentId}`);
      
      // Import auto-convert service
      const autoConvertService = require('../services/autoConvert');
      
      // Trigger auto-convert (async, don't wait)
      autoConvertService.autoConvertToBlockchain(
        req.params.paymentId,
        method,
        paidAmount,
        transactionId
      ).then(result => {
        console.log(`Auto-convert result for ${req.params.paymentId}:`, result);
      }).catch(error => {
        console.error(`Auto-convert error for ${req.params.paymentId}:`, error);
      });

      // Update status to indicate conversion in progress
      payment.status = 'completed'; // Payment is completed, conversion is separate
      payment.paidAt = new Date();
      
      await payment.save();

      res.json({
        message: 'Payment verified and auto-convert initiated',
        payment: {
          id: payment.paymentId,
          status: payment.status,
          method: method,
          paidAt: payment.paidAt,
          autoConvertTriggered: true
        }
      });
    } else {
      // Standard verification without auto-convert
      payment.status = 'completed';
      payment.paidAt = new Date();
      
      await payment.save();

      res.json({
        message: 'Payment verified successfully',
        payment: {
          id: payment.paymentId,
          status: payment.status,
          method: method,
          paidAt: payment.paidAt,
          autoConvertTriggered: false
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Payment Statistics
router.get('/admin/stats', auth, async (req, res) => {
  try {
    const stats = await UniversalPayment.aggregate([
      {
        $group: {
          _id: '$paymentDetails.method',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const methodStats = await UniversalPayment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$paymentDetails.method',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    res.json({
      totalStats: stats,
      completedStats: methodStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;