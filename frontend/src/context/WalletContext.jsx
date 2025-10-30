import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [evmAddress, setEvmAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [chainId, setChainId] = useState(null);

  // Hedera Testnet configuration
  const HEDERA_TESTNET_CONFIG = {
    chainId: "0x128", // 296 in hex
    chainName: "Hedera Testnet",
    nativeCurrency: {
      name: "HBAR",
      symbol: "HBAR",
      decimals: 18,
    },
    rpcUrls: ["https://testnet.hashio.io/api"],
    blockExplorerUrls: ["https://hashscan.io/testnet"],
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectMetaMask();
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const addHederaNetwork = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [HEDERA_TESTNET_CONFIG],
      });
    } catch (error) {
      console.error("Failed to add Hedera network:", error);
      throw error;
    }
  };

  const switchToHederaNetwork = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HEDERA_TESTNET_CONFIG.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Network not added, add it first
        await addHederaNetwork();
      } else {
        console.error("Failed to switch to Hedera network:", error);
        throw error;
      }
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    setIsLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // Switch to Hedera network
      await switchToHederaNetwork();

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setEvmAddress(address);
      setAccountId(address); // For MetaMask, we use the EVM address as account ID
      setChainId(network.chainId.toString());
      setConnected(true);
      setWalletType("MetaMask");

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      console.log("Connected to MetaMask:", address);
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connectWalletConnect = async () => {
    setIsLoading(true);
    try {
      // Import WalletConnect dynamically
      const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
      
      const walletConnectProvider = await EthereumProvider.init({
        projectId: import.meta.env.VITE_WC_PROJECT_ID,
        chains: [296], // Hedera Testnet
        showQrModal: true,
        metadata: {
          name: "AgriYield DApp",
          description: "Agricultural Investment Platform",
          url: "https://agri-yield.com",
          icons: ["https://absolute.url/to/icon.png"]
        }
      });

      // Enable session (triggers QR Code modal)
      await walletConnectProvider.enable();

      const web3Provider = new ethers.BrowserProvider(walletConnectProvider);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setEvmAddress(address);
      setAccountId(address);
      setChainId(network.chainId.toString());
      setConnected(true);
      setWalletType("WalletConnect");

      // Listen for events
      walletConnectProvider.on("accountsChanged", handleAccountsChanged);
      walletConnectProvider.on("chainChanged", handleChainChanged);
      walletConnectProvider.on("disconnect", handleDisconnect);

      console.log("Connected via WalletConnect:", address);
    } catch (error) {
      console.error("Failed to connect via WalletConnect:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setEvmAddress(accounts[0]);
      setAccountId(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    // Reload the page to reset the dapp state
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const disconnect = async () => {
    try {
      if (provider && provider.provider && provider.provider.disconnect) {
        await provider.provider.disconnect();
      }

      // Remove event listeners
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }

      setProvider(null);
      setSigner(null);
      setAccountId("");
      setEvmAddress("");
      setChainId(null);
      setConnected(false);
      setWalletType("");

      console.log("Disconnected from wallet");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const sendTransaction = async (transaction) => {
    if (!signer || !connected) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await signer.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const signMessage = async (message) => {
    if (!signer || !connected) {
      throw new Error("Wallet not connected");
    }

    try {
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error("Message signing failed:", error);
      throw error;
    }
  };

  const value = {
    // Connection state
    connected,
    isLoading,
    walletType,
    chainId,
    
    // Account info
    accountId,
    evmAddress,
    
    // Provider and signer
    provider,
    signer,
    
    // Methods
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    sendTransaction,
    signMessage,
    addHederaNetwork,
    switchToHederaNetwork,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContext };