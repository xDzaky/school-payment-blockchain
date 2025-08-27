import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { Mail, Lock, Wallet, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { connectWallet, account } = useWeb3();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, account);
      
      if (result.success) {
        toast.success('Login berhasil!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    const result = await connectWallet();
    if (result.success) {
      toast.success('Wallet berhasil terhubung!');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-600">Masuk ke akun SchoolPay Anda</p>
        </div>

        {/* Wallet Connection */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Hubungkan wallet untuk transaksi blockchain
            </p>
            {account ? (
              <div className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectWallet}
                className="flex items-center justify-center space-x-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect MetaMask</span>
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Masukkan email Anda"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10"
                placeholder="Masukkan password Anda"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Daftar di sini
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 text-center mb-3">Demo Accounts:</p>
          <div className="space-y-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <strong>Parent:</strong> parent@demo.com / password123
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>Admin:</strong> admin@demo.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;