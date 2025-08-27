const { ethers } = require('ethers');

class BlockchainSenderService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    this.schoolWalletAddress = process.env.SCHOOL_WALLET_ADDRESS;
    this.privateKey = process.env.SCHOOL_PRIVATE_KEY;
  }

  /**
   * Send MATIC to school wallet address
   */
  async sendToBlockchain(maticAmount, description = '') {
    try {
      // Validate inputs
      if (!maticAmount || maticAmount <= 0) {
        throw new Error('Invalid MATIC amount');
      }

      if (!this.privateKey || this.privateKey === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        throw new Error('School private key not configured');
      }

      // Create wallet instance
      const wallet = new ethers.Wallet(this.privateKey, this.provider);
      
      // Check wallet balance
      const balance = await wallet.provider.getBalance(wallet.address);
      const balanceInMatic = parseFloat(ethers.formatEther(balance));
      
      console.log(`Wallet balance: ${balanceInMatic} MATIC`);
      
      if (balanceInMatic < maticAmount) {
        throw new Error(`Insufficient balance. Required: ${maticAmount} MATIC, Available: ${balanceInMatic} MATIC`);
      }

      // Prepare transaction
      const tx = {
        to: this.schoolWalletAddress,
        value: ethers.parseEther(maticAmount.toString()),
        gasLimit: 21000,
        gasPrice: await this.provider.getGasPrice()
      };

      // Add data field if description provided
      if (description) {
        tx.data = ethers.hexlify(ethers.toUtf8Bytes(description));
        tx.gasLimit = 50000; // Increase gas limit for data
      }

      console.log('Sending transaction:', {
        to: tx.to,
        value: ethers.formatEther(tx.value),
        gasLimit: tx.gasLimit.toString(),
        gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei') + ' gwei'
      });

      // Send transaction
      const txResponse = await wallet.sendTransaction(tx);
      
      console.log('Transaction sent:', txResponse.hash);
      
      // Wait for confirmation
      const receipt = await txResponse.wait(1);
      
      console.log('Transaction confirmed:', {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });

      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'success' : 'failed',
        explorerUrl: `https://mumbai.polygonscan.com/tx/${receipt.hash}`
      };

    } catch (error) {
      console.error('Blockchain transaction error:', error);
      throw new Error(`Blockchain transaction failed: ${error.message}`);
    }
  }

  /**
   * Get current gas price in GWEI
   */
  async getCurrentGasPrice() {
    try {
      const gasPrice = await this.provider.getGasPrice();
      return ethers.formatUnits(gasPrice, 'gwei');
    } catch (error) {
      console.error('Error getting gas price:', error);
      return '30'; // Fallback gas price
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(address = null) {
    try {
      const targetAddress = address || this.schoolWalletAddress;
      const balance = await this.provider.getBalance(targetAddress);
      return {
        wei: balance.toString(),
        matic: parseFloat(ethers.formatEther(balance)),
        formatted: `${parseFloat(ethers.formatEther(balance)).toFixed(4)} MATIC`
      };
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Estimate transaction fee
   */
  async estimateTransactionFee(maticAmount, includeData = false) {
    try {
      const gasPrice = await this.provider.getGasPrice();
      const gasLimit = includeData ? 50000 : 21000;
      
      const feeWei = gasPrice * BigInt(gasLimit);
      const feeMatic = parseFloat(ethers.formatEther(feeWei));
      
      return {
        gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
        gasLimit: gasLimit,
        feeWei: feeWei.toString(),
        feeMatic: feeMatic,
        feeFormatted: `${feeMatic.toFixed(6)} MATIC`
      };
    } catch (error) {
      console.error('Error estimating transaction fee:', error);
      return {
        gasPrice: '30',
        gasLimit: 21000,
        feeMatic: 0.001,
        feeFormatted: '0.001 MATIC'
      };
    }
  }

  /**
   * Verify transaction on blockchain
   */
  async verifyTransaction(txHash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      const transaction = await this.provider.getTransaction(txHash);
      
      if (!receipt || !transaction) {
        return { verified: false, reason: 'Transaction not found' };
      }

      return {
        verified: receipt.status === 1,
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        from: transaction.from,
        to: transaction.to,
        value: ethers.formatEther(transaction.value),
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'success' : 'failed'
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return { verified: false, reason: error.message };
    }
  }
}

module.exports = new BlockchainSenderService();