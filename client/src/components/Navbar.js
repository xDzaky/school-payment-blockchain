import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { Wallet, LogOut, User, Home, CreditCard, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate('/');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">SchoolPay</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/payments" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pembayaran</span>
                </Link>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Wallet Connection */}
            {user && (
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatAddress(account)}</span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">Connect Wallet</span>
                  </button>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-gray-500 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;