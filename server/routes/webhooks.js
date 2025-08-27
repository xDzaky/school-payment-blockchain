const express = require('express');
const crypto = require('crypto');
const autoConvertService = require('../services/autoConvert');
const router = express.Router();

// Middleware to verify webhook signatures
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.GOPAY_WEBHOOK_SECRET || 'default_secret')
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.log('Webhook signature mismatch');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    next();
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return res.status(401).json({ error: 'Signature verification failed' });
  }
};

/**
 * GoPay Webhook Handler
 * Receives payment notifications from GoPay
 */
router.post('/gopay-webhook', verifyWebhookSignature, async (req, res) => {
  try {
    const { 
      transaction_id, 
      amount, 
      status, 
      phone_number, 
      payment_id,
      timestamp 
    } = req.body;

    console.log('GoPay webhook received:', {
      transaction_id,
      amount,
      status,
      phone_number,
      payment_id
    });

    // Only process successful payments to admin number
    if (status === 'PAID' && phone_number === process.env.ADMIN_GOPAY_NUMBER) {
      console.log('Processing GoPay payment for auto-convert');
      
      const result = await autoConvertService.processGopayPayment(
        payment_id || transaction_id,
        amount,
        phone_number
      );

      if (result.success) {
        console.log('GoPay auto-convert successful:', result);
        return res.json({
          status: 'success',
          message: 'Payment processed and converted to blockchain',
          conversionResult: result
        });
      } else {
        console.log('GoPay auto-convert failed:', result);
        return res.json({
          status: 'failed',
          message: result.reason || 'Auto-convert failed',
          error: result.error
        });
      }
    } else {
      console.log('GoPay payment not eligible for auto-convert:', { status, phone_number });
      return res.json({
        status: 'ignored',
        message: 'Payment not eligible for auto-convert'
      });
    }

  } catch (error) {
    console.error('GoPay webhook error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

/**
 * Bank Transfer Webhook Handler
 * Receives payment notifications from bank
 */
router.post('/bank-webhook', verifyWebhookSignature, async (req, res) => {
  try {
    const {
      transaction_id,
      amount,
      status,
      account_number,
      payment_id,
      timestamp
    } = req.body;

    console.log('Bank webhook received:', {
      transaction_id,
      amount,
      status,
      account_number,
      payment_id
    });

    // Only process successful payments to admin account
    if (status === 'SUCCESS' && account_number === process.env.ADMIN_BCA_ACCOUNT) {
      console.log('Processing Bank payment for auto-convert');
      
      const result = await autoConvertService.processBankPayment(
        payment_id || transaction_id,
        amount,
        account_number
      );

      if (result.success) {
        console.log('Bank auto-convert successful:', result);
        return res.json({
          status: 'success',
          message: 'Payment processed and converted to blockchain',
          conversionResult: result
        });
      } else {
        console.log('Bank auto-convert failed:', result);
        return res.json({
          status: 'failed',
          message: result.reason || 'Auto-convert failed',
          error: result.error
        });
      }
    } else {
      console.log('Bank payment not eligible for auto-convert:', { status, account_number });
      return res.json({
        status: 'ignored',
        message: 'Payment not eligible for auto-convert'
      });
    }

  } catch (error) {
    console.error('Bank webhook error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

/**
 * Manual Payment Trigger (for testing)
 */
router.post('/manual-trigger', async (req, res) => {
  try {
    const { paymentId, method, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID required' });
    }

    console.log(`Manual trigger requested for payment ${paymentId}`);

    const result = await autoConvertService.manualTrigger(
      paymentId,
      method || 'manual',
      amount || 50000
    );

    return res.json({
      status: result.success ? 'success' : 'failed',
      result
    });

  } catch (error) {
    console.error('Manual trigger error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Manual trigger failed',
      error: error.message
    });
  }
});

/**
 * Auto-Convert Health Check
 */
router.get('/health', async (req, res) => {
  try {
    const health = await autoConvertService.healthCheck();
    
    return res.json({
      timestamp: new Date().toISOString(),
      ...health
    });

  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

/**
 * Get Conversion Statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await autoConvertService.getConversionStats();
    
    return res.json({
      timestamp: new Date().toISOString(),
      ...stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get stats',
      error: error.message
    });
  }
});

/**
 * Test Webhook (for development)
 */
router.post('/test', async (req, res) => {
  console.log('Test webhook received:', req.body);
  
  return res.json({
    status: 'success',
    message: 'Test webhook received',
    timestamp: new Date().toISOString(),
    body: req.body
  });
});

module.exports = router;