import React, { useState } from 'react';
import { X, ExternalLink, Copy } from 'lucide-react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import toast from 'react-hot-toast';

const UniversalQRModal = ({ payment, isOpen, onClose }) => {
  const [universalUrl, setUniversalUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateUniversalPayment = async () => {
    if (universalUrl) return; // Already generated
    
    setLoading(true);
    try {
      const response = await axios.post('/api/universal-payment/create', {
        studentId: payment.studentId,
        studentName: payment.studentName,
        paymentType: payment.paymentType,
        amount: payment.amount,
        description: payment.description
      });
      
      setUniversalUrl(response.data.webUrl);
    } catch (error) {
      console.error('Error creating universal payment:', error);
      toast.error('Gagal membuat QR universal');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && payment) {
      generateUniversalPayment();
    }
  }, [isOpen, payment]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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

  const copyUrl = () => {
    navigator.clipboard.writeText(universalUrl);
    toast.success('Link pembayaran disalin!');
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">🌟 Universal Payment QR</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          Bayar dengan metode apapun yang Anda suka!
        </p>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border text-center">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <QRCode
                value={universalUrl || `${window.location.origin}/pay/demo`}
                size={180}
                className="mx-auto mb-3"
              />
              <p className="text-xs text-gray-500">
                Scan untuk akses semua metode pembayaran
              </p>
            </>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Siswa:</strong> {payment.studentName}</p>
            <p><strong>Jenis:</strong> {getPaymentTypeLabel(payment.paymentType)}</p>
            <p><strong>Jumlah:</strong> {formatCurrency(payment.amount)}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Metode Pembayaran Tersedia:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">🏦 Bank Transfer</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">📱 GoPay</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">💜 OVO</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">💙 DANA</span>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">₿ Bitcoin</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">⟠ Ethereum</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">🔷 Polygon</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">◎ Solana</span>
            </div>
          </div>

          {universalUrl && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-blue-700 mb-2">Link Pembayaran:</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-white p-2 rounded flex-1 truncate">
                  {universalUrl}
                </code>
                <button onClick={copyUrl} className="text-blue-600 hover:text-blue-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Tutup
          </button>
          <button
            onClick={() => {
              if (universalUrl) {
                window.open(universalUrl, '_blank');
              }
            }}
            disabled={!universalUrl}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka Halaman Bayar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalQRModal;