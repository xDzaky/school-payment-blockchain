# 🚀 Auto-Convert System Documentation

## 🎯 Overview

Sistem Auto-Convert SchoolPay secara otomatis mengkonversi pembayaran dari GoPay, OVO, DANA, dan Bank Transfer ke cryptocurrency (MATIC) dan mengirimkannya ke blockchain wallet sekolah.

---

## ⚙️ Configuration

### Environment Variables (.env)
```env
# Auto-Convert Settings
AUTO_CONVERT_ENABLED=true
CONVERSION_FEE_PERCENT=1
MIN_CONVERT_AMOUNT=10000

# Admin Contact Info
ADMIN_GOPAY_NUMBER=081216494184
ADMIN_BCA_ACCOUNT=0391967864
ADMIN_BCA_NAME=Dzaky School Payment

# Blockchain Settings
SCHOOL_WALLET_ADDRESS=0x8ba1f109551bD432803012645Hac136c5C1fD4E5
SCHOOL_PRIVATE_KEY=your_private_key_here
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
```

---

## 🔄 How It Works

### 1. Payment Flow
```
User Pays GoPay → Webhook Notification → Auto-Convert Service → Blockchain Transfer
```

### 2. Conversion Process
1. **Payment Detection**: Webhook receives payment notification
2. **Validation**: Verify payment to admin number/account
3. **Rate Fetching**: Get real-time IDR to MATIC exchange rate
4. **Conversion**: Calculate MATIC amount (minus 1% fee)
5. **Blockchain Transfer**: Send MATIC to school wallet
6. **Database Update**: Record conversion details

### 3. Supported Payment Methods
- ✅ **GoPay**: 081216494184
- ✅ **OVO**: 081216494184  
- ✅ **DANA**: 081216494184
- ✅ **Bank BCA**: 0391967864

---

## 🛠️ API Endpoints

### Webhook Endpoints
```bash
# GoPay Webhook
POST /api/webhooks/gopay-webhook
Content-Type: application/json
X-Signature: webhook_signature

{
  "transaction_id": "GP123456",
  "amount": 100000,
  "status": "PAID",
  "phone_number": "081216494184",
  "payment_id": "payment_123"
}
```

### Testing Endpoints
```bash
# Health Check
GET /api/webhooks/health

# Manual Trigger (for testing)
POST /api/webhooks/manual-trigger
{
  "paymentId": "test-123",
  "method": "gopay",
  "amount": 50000
}

# Statistics
GET /api/webhooks/stats
```

---

## 🧪 Testing

### Run Test Suite
```bash
node test-auto-convert.js
```

### Manual Testing
```bash
# 1. Check system health
curl http://localhost:5000/api/webhooks/health

# 2. Test manual conversion
curl -X POST http://localhost:5000/api/webhooks/manual-trigger \
  -H "Content-Type: application/json" \
  -d '{"paymentId":"test-123","method":"gopay","amount":50000}'

# 3. Check conversion stats
curl http://localhost:5000/api/webhooks/stats
```

---

## 💰 Exchange Rate & Fees

### Current Rates (Example)
- **1 MATIC** ≈ **Rp 10,000**
- **Conversion Fee**: **1%** of amount
- **Blockchain Fee**: **~0.001 MATIC** per transaction

### Example Conversion
```
Payment: Rp 100,000 (GoPay)
Exchange Rate: 1 MATIC = Rp 10,000
Gross MATIC: 10 MATIC
Conversion Fee (1%): 0.1 MATIC
Net MATIC: 9.9 MATIC
Blockchain Fee: 0.001 MATIC
Final Amount: 9.899 MATIC → School Wallet
```

---

## 📊 Monitoring & Analytics

### Conversion Statistics
- **Total Conversions**: Count of successful conversions
- **Success Rate**: Percentage of successful conversions
- **Total Volume**: Total IDR converted
- **Average Amount**: Average conversion amount
- **Method Breakdown**: Stats per payment method

