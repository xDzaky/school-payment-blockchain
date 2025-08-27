import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  CreditCard,
  Calendar,
  ExternalLink,
  Wallet,
  Copy
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/api/dashboard/admin/overview');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Gagal memuat data admin');
    } finally {
      setLoading(false);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'Pending',
      completed: 'Selesai',
      failed: 'Gagal'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Alamat wallet disalin!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { statistics, recentTransactions } = dashboardData || {};
  const schoolWalletAddress = '0x8ba1f109551bD432803012645Hac136c5C1fD4E5';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Kelola dan monitor sistem pembayaran sekolah</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pembayaran</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.totalPayments || 0}</p>
            </div>
            <CreditCard className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statistics?.pendingPayments || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{statistics?.completedPayments || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendapatan Bulan Ini</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(statistics?.monthlyRevenue || 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* School Wallet Info */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          💰 Wallet Sekolah - Tempat Dana Terkumpul
        </h2>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">📍 Alamat Wallet Sekolah:</label>
              <div className="flex items-center space-x-2 mt-2">
                <code className="text-sm bg-gray-800 text-green-400 px-3 py-2 rounded flex-1">
                  {schoolWalletAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(schoolWalletAddress)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://mumbai.polygonscan.com/address/${schoolWalletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-primary-600 hover:text-primary-700"
                  title="View on PolygonScan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">🌐 Network:</label>
                <p className="text-sm text-gray-900 font-medium">Polygon Mumbai Testnet</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">📊 Status:</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 ml-2">
                  ✅ Aktif & Siap Menerima
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Cara Mengakses Dana:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Semua pembayaran dari orang tua masuk ke wallet ini dalam bentuk MATIC</li>
                <li>• Import wallet ke MetaMask dengan private key yang aman</li>
                <li>• Dana bisa ditransfer ke exchange atau wallet lain</li>
                <li>• Pantau saldo real-time di PolygonScan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Type */}
      {statistics?.revenueByType && statistics.revenueByType.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pendapatan per Kategori
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistics.revenueByType.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {getPaymentTypeLabel(item._id)}
                </h3>
                <p className="text-lg font-bold text-primary-600">
                  {formatCurrency(item.total)}
                </p>
                <p className="text-sm text-gray-600">{item.count} transaksi</p>
                <p className="text-xs text-green-600 mt-1">
                  ≈ {(item.total / 10000).toFixed(2)} MATIC
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Transaksi Terbaru
        </h2>
        
        {recentTransactions && recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tanggal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Orang Tua</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Siswa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Jenis</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Jumlah</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Hash</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{transaction.userId?.name}</div>
                        <div className="text-gray-500 text-xs">{transaction.userId?.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{transaction.studentName}</div>
                        <div className="text-gray-500 text-xs">NIS: {transaction.studentId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.paymentType === 'spp' ? 'bg-blue-100 text-blue-800' :
                        transaction.paymentType === 'kegiatan' ? 'bg-green-100 text-green-800' :
                        transaction.paymentType === 'kantin' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {getPaymentTypeLabel(transaction.paymentType)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      <div>
                        <div>{formatCurrency(transaction.amount)}</div>
                        <div className="text-xs text-green-600">
                          ≈ {(transaction.amount / 10000).toFixed(4)} MATIC
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {transaction.transactionHash ? (
                        <a
                          href={`https://mumbai.polygonscan.com/tx/${transaction.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                        >
                          <span className="text-xs">
                            {`${transaction.transactionHash.slice(0, 6)}...${transaction.transactionHash.slice(-4)}`}
                          </span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada transaksi</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Users className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">Kelola Pengguna</h3>
            <p className="text-sm text-gray-600">Tambah atau edit data orang tua dan siswa</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <CreditCard className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">Buat Tagihan Massal</h3>
            <p className="text-sm text-gray-600">Buat tagihan untuk semua siswa sekaligus</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">Laporan Keuangan</h3>
            <p className="text-sm text-gray-600">Export laporan pembayaran dan pendapatan</p>
          </button>
          
          <button 
            onClick={() => window.open(`https://mumbai.polygonscan.com/address/${schoolWalletAddress}`, '_blank')}
            className="p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 text-left"
          >
            <Wallet className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Cek Saldo Wallet</h3>
            <p className="text-sm text-gray-600">Lihat saldo real-time di blockchain</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;