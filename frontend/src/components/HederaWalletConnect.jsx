import { useState } from 'react';
import { useHederaWallet } from '../context/HederaWalletContext';

export default function HederaWalletConnect() {
  const { dAppConnector, userAccountId, connect, disconnect, connected, error } = useHederaWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await connect();
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await disconnect();
    } catch (err) {
      console.error('Disconnect error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAccountId = (accountId) => {
    if (!accountId) return '';
    return accountId.length > 12 ? `${accountId.substring(0, 6)}...${accountId.substring(accountId.length - 4)}` : accountId;
  };

  if (connected) {
    return (
      <div className="flex items-center">
        <div className="mr-3 hidden md:block">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            {formatAccountId(userAccountId)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className="text-sm bg-red-50 hover:bg-red-100 text-red-700 font-medium py-1.5 px-3 rounded-lg transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Disconnecting...
            </span>
          ) : (
            'Disconnect'
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors"
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}