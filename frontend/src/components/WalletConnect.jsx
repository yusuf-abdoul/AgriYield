import { useState } from "react";
import { useWallet } from "../context/WalletContext";

const WalletConnect = () => {
  const {
    connected,
    isLoading,
    walletType,
    accountId,
    evmAddress,
    chainId,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
  } = useWallet();

  const [error, setError] = useState("");

  const handleConnectMetaMask = async () => {
    try {
      setError("");
      await connectMetaMask();
    } catch (error) {
      setError(error.message || "Failed to connect to MetaMask");
    }
  };

  const handleConnectWalletConnect = async () => {
    try {
      setError("");
      await connectWalletConnect();
    } catch (error) {
      setError(error.message || "Failed to connect via WalletConnect");
    }
  };

  const handleDisconnect = async () => {
    try {
      setError("");
      await disconnect();
    } catch (error) {
      setError(error.message || "Failed to disconnect");
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isHederaNetwork = chainId === "296" || chainId === "0x128";

  if (connected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Connected</h3>
            <p className="text-sm text-gray-600 mb-4">Connected via {walletType}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Address</p>
              <p className="text-sm font-mono text-gray-900">{formatAddress(evmAddress)}</p>
            </div>
            
            {accountId !== evmAddress && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account ID</p>
                <p className="text-sm font-mono text-gray-900">{formatAddress(accountId)}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Network</p>
              <div className="flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isHederaNetwork ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <p className="text-sm text-gray-900">
                  {isHederaNetwork ? 'Hedera Testnet' : `Chain ID: ${chainId}`}
                </p>
              </div>
            </div>
          </div>

          {!isHederaNetwork && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800">
                ⚠️ Please switch to Hedera Testnet for full functionality
              </p>
            </div>
          )}

          <button
            onClick={handleDisconnect}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 text-sm">
            Choose your preferred wallet to connect to the AgriYield platform
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleConnectMetaMask}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 mr-3 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="font-medium text-gray-900">
              {isLoading ? "Connecting..." : "Connect with MetaMask"}
            </span>
          </button>

          <button
            onClick={handleConnectWalletConnect}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 mr-3 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <span className="font-medium text-gray-900">
              {isLoading ? "Connecting..." : "Connect with WalletConnect"}
            </span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
