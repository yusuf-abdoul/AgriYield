# AgriYield Setup Instructions

## 🚀 Quick Setup Guide

### 1. Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
# Hedera Operator Credentials (required for token creation and deployment)
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_KEY=your_ed25519_private_key_here

# WalletConnect Project ID (required for HashConnect v3)
# Get one at: https://cloud.walletconnect.com/
VITE_WC_PROJECT_ID=your_walletconnect_project_id_here
```

### 2. Get Required Credentials

#### Hedera Testnet Account
1. Go to [portal.hedera.com](https://portal.hedera.com)
2. Create a testnet account
3. Generate a new ED25519 key pair
4. Fund your account with testnet HBAR from the faucet
5. Copy your Account ID and Private Key to the `.env` file

#### WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up/Login and create a new project
3. Copy the Project ID to `VITE_WC_PROJECT_ID` in your `.env` file

### 3. Install Dependencies

```bash
# Install hardhat dependencies (includes Hedera SDK)
cd hardhat
npm install

# Install frontend dependencies (includes HashConnect v3)
cd ../frontend
npm install
```

### 4. Deploy the System

```bash
# Step 1: Create HTS Token
cd hardhat
npx hardhat run script/create_husdt.ts --network hederaTestnet

# Step 2: Deploy All Contracts
npx hardhat run script/deployAll.ts --network hederaTestnet
```

### 5. Start the Frontend

```bash
cd frontend
npm run dev
```

## 🔧 HashConnect v3 Integration

The frontend now uses HashConnect v3 with the following improvements:

- **Proper initialization** with LedgerId and Project ID
- **Automatic pairing modal** with QR code
- **Better error handling** and connection state management
- **Support for both HashPack extension and mobile app**

### Connection Flow
1. User clicks "Connect Wallet"
2. HashConnect opens a pairing modal with QR code
3. User scans QR code with HashPack mobile app or approves in extension
4. Connection is established with account information

## 🐛 Troubleshooting

### Common Issues

1. **"Project ID required" error**
   - Make sure you've set `VITE_WC_PROJECT_ID` in your `.env` file
   - Get a Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

2. **HashPack connection fails**
   - Ensure HashPack app/extension is installed
   - Check browser console for detailed error messages
   - Try refreshing the page

3. **Token creation fails**
   - Verify your Hedera credentials are correct
   - Ensure your account has sufficient HBAR for gas fees
   - Check that you're using testnet credentials

4. **Deployment fails**
   - Make sure the HTS token was created successfully first
   - Verify your account has enough HBAR for deployment
   - Check network configuration in `hardhat.config.ts`

### Getting Help
- Check browser console for detailed error messages
- Verify all environment variables are set correctly
- Test with Hedera testnet first
- Refer to the [HashConnect v3 documentation](https://github.com/Hashpack/hashconnect#readme)

## 📱 Wallet Support

### HashPack (Recommended)
- Browser extension: Install from Chrome/Firefox store
- Mobile app: Download from App Store/Google Play
- Supports both Hedera and EVM addresses

### Kabila (Alternative)
- Mobile wallet with WalletConnect support
- Requires WalletConnect Project ID
- Good for mobile-first experience

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Use testnet for development and testing
- Keep your private keys secure
- Verify all contract addresses before production use

