import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  CreditCard, 
  Plus, 
  Wallet, 
  QrCode, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import UniversalQRModal from '../components/UniversalQRModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const Payments = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet, sendTransaction, account } = useWeb3();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);

  const [newPayment, setNewPayment] = useState({
    studentId: '',
    studentName: '',
    paymentType: 'spp',
    amount: '',
    description: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments/pending');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/payments/create', newPayment);
      toast.success('Tagihan berhasil dibuat');
      setShowCreateModal(false);
      setNewPayment({
        studentId: '',
        studentName: '',
        paymentType: 'spp',
        amount: '',
        description: '',
        dueDate: ''
      });
      fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Gagal membuat tagihan');
    }
  };

  const handlePayWithWallet = async (payment) => {
    if (!isConnected) {
      const result = await connectWallet();
      if (!result.success) return;
    }

    setProcessingPayment(payment._id);

    try {
      // Convert IDR to MATIC (Polygon native token)
      // 1 MATIC = ~Rp 10,000 (example rate)
      const maticAmount = payment.amount / 10000;
      
      // School wallet address (where funds will be collected)
      const schoolWalletAddress = '0x8ba1f109551bD432803012645Hac136c5C1fD4E5';
      
      toast.info(`Mengirim ${maticAmount.toFixed(4)} MATIC ke wallet sekolah...`);
      
      // Send transaction to school wallet
      const tx = await sendTransaction(
        schoolWalletAddress,
        maticAmount
      );

      toast.success('Transaksi berhasil dikirim! Menunggu konfirmasi...');

      // Verify transaction on blockchain
      const verifyResponse = await axios.post('/api/payments/verify', {
        paymentId: payment._id,
        transactionHash: tx.hash,
        amount: maticAmount,
        schoolWallet: schoolWalletAddress
      });

      if (verifyResponse.data.payment.status === 'completed') {
        toast.success('✅ Pembayaran berhasil dikonfirmasi!');
        fetchPayments();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Pembayaran gagal: ' + error.message);
    } finally {
      setProcessingPayment(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentTypeLabel = (type) => {
    const labels = {
      spp: 'SPP',
      kegiatan: 'Kegiatan',
      kantin: 'Kantin',
      donasi: 'Donasi'
    };
    return labels[type] || type;
  };

  const getPaymentTypeColor = (type) => {
    const colors = {
      spp: 'bg-blue-100 text-blue-800',
      kegiatan: 'bg-green-100 text-green-800',
      kantin: 'bg-yellow-100 text-yellow-800',
      donasi: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
          <p className="text-gray-600">Kelola tagihan dan pembayaran sekolah</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tagihan</span>
        </button>
      </div>

      {/* Universal Payment Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <QrCode className="w-6 h-6 text-blue-600" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              🌟 Universal Payment QR Code
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Sekarang mendukung pembayaran dari GoPay, OVO, DANA, Bank Transfer, Bitcoin, Ethereum, Polygon, Solana, dan banyak lagi!
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Status Alert */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Wallet Belum Terhubung
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Hubungkan wallet MetaMask untuk melakukan pembayaran blockchain
              </p>
            </div>
            <button
              onClick={connectWallet}
              className="btn-primary text-sm"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="space-y-4">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment._id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.paymentType)}`}>
                      {getPaymentTypeLabel(payment.paymentType)}
                    </span>
                    {payment.dueDate && (
                      <span className="text-sm text-gray-500">
                        Jatuh tempo: {formatDate(payment.dueDate)}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {payment.description}
                  </h3>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Siswa: {payment.studentName}</p>
                    <p>NIS: {payment.studentId}</p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowQRModal(true);
                    }}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Universal</span>
                  </button>
                  
                  <button
                    onClick={() => handlePayWithWallet(payment)}
                    disabled={!isConnected || processingPayment === payment._id}
                    className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingPayment === payment._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Bayar via Wallet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak Ada Tagihan Pending
            </h3>
            <p className="text-gray-600 mb-6">
              Semua tagihan sudah dibayar atau belum ada tagihan baru
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Buat Tagihan Baru
            </button>
          </div>
        )}
      </div>

      {/* Create Payment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Buat Tagihan Baru</h2>
            
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIS Siswa
                  </label>
                  <input
                    type="text"
                    value={newPayment.studentId}
                    onChange={(e) => setNewPayment({...newPayment, studentId: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Siswa
                  </label>
                  <input
                    type="text"
                    value={newPayment.studentName}
                    onChange={(e) => setNewPayment({...newPayment, studentName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Pembayaran
                </label>
                <select
                  value={newPayment.paymentType}
                  onChange={(e) => setNewPayment({...newPayment, paymentType: e.target.value})}
                  className="input-field"
                >
                  <option value="spp">SPP</option>
                  <option value="kegiatan">Kegiatan</option>
                  <option value="kantin">Kantin</option>
                  <option value="donasi">Donasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah (IDR)
                </label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jatuh Tempo (Opsional)
                </label>
                <input
                  type="date"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Buat Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal QR Modal */}
      <UniversalQRModal
        payment={selectedPayment}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
};

export default Payments;