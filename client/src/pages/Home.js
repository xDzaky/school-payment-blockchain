import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Shield, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Keamanan Blockchain',
      description: 'Transaksi aman dan transparan menggunakan teknologi blockchain Polygon'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Pembayaran Cepat',
      description: 'Proses pembayaran instan dengan biaya transaksi rendah'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Multi-Platform',
      description: 'Akses mudah untuk orang tua, siswa, dan admin sekolah'
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary-600" />,
      title: 'Berbagai Pembayaran',
      description: 'SPP, kegiatan sekolah, kantin, dan donasi dalam satu platform'
    }
  ];

  const paymentTypes = [
    { name: 'SPP Bulanan', description: 'Pembayaran SPP rutin setiap bulan' },
    { name: 'Kegiatan Sekolah', description: 'Biaya ekstrakurikuler dan acara sekolah' },
    { name: 'Kantin', description: 'Top-up saldo kantin digital' },
    { name: 'Donasi', description: 'Kontribusi untuk pengembangan sekolah' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Sistem Pembayaran Sekolah
            <span className="block text-primary-600">Berbasis Blockchain</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform pembayaran modern yang aman, transparan, dan efisien untuk semua kebutuhan sekolah. 
            Didukung teknologi blockchain Polygon untuk transaksi yang cepat dan murah.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
              Buka Dashboard
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Mengapa Pilih SchoolPay?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Solusi pembayaran sekolah yang menggabungkan kemudahan teknologi modern dengan keamanan blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Types Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Jenis Pembayaran</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Semua kebutuhan pembayaran sekolah dalam satu platform terintegrasi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {paymentTypes.map((type, index) => (
            <div key={index} className="card p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 -mx-4 px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Cara Kerja</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Proses pembayaran yang sederhana dan aman dalam beberapa langkah
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Login & Connect Wallet</h3>
            <p className="text-gray-600">Masuk ke akun dan hubungkan wallet MetaMask Anda</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Pilih Pembayaran</h3>
            <p className="text-gray-600">Pilih jenis pembayaran dan konfirmasi jumlah</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Transaksi Selesai</h3>
            <p className="text-gray-600">Pembayaran diproses dan tercatat di blockchain</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center space-y-8 bg-primary-50 -mx-4 px-4 py-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Siap Memulai?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan sistem pembayaran sekolah masa depan. Daftar sekarang dan rasakan kemudahan pembayaran blockchain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Daftar Gratis
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sudah Punya Akun?
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;