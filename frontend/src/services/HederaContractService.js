import { ContractId, ContractExecuteTransaction, ContractCallQuery, Hbar } from "@hashgraph/sdk";

export default class HederaContractService {
  static instance = null;
  static client = null;
  static accountId = null;

  constructor() {
    this.agriYieldContractId = import.meta.env.VITE_AGRI_YIELD_CONTRACT;
    this.farmSharesContractId = import.meta.env.VITE_FARM_SHARES_CONTRACT;
    this.marketplaceContractId = import.meta.env.VITE_MARKETPLACE_CONTRACT;
    this.mockUsdtContractId = import.meta.env.VITE_MOCK_USDT_CONTRACT;
  }

  static initialize(connector) {
    if (!HederaContractService.instance) {
      HederaContractService.instance = new HederaContractService();
    }
    
    HederaContractService.client = connector;
    
    // Update account ID when available
    if (connector.signers && connector.signers[0]) {
      HederaContractService.accountId = connector.signers[0].getAccountId().toString();
    }
    
    return HederaContractService.instance;
  }
  
  static getInstance() {
    if (!HederaContractService.instance) {
      HederaContractService.instance = new HederaContractService();
    }
    return HederaContractService.instance;
  }
  
  static updateAccountId(accountId) {
    HederaContractService.accountId = accountId;
  }
  
  static getInstance() {
    if (!HederaContractService.instance) {
      HederaContractService.instance = new HederaContractService();
    }
    return HederaContractService.instance;
  }

