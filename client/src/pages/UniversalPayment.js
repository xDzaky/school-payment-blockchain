import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Copy, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Bitcoin,
  Coins
} from 'lucide-react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import toast from 'react-hot-toast';

const UniversalPayment = () => {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('qr');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`/api/universal-payment/${paymentId}`);
      setPayment(response.data.payment);
      setPaymentMethods(response.data.paymentMethods);
    } catch (error) {
      console.error('Error fetching payment:', error);
      toast.error('Payment tidak ditemukan atau sudah expired');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin!`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleVerifyPayment = async (method, details) => {
    setVerifying(true);
    try {
      const response = await axios.post(`/api/universal-payment/verify/${paymentId}`, {
        method,
        ...details
      });
      
      toast.success('Pembayaran berhasil diverifikasi!');
      setPayment({ ...payment, status: 'completed' });
    } catch (error) {
      toast.error('Gagal memverifikasi pembayaran');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Not Found</h1>
        <p className="text-gray-600">Payment tidak ditemukan atau sudah expired.</p>
      </div>
    );
  }

  const isExpired = new Date(payment.expiresAt) < new Date();
  const isCompleted = payment.status === 'completed';

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Universal Payment</h1>
            <p className="text-gray-600">Bayar dengan metode apapun yang Anda suka</p>
          </div>
          
          <div className="text-right">
            {isCompleted ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <AlertCircle className="w-4 h-4 mr-1" />
                Expired
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimeRemaining(payment.expiresAt)}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Detail Pembayaran</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Siswa:</span> {payment.student.name}</p>
              <p><span className="text-gray-600">NIS:</span> {payment.student.id}</p>
              <p><span className="text-gray-600">Deskripsi:</span> {payment.description}</p>
              <p><span className="text-gray-600 text-lg font-bold">Jumlah:</span> 
                <span className="text-primary-600 text-xl font-bold ml-2">
                  {formatCurrency(payment.amount)}
                </span>
              </p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-4">QR Code Universal</h3>
            <div className="bg-white p-4 rounded-lg border inline-block">
              <QRCode
                value={paymentMethods.web}
                size={150}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Scan untuk akses semua metode pembayaran
            </p>
          </div>
        </div>
      </div>

      {!isCompleted && !isExpired && (
        <>
          {/* Payment Method Selector */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pilih Metode Pembayaran</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setSelectedMethod('bank')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'bank' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Bank Transfer</p>
              </button>

              <button
                onClick={() => setSelectedMethod('ewallet')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'ewallet' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">E-Wallet</p>
              </button>

              <button
                onClick={() => setSelectedMethod('crypto')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'crypto' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Bitcoin className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-medium">Cryptocurrency</p>
              </button>

              <button
                onClick={() => setSelectedMethod('qr')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'qr' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Wallet className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">QR Universal</p>
              </button>
            </div>

            {/* Payment Method Details */}
            {selectedMethod === 'bank' && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-4">Transfer Bank</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Bank:</span>
                    <span className="font-medium">BCA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">No. Rekening:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-medium">1234567890</span>
                      <button onClick={() => copyToClipboard('1234567890', 'Nomor rekening')}>
                        <Copy className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Atas Nama:</span>
                    <span className="font-medium">Sekolah ABC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Jumlah:</span>
                    <span className="font-bold text-lg">{formatCurrency(payment.amount)}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'ewallet' && (
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-4">E-Wallet</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold">GO</span>
                      </div>
                      <p className="font-medium mb-2">GoPay</p>
                      <p className="text-sm text-gray-600 mb-3">081234567890</p>
                      <a
                        href={paymentMethods.gopay}
                        className="btn-primary text-sm w-full"
                      >
                        Bayar GoPay
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold">OVO</span>
                      </div>
                      <p className="font-medium mb-2">OVO</p>
                      <p className="text-sm text-gray-600 mb-3">081234567890</p>
                      <a
                        href={paymentMethods.ovo}
                        className="btn-primary text-sm w-full"
                      >
                        Bayar OVO
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold">DANA</span>
                      </div>
                      <p className="font-medium mb-2">DANA</p>
                      <p className="text-sm text-gray-600 mb-3">081234567890</p>
                      <a
                        href={paymentMethods.dana}
                        className="btn-primary text-sm w-full"
                      >
                        Bayar DANA
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'crypto' && (
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-4">Cryptocurrency</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Polygon */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <Coins className="w-6 h-6 text-purple-600 mr-2" />
                      <span className="font-medium">Polygon (MATIC)</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <div className="flex items-center space-x-1 mt-1">
                          <code className="text-xs bg-gray-100 p-1 rounded flex-1">
                            {paymentMethods.crypto.polygon.address}
                          </code>
                          <button onClick={() => copyToClipboard(paymentMethods.crypto.polygon.address, 'Polygon address')}>
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold ml-2">{paymentMethods.crypto.polygon.amount} MATIC</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Network:</span>
                        <span className="ml-2">Polygon Mumbai</span>
                      </div>
                    </div>
                  </div>

                  {/* Ethereum */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <Coins className="w-6 h-6 text-blue-600 mr-2" />
                      <span className="font-medium">Ethereum (ETH)</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <div className="flex items-center space-x-1 mt-1">
                          <code className="text-xs bg-gray-100 p-1 rounded flex-1">
                            {paymentMethods.crypto.ethereum.address}
                          </code>
                          <button onClick={() => copyToClipboard(paymentMethods.crypto.ethereum.address, 'Ethereum address')}>
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold ml-2">{paymentMethods.crypto.ethereum.amount} ETH</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Network:</span>
                        <span className="ml-2">Ethereum Mainnet</span>
                      </div>
                    </div>
                  </div>

                  {/* Solana */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <Coins className="w-6 h-6 text-green-600 mr-2" />
                      <span className="font-medium">Solana (SOL)</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <div className="flex items-center space-x-1 mt-1">
                          <code className="text-xs bg-gray-100 p-1 rounded flex-1">
                            {paymentMethods.crypto.solana.address}
                          </code>
                          <button onClick={() => copyToClipboard(paymentMethods.crypto.solana.address, 'Solana address')}>
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold ml-2">{paymentMethods.crypto.solana.amount} SOL</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Network:</span>
                        <span className="ml-2">Solana Mainnet</span>
                      </div>
                    </div>
                  </div>

                  {/* Bitcoin */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <Bitcoin className="w-6 h-6 text-orange-600 mr-2" />
                      <span className="font-medium">Bitcoin (BTC)</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <div className="flex items-center space-x-1 mt-1">
                          <code className="text-xs bg-gray-100 p-1 rounded flex-1">
                            {paymentMethods.crypto.bitcoin.address}
                          </code>
                          <button onClick={() => copyToClipboard(paymentMethods.crypto.bitcoin.address, 'Bitcoin address')}>
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold ml-2">{paymentMethods.crypto.bitcoin.amount} BTC</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Network:</span>
                        <span className="ml-2">Bitcoin Mainnet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'qr' && (
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h3 className="font-semibold text-purple-900 mb-4">QR Code Universal</h3>
                <div className="bg-white p-6 rounded-lg border inline-block mb-4">
                  <QRCode
                    value={paymentMethods.web}
                    size={200}
                    className="mx-auto"
                  />
                </div>
                <p className="text-purple-700 mb-2">
                  Scan QR code ini dengan aplikasi apapun yang mendukung pembayaran
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <span className="bg-white px-3 py-1 rounded-full">GoPay</span>
                  <span className="bg-white px-3 py-1 rounded-full">OVO</span>
                  <span className="bg-white px-3 py-1 rounded-full">DANA</span>
                  <span className="bg-white px-3 py-1 rounded-full">Bank</span>
                  <span className="bg-white px-3 py-1 rounded-full">Crypto</span>
                </div>
              </div>
            )}
          </div>

          {/* Manual Verification */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sudah Bayar?</h3>
            <p className="text-gray-600 mb-4">
              Jika Anda sudah melakukan pembayaran, klik tombol di bawah untuk verifikasi manual.
            </p>
            <button
              onClick={() => handleVerifyPayment(selectedMethod, { 
                transactionId: 'manual_' + Date.now(),
                paidAmount: payment.amount,
                paidCurrency: 'IDR'
              })}
              disabled={verifying}
              className="btn-primary"
            >
              {verifying ? 'Memverifikasi...' : 'Konfirmasi Pembayaran'}
            </button>
          </div>
        </>
      )}

      {isCompleted && (
        <div className="card p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
          <p className="text-gray-600">
            Terima kasih, pembayaran Anda telah berhasil diproses.
          </p>
        </div>
      )}
    </div>
  );
};

export default UniversalPayment;