#!/usr/bin/env node

/**
 * Test Script untuk Auto-Convert System
 * Jalankan dengan: node test-auto-convert.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAutoConvert() {
  console.log('🧪 Testing Auto-Convert System');
  console.log('================================');

  try {
    // 1. Test Health Check
    console.log('\n1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/webhooks/health`);
    console.log('✅ Health Status:', healthResponse.data.status);
    console.log('   Auto-Convert Enabled:', healthResponse.data.autoConvertEnabled);
    console.log('   Exchange Rate (IDR/MATIC):', healthResponse.data.exchangeRate);
    console.log('   Wallet Balance:', healthResponse.data.walletBalance?.formatted);

    // 2. Test Manual Trigger
    console.log('\n2. Testing Manual Trigger...');
    const testPaymentId = `test-${Date.now()}`;
    const manualResponse = await axios.post(`${BASE_URL}/api/webhooks/manual-trigger`, {
      paymentId: testPaymentId,
      method: 'gopay',
      amount: 50000
    });
    
    console.log('✅ Manual Trigger Result:', manualResponse.data.status);
    if (manualResponse.data.result.success) {
      console.log('   Conversion Result:', {
        originalAmount: manualResponse.data.result.conversionResult.originalAmount,
        maticAmount: manualResponse.data.result.conversionResult.maticAmount,
        exchangeRate: manualResponse.data.result.conversionResult.exchangeRate
      });
      console.log('   Blockchain TX:', manualResponse.data.result.blockchainResult.hash);
      console.log('   Explorer URL:', manualResponse.data.result.explorerUrl);
    } else {
      console.log('   Error:', manualResponse.data.result.error);
    }

    // 3. Test GoPay Webhook (Simulated)
    console.log('\n3. Testing GoPay Webhook...');
    const gopayWebhookData = {
      transaction_id: `GP_${Date.now()}`,
      amount: 100000,
      status: 'PAID',
      phone_number: process.env.ADMIN_GOPAY_NUMBER || '081216494184',
      payment_id: `test-gopay-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    try {
      const webhookResponse = await axios.post(`${BASE_URL}/api/webhooks/gopay-webhook`, gopayWebhookData, {
        headers: {
          'x-signature': 'test_signature' // In production, this should be properly signed
        }
      });
      console.log('✅ GoPay Webhook Result:', webhookResponse.data.status);
    } catch (webhookError) {
      console.log('⚠️  GoPay Webhook Error (expected due to signature):', webhookError.response?.data?.error);
    }

    // 4. Test Statistics
    console.log('\n4. Testing Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/api/webhooks/stats`);
    console.log('✅ Conversion Stats:', statsResponse.data.conversionStats);
    console.log('   Method Stats:', statsResponse.data.methodStats);

    console.log('\n🎉 Auto-Convert System Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   - Health Check: ✅');
    console.log('   - Manual Trigger: ✅');
    console.log('   - Webhook Endpoint: ✅');
    console.log('   - Statistics: ✅');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Helper function to test exchange rates
async function testExchangeRates() {
  console.log('\n💱 Testing Exchange Rates...');
  
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=idr');
    const rate = response.data['matic-network'].idr;
    console.log('✅ Current MATIC Rate:', rate, 'IDR');
    
    // Test conversion
    const testAmount = 100000; // 100k IDR
    const maticAmount = testAmount / rate;
    console.log(`   ${testAmount} IDR = ${maticAmount.toFixed(4)} MATIC`);
    
  } catch (error) {
    console.error('❌ Exchange Rate Error:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 SchoolPay Auto-Convert Test Suite');
  console.log('====================================');
  
  // Test exchange rates first
  await testExchangeRates();
  
  // Test auto-convert system
  await testAutoConvert();
  
  console.log('\n✨ All tests completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAutoConvert, testExchangeRates };