  // AgriYield Contract Functions
  async createFarm(name, description, location, fundingGoal, duration, yieldPercentage) {
    try {
      if (!HederaContractService.client || !HederaContractService.accountId) {
        throw new Error("Wallet not connected");
      }
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.agriYieldContractId)
        .setGas(1000000)
        .setFunction(
          "createFarm",
          [name, description, location, fundingGoal, duration, yieldPercentage]
        );

      const txResponse = await transaction.execute(HederaContractService.client);
      const receipt = await txResponse.getReceipt(HederaContractService.client);
      return receipt;
    } catch (error) {
      console.error("Error creating farm:", error);
      throw error;
    }
  }

  async invest(farmId, amount) {
    try {
      if (!HederaContractService.client || !HederaContractService.accountId) {
        throw new Error("Wallet not connected");
      }
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.agriYieldContractId)
        .setGas(1000000)
        .setFunction(
          "invest",
          [farmId, amount]
        );

      const txResponse = await transaction.execute(HederaContractService.client);
      const receipt = await txResponse.getReceipt(HederaContractService.client);
      return receipt;
    } catch (error) {
      console.error("Error investing in farm:", error);
      throw error;
    }
  }

  async getFarm(farmId) {
    try {
      if (!HederaContractService.client) {
        throw new Error("Wallet not connected");
      }
      
      const query = new ContractCallQuery()
        .setContractId(this.agriYieldContractId)
        .setGas(100000)
        .setFunction("getFarm", [farmId]);

      const response = await query.execute(HederaContractService.client);
      return response.getResult();
    } catch (error) {
      console.error("Error getting farm:", error);
      throw error;
    }
  }

  async getFarmCount() {
    try {
      if (!HederaContractService.client) {
        throw new Error("Wallet not connected");
      }
      
      const query = new ContractCallQuery()
        .setContractId(this.agriYieldContractId)
        .setGas(100000)
        .setFunction("getFarmCount", []);

      const response = await query.execute(HederaContractService.client);
      return response.getResult();
    } catch (error) {
      console.error("Error getting farm count:", error);
      throw error;
    }
  }

  // FarmShares Contract Functions
  async getShareBalance(farmId, account) {
    try {
      if (!HederaContractService.client) {
        throw new Error("Wallet not connected");
      }
      
      const accountToCheck = account || HederaContractService.accountId;
      
      const query = new ContractCallQuery()
        .setContractId(this.farmSharesContractId)
        .setGas(100000)
        .setFunction("balanceOf", [accountToCheck, farmId]);

      const response = await query.execute(HederaContractService.client);
      return response.getResult();
    } catch (error) {
      console.error("Error getting share balance:", error);
      throw error;
    }
  }

  // MockUSDT Contract Functions
  async approveUSDT(spender, amount) {
    try {
      if (!HederaContractService.client || !HederaContractService.accountId) {
        throw new Error("Wallet not connected");
      }
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.mockUsdtContractId)
        .setGas(1000000)
        .setFunction(
          "approve",
          [spender, amount]
        );

      const txResponse = await transaction.execute(HederaContractService.client);
      const receipt = await txResponse.getReceipt(HederaContractService.client);
      return receipt;
    } catch (error) {
      console.error("Error approving USDT:", error);
      throw error;
    }
  }

  async getUSDTBalance(account) {
    try {
      if (!HederaContractService.client) {
        throw new Error("Wallet not connected");
      }
      
      const accountToCheck = account || HederaContractService.accountId;
      
      const query = new ContractCallQuery()
        .setContractId(this.mockUsdtContractId)
        .setGas(100000)
        .setFunction("balanceOf", [accountToCheck]);

      const response = await query.execute(HederaContractService.client);
      return response.getResult();
    } catch (error) {
      console.error("Error getting USDT balance:", error);
      throw error;
    }
  }

  // KYC Functions for MockUSDT
  async grantKYC(account) {
    try {
      if (!HederaContractService.client || !HederaContractService.accountId) {
        throw new Error("Wallet not connected");
      }
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.mockUsdtContractId)
        .setGas(1000000)
        .setFunction(
          "grantKYC",
          [account]
        );

      const txResponse = await transaction.execute(HederaContractService.client);
      const receipt = await txResponse.getReceipt(HederaContractService.client);
      return receipt;
    } catch (error) {
      console.error("Error granting KYC:", error);
      throw error;
    }
  }

  async revokeKYC(account) {
    try {
      if (!HederaContractService.client || !HederaContractService.accountId) {
        throw new Error("Wallet not connected");
      }
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.mockUsdtContractId)
        .setGas(1000000)
        .setFunction(
          "revokeKYC",
          [account]
        );

      const txResponse = await transaction.execute(HederaContractService.client);
      const receipt = await txResponse.getReceipt(HederaContractService.client);
      return receipt;
    } catch (error) {
      console.error("Error revoking KYC:", error);
      throw error;
    }
  }

  async faucet() {
    try {
      if (!HederaContractService.client || !HederaContractService.accountId) {
        throw new Error("Wallet not connected");
      }
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.mockUsdtContractId)
        .setGas(1000000)
        .setFunction(
          "faucet",
          [HederaContractService.accountId]
        );

      const txResponse = await transaction.execute(HederaContractService.client);
      const receipt = await txResponse.getReceipt(HederaContractService.client);
      return receipt;
    } catch (error) {
      console.error("Error claiming from faucet:", error);
      throw error;
    }
  }

  async checkKYCStatus(account) {
    try {
      if (!HederaContractService.client) {
        throw new Error("Wallet not connected");
      }
      
      const accountToCheck = account || HederaContractService.accountId;
      
      // Try to transfer a zero amount to check if KYC is granted
      // This will fail with ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN if KYC is not granted
      try {
        const query = new ContractCallQuery()
          .setContractId(this.mockUsdtContractId)
          .setGas(100000)
          .setFunction("tokenAddress", []);
        
        const tokenAddressResponse = await query.execute(HederaContractService.client);
        const tokenAddress = tokenAddressResponse.getResult();
        
        // Use the HTS precompile address to check KYC status
        const htsPrecompileAddress = "0x0000000000000000000000000000000000000167";
        
        const kycQuery = new ContractCallQuery()
          .setContractId(htsPrecompileAddress)
          .setGas(100000)
          .setFunction("isKyc", [tokenAddress, accountToCheck]);
        
        const response = await kycQuery.execute(HederaContractService.client);
        return response.getResult();
      } catch (error) {
        console.log("KYC check error:", error);
        // If we can't check directly, assume KYC is not granted
        return [0, false];
      }
    } catch (error) {
      console.error("Error checking KYC status:", error);
      throw error;
    }
  }
}

// Export the service
export { HederaContractService };