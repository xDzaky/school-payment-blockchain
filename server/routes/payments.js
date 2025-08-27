const express = require('express');
const { ethers } = require('ethers');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const router = express.Router();

// Create payment request
router.post('/create', auth, async (req, res) => {
  try {
    const { studentId, studentName, paymentType, amount, description, dueDate } = req.body;

    const payment = new Payment({
      userId: req.user.userId,
      studentId,
      studentName,
      paymentType,
      amount,
      description,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment request created successfully',
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify blockchain transaction
router.post('/verify', auth, async (req, res) => {
  try {
    const { paymentId, transactionHash, amount, schoolWallet } = req.body;

    // Find payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify transaction on blockchain
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    
    try {
      const transaction = await provider.getTransaction(transactionHash);
      const receipt = await provider.getTransactionReceipt(transactionHash);

      if (receipt && receipt.status === 1) {
        // Verify transaction details
        const isValidTransaction = 
          transaction.to.toLowerCase() === schoolWallet.toLowerCase() &&
          parseFloat(ethers.formatEther(transaction.value)) >= (amount - 0.001); // Allow small tolerance

        if (isValidTransaction) {
          // Transaction successful and valid
          payment.status = 'completed';
          payment.transactionHash = transactionHash;
          payment.blockchainConfirmed = true;
          payment.paidAt = new Date();
          
          // Store blockchain details
          payment.blockchainAmount = amount;
          payment.schoolWallet = schoolWallet;
          
          await payment.save();

          res.json({
            message: 'Payment verified successfully',
            payment,
            blockchainDetails: {
              hash: transactionHash,
              amount: amount,
              schoolWallet: schoolWallet,
              explorerUrl: `https://mumbai.polygonscan.com/tx/${transactionHash}`
            }
          });
        } else {
          res.status(400).json({ message: 'Transaction details do not match' });
        }
      } else {
        res.status(400).json({ message: 'Transaction failed or not found' });
      }
    } catch (blockchainError) {
      console.error('Blockchain verification error:', blockchainError);
      
      // For demo purposes, allow verification even if blockchain check fails
      payment.status = 'completed';
      payment.transactionHash = transactionHash;
      payment.blockchainConfirmed = false; // Mark as not confirmed
      payment.paidAt = new Date();
      payment.blockchainAmount = amount;
      payment.schoolWallet = schoolWallet;
      
      await payment.save();

      res.json({
        message: 'Payment processed (blockchain verification pending)',
        payment,
        warning: 'Blockchain verification failed, but payment recorded'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all payments for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending payments
router.get('/pending', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ 
      userId: req.user.userId,
      status: 'pending'
    }).sort({ dueDate: 1 });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;