import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Wallet
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { isConnected, account } = useWeb3();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`/api/dashboard/${user.id}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { statistics, recentPayments } = dashboardData || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Selamat datang, {user.name}</p>
        </div>
        
        {/* Wallet Status */}
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Wallet tidak terhubung</span>
            </div>
          )}
        </div>
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
              <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(statistics?.totalPaidThisMonth || 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Children Information */}
      {user.children && user.children.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Data Anak
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.children.map((child, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{child.name}</h3>
                <p className="text-sm text-gray-600">NIS: {child.studentId}</p>
                <p className="text-sm text-gray-600">Kelas: {child.class}</p>
                <p className="text-sm text-gray-600">Tingkat: {child.grade}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Statistics by Type */}
      {statistics?.paymentsByType && statistics.paymentsByType.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pembayaran per Kategori
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistics.paymentsByType.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {getPaymentTypeLabel(item._id)}
                </h3>
                <p className="text-lg font-bold text-primary-600">
                  {formatCurrency(item.total)}
                </p>
                <p className="text-sm text-gray-600">{item.count} transaksi</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Riwayat Pembayaran Terbaru
        </h2>
        
        {recentPayments && recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tanggal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Siswa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Jenis</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Jumlah</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {payment.studentName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                      {getPaymentTypeLabel(payment.paymentType)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada riwayat pembayaran</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;