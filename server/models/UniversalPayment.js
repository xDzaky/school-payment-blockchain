const mongoose = require('mongoose');

const universalPaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
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
    enum: ['pending', 'completed', 'failed', 'expired'],
    default: 'pending'
  },
  
  // Payment Methods Available
  paymentMethods: {
    // Traditional Payment
    bank: {
      enabled: { type: Boolean, default: true },
      accountNumber: { type: String, default: '0391967864' },
      accountName: { type: String, default: 'Dzaky School Payment' },
      bankName: { type: String, default: 'Bank BCA' }
    },
    
    // E-Wallet
    gopay: {
      enabled: { type: Boolean, default: true },
      phoneNumber: { type: String, default: '081216494184' },
      merchantId: { type: String, default: 'GOPAY_DZAKY_SCHOOL' }
    },
    
    ovo: {
      enabled: { type: Boolean, default: true },
      phoneNumber: { type: String, default: '081216494184' }
    },
    
    dana: {
      enabled: { type: Boolean, default: true },
      phoneNumber: { type: String, default: '081216494184' }
    },
    
    // Cryptocurrency
    polygon: {
      enabled: { type: Boolean, default: true },
      address: { type: String, default: '0x8ba1f109551bD432803012645Hac136c5C1fD4E5' },
      network: { type: String, default: 'Polygon Mumbai' },
      token: { type: String, default: 'MATIC' }
    },
    
    ethereum: {
      enabled: { type: Boolean, default: true },
      address: { type: String, default: '0x8ba1f109551bD432803012645Hac136c5C1fD4E5' },
      network: { type: String, default: 'Ethereum Mainnet' },
      token: { type: String, default: 'ETH' }
    },
    
    solana: {
      enabled: { type: Boolean, default: true },
      address: { type: String, default: 'DdzFFzCqrhsuwQKiR3CdQ1FzuPAydtVCBjjh4dRNsgAz' },
      network: { type: String, default: 'Solana Mainnet' },
      token: { type: String, default: 'SOL' }
    },
    
    bitcoin: {
      enabled: { type: Boolean, default: true },
      address: { type: String, default: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
      network: { type: String, default: 'Bitcoin Mainnet' },
      token: { type: String, default: 'BTC' }
    }
  },
  
  // Payment Details
  paymentDetails: {
    method: { type: String }, // 'bank', 'gopay', 'polygon', etc.
    transactionHash: { type: String },
    transactionId: { type: String },
    paidAmount: { type: Number },
    paidCurrency: { type: String },
    exchangeRate: { type: Number },
    confirmations: { type: Number, default: 0 }
  },
  
  // Auto-Convert Tracking
  autoConvert: {
    enabled: { type: Boolean, default: true },
    sourceMethod: { type: String }, // 'gopay', 'ovo', 'dana', 'bank'
    sourceAmount: { type: Number },
    sourceCurrency: { type: String, default: 'IDR' },
    targetAmount: { type: Number },
    targetCurrency: { type: String, default: 'MATIC' },
    exchangeRate: { type: Number },
    conversionFee: { type: Number },
    blockchainTxHash: { type: String },
    convertedAt: { type: Date },
    conversionStatus: { 
      type: String, 
      enum: ['pending', 'converting', 'completed', 'failed'],
      default: 'pending'
    }
  },
  
  // QR Code Data
  qrCodeData: {
    type: String
  },
  
  // Expiry
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  },
  
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Auto-expire payments
universalPaymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('UniversalPayment', universalPaymentSchema);