# AgriYield Deployment Guide

This guide walks you through deploying the AgriYield dApp with HTS token integration and HashPack wallet connection.

## Prerequisites

1. **Hedera Testnet Account**: Get a testnet account with HBAR for gas fees
2. **HashPack Wallet**: Install HashPack browser extension or mobile app
3. **Node.js**: Version 18+ required
4. **Git**: For cloning the repository

## Setup

### 1. Environment Configuration

Create a `.env` file in the project root:

```bash
# Hedera Operator Credentials
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_KEY=your_ed25519_private_key_here

# WalletConnect Project ID (optional, for Kabila wallet)
VITE_WC_PROJECT_ID=your_walletconnect_project_id_here
```

**Getting Hedera Credentials:**
1. Create a testnet account at [portal.hedera.com](https://portal.hedera.com)
2. Generate a new key pair (ED25519 recommended)
3. Fund your account with testnet HBAR from the faucet
4. Use the account ID and private key in your `.env` file

### 2. Install Dependencies

```bash
# Install hardhat dependencies
cd hardhat
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install backend dependencies (if needed)
cd ../backend
npm install
```

## Deployment Process

### Step 1: Create HTS Token

First, create the KYC-enabled HTS token:

```bash
cd hardhat
npx hardhat run script/create_husdt.ts --network hederaTestnet
```

This will:
- Create a fungible token named "Hedera USD Tether" (hUSDT)
- Enable KYC and infinite supply
- Save token ID and Solidity address to `artifacts/husdt.json`

### Step 2: Deploy All Contracts

Deploy all contracts in the correct order:

```bash
npx hardhat run script/deployAll.ts --network hederaTestnet
```

This script will:
1. Deploy FarmShares contract
2. Deploy AgriYield contract with HTS token integration
3. Transfer FarmShares ownership to AgriYield
4. Deploy Marketplace contract
5. Save all addresses to `artifacts/addresses.json`

### Alternative: Manual Deployment

If you prefer to deploy contracts individually:

```bash
# 1. Deploy FarmShares
npx hardhat run script/deployFarmShares.ts --network hederaTestnet

# 2. Deploy AgriYield (requires FarmShares address)
npx hardhat run script/deployAgriYield.ts --network hederaTestnet -- <farmSharesAddress>

# 3. Deploy Marketplace (requires AgriYield address)
npx hardhat run script/deployMarketplace.ts --network hederaTestnet -- <agriYieldAddress>
```

## Frontend Setup

### 1. Start Development Server

```bash
cd frontend
npm run dev
```

### 2. Wallet Connection

The frontend supports two wallet connection methods:

#### HashPack (Recommended)
1. Install HashPack browser extension or mobile app
2. Click "Connect Wallet" in the dApp
3. Approve the connection in HashPack

#### WalletConnect (Kabila)
1. Set `VITE_WC_PROJECT_ID` in your `.env` file
2. Click "Connect with Kabila"
3. Scan QR code with Kabila wallet

## Backend API (Optional)

If you need the backend API for KYC management:

```bash
cd backend
npm start
```

The API provides endpoints for:
- `POST /api/admin/associate` - Associate token with account
- `POST /api/admin/grant-kyc` - Grant KYC status
- `POST /api/admin/revoke-kyc` - Revoke KYC status
- `POST /api/admin/mint` - Mint tokens to account

## Testing the Complete Flow

1. **Connect Wallet**: Use HashPack to connect your testnet account
2. **Associate Token**: Call the backend API to associate your account with hUSDT
3. **Grant KYC**: Use the backend API to grant KYC status to your account
4. **Mint Tokens**: Mint test hUSDT tokens to your account
5. **Invest in Farm**: Use the frontend to invest in agricultural projects
6. **Purchase from Marketplace**: Buy and sell agricultural products

## Troubleshooting

### Common Issues

1. **"Cannot set properties of undefined (setting 'url')"**
   - Fixed by updating Vite config with Buffer polyfill
   - Ensure `buffer` package is installed

2. **HashPack Connection Fails**
   - Ensure HashPack extension is installed and enabled
   - Check browser console for detailed error messages
   - Try refreshing the page and reconnecting

3. **Token Creation Fails**
   - Verify Hedera credentials in `.env` file
   - Ensure account has sufficient HBAR for gas fees
   - Check that account ID and private key are correct format

4. **Contract Deployment Fails**
   - Ensure HTS token was created successfully
   - Verify network configuration in `hardhat.config.ts`
   - Check that deployer account has sufficient HBAR

### Getting Help

- Check browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed
- Test with Hedera testnet first before mainnet

## Network Configuration

The project is configured for:
- **Testnet**: Hedera testnet (chainId: 296)
- **Mainnet**: Hedera mainnet (chainId: 295)

Update `hardhat.config.ts` to switch between networks.

## Security Notes

- Never commit your `.env` file to version control
- Use testnet for development and testing
- Verify all contract addresses before using in production
- Keep your private keys secure and never share them

