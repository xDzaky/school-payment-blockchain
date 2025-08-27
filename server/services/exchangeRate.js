const axios = require('axios');

class ExchangeRateService {
  constructor() {
    this.baseURL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  /**
   * Get real-time IDR to MATIC exchange rate
   */
  async getIDRToMATICRate() {
    const cacheKey = 'IDR_MATIC_RATE';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.rate;
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/simple/price?ids=matic-network&vs_currencies=idr`,
        { timeout: 10000 }
      );
      
      const rate = response.data['matic-network']?.idr;
      if (!rate) {
        throw new Error('Failed to get MATIC rate');
      }

      // Cache the rate
      this.cache.set(cacheKey, {
        rate,
        timestamp: Date.now()
      });

      return rate;
    } catch (error) {
      console.error('Error fetching MATIC rate:', error);
      
      // Fallback to cached rate if available
      if (cached) {
        console.log('Using cached rate due to API error');
        return cached.rate;
      }
      
      // Ultimate fallback rate (approximate)
      console.log('Using fallback rate');
      return 10000; // 1 MATIC = 10,000 IDR (fallback)
    }
  }

  /**
   * Convert IDR amount to MATIC
   */
  async convertIDRToMATIC(amountIDR) {
    try {
      const rate = await this.getIDRToMATICRate();
      const conversionFeePercent = parseFloat(process.env.CONVERSION_FEE_PERCENT) || 1;
      
      // Calculate MATIC amount with fee deduction
      const maticAmount = amountIDR / rate;
      const feeAmount = maticAmount * (conversionFeePercent / 100);
      const finalAmount = maticAmount - feeAmount;

      return {
        originalAmount: amountIDR,
        exchangeRate: rate,
        maticAmount: finalAmount,
        feeAmount: feeAmount,
        feePercent: conversionFeePercent
      };
    } catch (error) {
      console.error('Error converting IDR to MATIC:', error);
      throw error;
    }
  }

  /**
   * Get multiple cryptocurrency rates
   */
  async getMultiCryptoRates() {
    try {
      const response = await axios.get(
        `${this.baseURL}/simple/price?ids=matic-network,ethereum,solana,bitcoin&vs_currencies=idr`,
        { timeout: 10000 }
      );

      return {
        matic: response.data['matic-network']?.idr || 10000,
        ethereum: response.data['ethereum']?.idr || 50000000,
        solana: response.data['solana']?.idr || 2000000,
        bitcoin: response.data['bitcoin']?.idr || 1500000000
      };
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
      
      // Fallback rates
      return {
        matic: 10000,
        ethereum: 50000000,
        solana: 2000000,
        bitcoin: 1500000000
      };
    }
  }

  /**
   * Check if amount meets minimum conversion requirement
   */
  isAmountEligibleForConversion(amountIDR) {
    const minAmount = parseInt(process.env.MIN_CONVERT_AMOUNT) || 10000;
    return amountIDR >= minAmount;
  }

  /**
   * Get conversion fee in IDR
   */
  getConversionFeeIDR(amountIDR) {
    const feePercent = parseFloat(process.env.CONVERSION_FEE_PERCENT) || 1;
    return amountIDR * (feePercent / 100);
  }
}

module.exports = new ExchangeRateService();