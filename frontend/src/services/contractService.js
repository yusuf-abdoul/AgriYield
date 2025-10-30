import HederaContractService from './HederaContractService';
import { AgriYieldABI, FarmSharesABI, MarketplaceABI, MockUSDTABI } from './ContractABIService';

// Contract addresses from environment variables
const CONTRACT_IDS = {
  agriYield: import.meta.env.VITE_AGRI_YIELD_CONTRACT,
  farmShares: import.meta.env.VITE_FARM_SHARES_CONTRACT,
  marketplace: import.meta.env.VITE_MARKETPLACE_CONTRACT,
  mockUsdt: import.meta.env.VITE_MOCK_USDT_CONTRACT
};

class ContractService {
  constructor() {
    this.hederaContractService = null;
    this.connected = false;
  }

  initialize(client, accountId) {
    if (client && accountId) {
      this.hederaContractService = new HederaContractService(client, accountId);
      this.connected = true;
      return true;
    }
    return false;
  }

  // Farm management
  async createFarm(name, description, location, fundingGoal, duration, yieldPercentage) {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.hederaContractService.createFarm(
      name, description, location, fundingGoal, duration, yieldPercentage
    );
  }

  async getFarm(farmId) {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.hederaContractService.getFarm(farmId);
  }

  async getFarmCount() {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.hederaContractService.getFarmCount();
  }

  // Investment functions
  async invest(farmId, amount) {
    if (!this.connected) throw new Error("Wallet not connected");
    // First approve USDT transfer
    await this.hederaContractService.approveUSDT(CONTRACT_IDS.agriYield, amount);
    // Then invest
    return this.hederaContractService.invest(farmId, amount);
  }

  async disburseFunds(farmId) {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.hederaContractService.disburseFunds(farmId);
  }

  // Farm shares functions
  async getShareBalance(accountId, farmId) {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.hederaContractService.getShareBalance(accountId, farmId);
  }

  // USDT functions
  async getUSDTBalance(accountId) {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.hederaContractService.getUSDTBalance(accountId);
  }

  // Marketplace functions - placeholder for now
  async getListings() {
    // For demo purposes, return empty array
    return [];
  }
}

export const contractService = new ContractService();
