import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import {
  HederaSessionEvent,
  HederaJsonRpcMethod,
  DAppConnector,
  HederaChainId,
} from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';
import HederaContractService from '../services/HederaContractService';

// Remove TypeScript interfaces and use JSDoc for type hints
/**
 * @typedef {Object} WalletEvent
 * @property {string} name
 * @property {Object} data
 * @property {string} [data.topic]
 */

/**
 * @typedef {DAppConnector & { events$?: { subscribe: (callback: (event: WalletEvent) => void) => { unsubscribe: () => void } } }} DAppConnectorWithEvents
 */

/**
 * @typedef {Object} DAppConnectorContext
 * @property {DAppConnector|null} dAppConnector
 * @property {string|null} userAccountId
 * @property {string|null} sessionTopic
 * @property {(() => Promise<void>)|null} disconnect
 * @property {(() => void)|null} refresh
 */

const projectId = "a042654ff3e2ceaa274eca9d59dc8fbc";

const metadata = {
  name: 'AgriYield DApp',
  description: 'Crowdfunding & Marketplace for farmers',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://agri-yield.local',
  icons: ['https://via.placeholder.com/32'],
};

const DAppConnectorContext = createContext(null);

export const useHederaWallet = () => {
  const context = useContext(DAppConnectorContext);
  if (!context) {
    throw new Error('useHederaWallet must be used within a HederaWalletProvider');
  }
  return context;
};

/**
 * @param {{ children: ReactNode }} props
 */
export function HederaWalletProvider({ children }) {
  const [dAppConnector, setDAppConnector] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [userAccountId, setUserAccountId] = useState(null);
  const [sessionTopic, setSessionTopic] = useState(null);
  const [error, setError] = useState(null);

  // Listen for account/session changes using events$
  useEffect(() => {
    if (!dAppConnector) return;

    // Cast to connector with events
    const connectorWithEvents = dAppConnector;
    const subscription = connectorWithEvents.events$?.subscribe((event) => {
      console.log('Wallet event received:', event);
      
      if (event.name === 'accountsChanged' || event.name === 'chainChanged') {
        const accountId = dAppConnector.signers?.[0]?.getAccountId().toString() ?? null;
        setUserAccountId(accountId);
        
        // Try to get topic from event data
        if (event.data && event.data.topic) {
          setSessionTopic(event.data.topic);
        } else if (dAppConnector.signers?.[0]?.topic) {
          setSessionTopic(dAppConnector.signers[0].topic);
        } else {
          setSessionTopic(null);
        }
      } else if (event.name === 'session_delete' || event.name === 'sessionDelete') {
        setUserAccountId(null);
        setSessionTopic(null);
      }
    });

    // Set initial state
    const accountId = dAppConnector.signers?.[0]?.getAccountId().toString() ?? null;
    setUserAccountId(accountId);
    
    if (dAppConnector.signers?.[0]?.topic) {
      setSessionTopic(dAppConnector.signers[0].topic);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [dAppConnector]);

  // Provide a disconnect function
  const disconnect = async () => {
    try {
      if (dAppConnector && sessionTopic) {
        await dAppConnector.disconnect(sessionTopic);
        setUserAccountId(null);
        setSessionTopic(null);
        console.log('Disconnected successfully');
      }
    } catch (err) {
      console.error('Error disconnecting:', err);
      setError(err.message);
    }
  };

  // Provide a refresh function
  const refresh = () => {
    if (dAppConnector) {
      const accountId = dAppConnector.signers?.[0]?.getAccountId().toString() ?? null;
      setUserAccountId(accountId);
      setSessionTopic(dAppConnector.signers?.[0]?.topic ?? null);
    }
  };

  // Initialize the DApp connector
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        setError(null);
        
        if (!projectId) {
          throw new Error('VITE_WC_PROJECT_ID is required');
        }

        console.log('Initializing Hedera DApp Connector...');
        
        const connector = new DAppConnector(
          metadata,
          LedgerId.TESTNET,
          projectId,
          Object.values(HederaJsonRpcMethod),
          [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
          [HederaChainId.Mainnet, HederaChainId.Testnet],
        );
        
        await connector.init();
        
        // Initialize HederaContractService when connector is ready
        HederaContractService.initialize(connector);
        
        if (isMounted) {
          setDAppConnector(connector);
          setIsReady(true);
          console.log('Hedera DApp Connector initialized successfully');
        }
      } catch (err) {
        console.error('Failed to initialize Hedera DApp Connector:', err);
        if (isMounted) {
          setError(err.message);
          setIsReady(true); // Set ready even on error to show error state
        }
      }
    };

    init();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Connect function to open pairing modal
  const connect = async () => {
    if (!dAppConnector) {
      setError('DApp Connector not initialized');
      return;
    }

    try {
      setError(null);
      console.log('Opening pairing modal...');
      await dAppConnector.connect();
      console.log('Pairing modal opened');
    } catch (err) {
      console.error('Failed to connect:', err);
      setError(err.message);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <DAppConnectorContext.Provider
      value={{ 
        dAppConnector, 
        userAccountId, 
        sessionTopic, 
        disconnect, 
        refresh, 
        connect,
        error,
        connected: !!userAccountId
      }}
    >
      {children}
    </DAppConnectorContext.Provider>
  );
}

export default DAppConnectorContext;
