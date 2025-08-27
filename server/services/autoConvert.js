const exchangeRateService = require('./exchangeRate');
const blockchainSenderService = require('./blockchainSender');
const UniversalPayment = require('../models/UniversalPayment');

class AutoConvertService {
  constructor() {
    this.isEnabled = process.env.AUTO_CONVERT_ENABLED === 'true';
    this.processingQueue = new Map();
  }

  /**
   * Main auto-convert function
   */
  async autoConvertToBlockchain(paymentId, method, amountIDR, transactionId = null) {
    if (!this.isEnabled) {
      console.log('Auto-convert is disabled');
      return { success: false, reason: 'Auto-convert disabled' };
    }

    // Prevent duplicate processing
    if (this.processingQueue.has(paymentId)) {
      console.log(`Payment ${paymentId} already being processed`);
      return { success: false, reason: 'Already processing' };
    }

    this.processingQueue.set(paymentId, Date.now());

    try {
      console.log(`Starting auto-convert for payment ${paymentId}: ${amountIDR} IDR via ${method}`);

      // Find payment record
      const payment = await UniversalPayment.findOne({ paymentId });
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Check if amount is eligible for conversion
      if (!exchangeRateService.isAmountEligibleForConversion(amountIDR)) {
        const minAmount = process.env.MIN_CONVERT_AMOUNT || 10000;
        throw new Error(`Amount too small. Minimum: ${minAmount} IDR`);
      }

      // Update status to converting
      await this.updateConversionStatus(paymentId, 'converting', {
        sourceMethod: method,
        sourceAmount: amountIDR,
        sourceCurrency: 'IDR'
      });

      // Step 1: Convert IDR to MATIC
      console.log('Converting IDR to MATIC...');
      const conversionResult = await exchangeRateService.convertIDRToMATIC(amountIDR);
      
      console.log('Conversion result:', {
        originalAmount: conversionResult.originalAmount,
        maticAmount: conversionResult.maticAmount,
        exchangeRate: conversionResult.exchangeRate,
        feeAmount: conversionResult.feeAmount
      });

      // Step 2: Send to blockchain
      console.log('Sending to blockchain...');
      const blockchainResult = await blockchainSenderService.sendToBlockchain(
        conversionResult.maticAmount,
        `Auto-convert from ${method}: ${paymentId}`
      );

      console.log('Blockchain result:', blockchainResult);

      // Step 3: Update payment record
      await this.updateConversionStatus(paymentId, 'completed', {
        sourceMethod: method,
        sourceAmount: amountIDR,
        sourceCurrency: 'IDR',
        targetAmount: conversionResult.maticAmount,
        targetCurrency: 'MATIC',
        exchangeRate: conversionResult.exchangeRate,
        conversionFee: conversionResult.feeAmount,
        blockchainTxHash: blockchainResult.hash,
        convertedAt: new Date()
      });

      // Update main payment status
      await UniversalPayment.findOneAndUpdate(
        { paymentId },
        {
          status: 'completed',
          paidAt: new Date(),
          'paymentDetails.method': method,
          'paymentDetails.transactionId': transactionId,
          'paymentDetails.transactionHash': blockchainResult.hash,
          'paymentDetails.paidAmount': amountIDR,
          'paymentDetails.paidCurrency': 'IDR'
        }
      );

      console.log(`Auto-convert completed for payment ${paymentId}`);

      return {
        success: true,
        conversionResult,
        blockchainResult,
        explorerUrl: blockchainResult.explorerUrl
      };

    } catch (error) {
      console.error(`Auto-convert failed for payment ${paymentId}:`, error);

      // Update status to failed
      await this.updateConversionStatus(paymentId, 'failed', {
        sourceMethod: method,
        sourceAmount: amountIDR,
        sourceCurrency: 'IDR',
        error: error.message
      });

      return {
        success: false,
        error: error.message
      };

    } finally {
      // Remove from processing queue
      this.processingQueue.delete(paymentId);
    }
  }