### Real-time Monitoring
```javascript
// Check processing queue
GET /api/webhooks/health
{
  "status": "healthy",
  "autoConvertEnabled": true,
  "exchangeRate": 10000,
  "walletBalance": "5.2341 MATIC",
  "processingQueue": 0
}
```

---

## 🔐 Security Features

### Webhook Security
- **Signature Verification**: All webhooks must be properly signed
- **IP Whitelisting**: Only accept webhooks from trusted IPs
- **Rate Limiting**: Prevent webhook spam

### Blockchain Security
- **Private Key Protection**: Encrypted storage of private keys
- **Transaction Limits**: Daily/hourly conversion limits
- **Multi-signature**: Optional multi-sig wallet support

### Error Handling
- **Retry Logic**: Auto-retry failed conversions
- **Fallback Rates**: Use cached rates if API fails
- **Alert System**: Notify admin of conversion failures

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Conversion Failed
```bash
# Check wallet balance
curl http://localhost:5000/api/webhooks/health

# Check exchange rate service
curl "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=idr"
```

#### 2. Webhook Not Received
- Verify webhook URL is accessible
- Check signature verification
- Confirm payment to correct admin number

#### 3. Blockchain Transaction Failed
- Check wallet balance (need MATIC for gas)
- Verify network connectivity
- Check gas price settings

### Error Codes
- **INSUFFICIENT_BALANCE**: Wallet doesn't have enough MATIC for gas
- **INVALID_SIGNATURE**: Webhook signature verification failed
- **RATE_LIMIT_EXCEEDED**: Too many conversion requests
- **NETWORK_ERROR**: Blockchain network connectivity issue

---

## 📈 Performance Optimization

### Caching Strategy
- **Exchange Rates**: Cached for 1 minute
- **Blockchain Data**: Cached for 30 seconds
- **Conversion Stats**: Cached for 5 minutes

### Queue Management
- **Processing Queue**: Prevent duplicate conversions
- **Batch Processing**: Group small conversions
- **Priority Queue**: Prioritize larger amounts

---

## 🔄 Deployment Checklist

### Pre-deployment
- [ ] Configure environment variables
- [ ] Test webhook endpoints
- [ ] Verify blockchain connectivity
- [ ] Check wallet balance
- [ ] Test conversion flow

### Production Setup
- [ ] Enable SSL for webhooks
- [ ] Configure monitoring alerts
- [ ] Set up backup systems
- [ ] Document emergency procedures
- [ ] Train admin staff

### Monitoring Setup
- [ ] Set up health check monitoring
- [ ] Configure conversion alerts
- [ ] Monitor wallet balance
- [ ] Track conversion success rate

---

## 📞 Support & Maintenance

### Daily Checks
- Monitor conversion success rate
- Check wallet balance
- Review error logs
- Verify exchange rate accuracy

### Weekly Tasks
- Analyze conversion statistics
- Review security logs
- Update exchange rate sources
- Test backup systems

### Monthly Tasks
- Security audit
- Performance optimization
- Update documentation
- Review and adjust fees

---

## 🎯 Success Metrics

### Target KPIs
- **Conversion Success Rate**: >95%
- **Average Conversion Time**: <30 seconds
- **System Uptime**: >99.9%
- **Error Rate**: <1%

### Monitoring Dashboard
```javascript
{
  "conversions": {
    "total": 1250,
    "successful": 1238,
    "failed": 12,
    "successRate": "99.04%"
  },
  "volume": {
    "totalIDR": 125000000,
    "totalMATIC": 12500,
    "averageAmount": 100000
  },
  "performance": {
    "avgConversionTime": "15.2s",
    "uptime": "99.97%",
    "errorRate": "0.96%"
  }
}
```

---

**🎉 Auto-Convert System siap digunakan! Semua pembayaran GoPay, OVO, DANA, dan Bank akan otomatis dikonversi ke MATIC dan masuk ke wallet sekolah.**