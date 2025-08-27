module.exports = {
  // Payment Gateway Configuration
  gopay: {
    number: '081216494184',
    webhookUrl: process.env.GOPAY_WEBHOOK_URL || 'https://your-domain.com/api/webhooks/gopay'
  },
  
  // Bank Account Configuration
  bca: {
    accountNumber: '0391967864',
    webhookUrl: process.env.BCA_WEBHOOK_URL || 'https://your-domain.com/api/webhooks/bca'
  },

  // Blockchain Configuration
  blockchain: {
    network: 'polygon', // or 'bsc' for Binance Smart Chain
    rpc: process.env.BLOCKCHAIN_RPC || 'https://polygon-rpc.com',
    contractAddress: process.env.CONTRACT_ADDRESS,
    adminWallet: '0x2d16b04ecDffD3594A0cadFe3D3Eb2D7d432B594', // Admin wallet address
    privateKey: process.env.WALLET_PRIVATE_KEY,
    gasLimit: 200000
  },

  // Auto Convert Settings
  autoConvert: {
    enabled: true,
    minAmount: 10000, // Minimum amount in IDR to trigger auto-convert
    maxDelay: 60000, // Maximum delay in milliseconds before conversion
  }
};