  /**
   * Update conversion status in database
   */
  async updateConversionStatus(paymentId, status, data = {}) {
    try {
      const updateData = {
        'autoConvert.conversionStatus': status,
        ...Object.keys(data).reduce((acc, key) => {
          acc[`autoConvert.${key}`] = data[key];
          return acc;
        }, {})
      };

      await UniversalPayment.findOneAndUpdate(
        { paymentId },
        updateData,
        { new: true }
      );

      console.log(`Updated conversion status for ${paymentId}: ${status}`);
    } catch (error) {
      console.error(`Error updating conversion status for ${paymentId}:`, error);
    }
  }

  /**
   * Process GoPay payment (simulated)
   */
  async processGopayPayment(paymentId, amount, phoneNumber) {
    // Verify it's payment to admin number
    const ADMIN_GOPAY_NUMBER = '081216494184';
    if (phoneNumber !== ADMIN_GOPAY_NUMBER) {
      console.log(`Payment to different number: ${phoneNumber}`);
      return { success: false, reason: 'Wrong phone number' };
    }

    console.log(`Processing GoPay payment: ${paymentId}, Amount: ${amount}`);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Trigger auto-convert
    return await this.autoConvertToBlockchain(
      paymentId, 
      'gopay', 
      amount, 
      `GOPAY_${Date.now()}`
    );
  }

  /**
   * Process Bank Transfer payment (simulated)
   */
  async processBankPayment(paymentId, amount, accountNumber) {
    // Verify it's payment to admin account
    const ADMIN_BCA_ACCOUNT = '0391967864';
    if (accountNumber !== ADMIN_BCA_ACCOUNT) {
      console.log(`Payment to different account: ${accountNumber}`);
      return { success: false, reason: 'Wrong account number' };
    }

    console.log(`Processing Bank payment: ${paymentId}, Amount: ${amount}`);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Trigger auto-convert
    return await this.autoConvertToBlockchain(
      paymentId, 
      'bank', 
      amount, 
      `BANK_${Date.now()}`
    );
  }

  /**
   * Get conversion statistics
   */
  async getConversionStats() {
    try {
      const stats = await UniversalPayment.aggregate([
        {
          $match: {
            'autoConvert.conversionStatus': { $exists: true }
          }
        },
        {
          $group: {
            _id: '$autoConvert.conversionStatus',
            count: { $sum: 1 },
            totalAmount: { $sum: '$autoConvert.sourceAmount' },
            totalConverted: { $sum: '$autoConvert.targetAmount' },
            totalFees: { $sum: '$autoConvert.conversionFee' }
          }
        }
      ]);

      const methodStats = await UniversalPayment.aggregate([
        {
          $match: {
            'autoConvert.sourceMethod': { $exists: true }
          }
        },
        {
          $group: {
            _id: '$autoConvert.sourceMethod',
            count: { $sum: 1 },
            totalAmount: { $sum: '$autoConvert.sourceAmount' },
            avgAmount: { $avg: '$autoConvert.sourceAmount' }
          }
        }
      ]);

      return {
        conversionStats: stats,
        methodStats: methodStats,
        processingQueue: Array.from(this.processingQueue.keys())
      };
    } catch (error) {
      console.error('Error getting conversion stats:', error);
      return { error: error.message };
    }
  }

  /**
   * Manual trigger for testing
   */
  async manualTrigger(paymentId, method = 'manual', amount = 50000) {
    console.log(`Manual trigger for payment ${paymentId}`);
    return await this.autoConvertToBlockchain(paymentId, method, amount, `MANUAL_${Date.now()}`);
  }

  /**
   * Check system health
   */
  async healthCheck() {
    try {
      // Check exchange rate service
      const rate = await exchangeRateService.getIDRToMATICRate();
      
      // Check blockchain service
      const balance = await blockchainSenderService.getWalletBalance();
      
      // Check gas price
      const gasPrice = await blockchainSenderService.getCurrentGasPrice();

      return {
        status: 'healthy',
        autoConvertEnabled: this.isEnabled,
        exchangeRate: rate,
        walletBalance: balance,
        gasPrice: gasPrice,
        processingQueue: this.processingQueue.size
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

module.exports = new AutoConvertService();