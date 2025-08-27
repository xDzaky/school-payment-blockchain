import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

  // Polygon Mumbai Testnet
  const POLYGON_CHAIN_ID = '0x13881';
  const POLYGON_RPC_URL = 'https://rpc-mumbai.maticvigil.com';

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          
          setProvider(provider);
          setSigner(signer);
          setAccount(accounts[0]);
          setChainId(network.chainId.toString());
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask tidak terdeteksi. Silakan install MetaMask terlebih dahulu.');
      return { success: false, message: 'MetaMask not found' };
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(network.chainId.toString());
      setIsConnected(true);

      // Check if on correct network
      if (network.chainId.toString() !== parseInt(POLYGON_CHAIN_ID, 16).toString()) {
        await switchToPolygon();
      }

      toast.success('Wallet berhasil terhubung!');
      return { success: true, account: accounts[0] };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Gagal menghubungkan wallet');
      return { success: false, message: error.message };
    }
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_CHAIN_ID }],
      });
    } catch (switchError) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: POLYGON_CHAIN_ID,
              chainName: 'Polygon Mumbai Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: [POLYGON_RPC_URL],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            }],
          });
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
          toast.error('Gagal menambahkan jaringan Polygon');
        }
      }
    }
  };

  const sendTransaction = async (to, amount, data = '0x') => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = {
        to,
        value: ethers.parseEther(amount.toString()),
        data
      };

      const transaction = await signer.sendTransaction(tx);
      toast.success('Transaksi berhasil dikirim!');
      return transaction;
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaksi gagal');
      throw error;
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount('');
      setProvider(null);
      setSigner(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16).toString());
    window.location.reload();
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount('');
    setProvider(null);
    setSigner(null);
    setChainId(null);
  };

  const value = {
    provider,
    signer,
    account,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    switchToPolygon
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};