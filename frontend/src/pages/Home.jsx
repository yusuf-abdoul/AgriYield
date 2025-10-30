import { useState, useEffect } from "react";
import { useHederaWallet } from "../context/HederaWalletContext";
import { Link } from "react-router-dom";
import FarmCard from "../components/FarmCard";
import HederaWalletConnect from "../components/HederaWalletConnect";
import KYCManager from "../components/KYCManager";
import { contractService } from "../services/contractService.js";


const demoFarms = [
  {
    id: 1,
    name: "Sunrise Maize Farm",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
    fundingGoal: 10000,
    raised: 2500,
    metaCID: "demo-maize-1"
  },
  {
    id: 2,
    name: "Green Valley Rice",
    image: "https://images.unsplash.com/photo-1500937287812-8f7f8e7a8c44?q=80&w=1200&auto=format&fit=crop",
    fundingGoal: 20000,
    raised: 12000,
    metaCID: "demo-rice-2"
  },
  {
    id: 3,
    name: "Highland Coffee Estate",
    image: "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1200&auto=format&fit=crop",
    fundingGoal: 50000,
    raised: 38000,
    metaCID: "demo-coffee-3"
  }
];

export default function Home() {
  const { connected, userAccountId } = useHederaWallet();
  const [farms, setFarms] = useState([]);
  const [network, setNetwork] = useState(import.meta.env.VITE_HEDERA_NETWORK || "testnet");

  useEffect(() => {
    let mounted = true;
    if (connected) {
      contractService.getListings().then(listings => {
        if (mounted) setFarms(listings.length > 0 ? listings : demoFarms);
      }).catch(() => {
        if (mounted) setFarms(demoFarms);
      });
    } else {
      setFarms(demoFarms);
    }
    return () => { mounted = false; };
  }, [connected]);

  const handleInvest = async (farmId, amount) => {
    try {
      if (connected) {
        await contractService.invest(farmId, amount);
        alert("Investment successful!");
      } else {
        alert("Please connect your Hedera wallet to invest.");
      }
    } catch (e) {
      console.error(e);
      alert("Investment failed.");
    }
  };

    return (
        <div className="space-y-6">
            {/* Wallet Connection Section */}
            {!connected && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">Connect Your Hedera Wallet</h2>
                  <p className="text-blue-700 mb-4">Connect your Hedera wallet to start investing in farm campaigns</p>
                  <HederaWalletConnect />
                </div>
              </div>
            )}

            {/* Hedera Network Info */}
            {connected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Connected to Hedera {network}</h3>
                    <p className="text-xs text-green-700">Account ID: {userAccountId}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Connected
                  </span>
                </div>
              </div>
            )}
            
            {/* KYC Manager Section */}
            {connected && <KYCManager />}

            {/* Farm Campaigns Section */}
            <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Farm Campaigns</h1>
        <p className="text-sm text-gray-700 dark:text-gray-400">Invest in farm campaigns to support farmers and earn returns.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onInvest={(f) => handleInvest(f.id, 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
