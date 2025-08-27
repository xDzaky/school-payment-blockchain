const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    enum: ['spp', 'kegiatan', 'kantin', 'donasi'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionHash: {
    type: String,
    default: ''
  },
  blockchainConfirmed: {
    type: Boolean,
    default: false
  },
  blockchainAmount: {
    type: Number,
    default: 0
  },
  schoolWallet: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);