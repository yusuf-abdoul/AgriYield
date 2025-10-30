import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("🚀 Deploying all contracts to network:", network.name);

  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", deployer.address);

  const args = process.argv.slice(2);
  const admin = args[0] || deployer.address;
  console.log("Admin address:", admin);

  // Use existing HTS token from .env and normalize to 0x-prefixed address
  let mockUsdtAddress = process.env.MOCK_USDT_ADDRESS;
  if (!mockUsdtAddress) {
    console.log("❌ No MOCK_USDT_ADDRESS found in .env file");
    process.exit(1);
  }
  if (!mockUsdtAddress.startsWith("0x")) {
    mockUsdtAddress = `0x${mockUsdtAddress}`;
  }
  console.log("Using existing token address:", mockUsdtAddress);
  
  const husdtData = { solidityAddress: mockUsdtAddress, tokenId: "From .env" };
  console.log("✅ Using HTS token:", husdtData.tokenId, "Solidity:", husdtData.solidityAddress);

  // Step 2: Deploy FarmShares
  console.log("\n📦 Deploying FarmShares...");
  const FarmShares = await ethers.getContractFactory("FarmShares");
  const farmShares = await FarmShares.deploy("ipfs://");
  await farmShares.waitForDeployment();
  const farmSharesAddress = await farmShares.getAddress();
  console.log("✅ FarmShares deployed at:", farmSharesAddress);

  // Step 3: Deploy AgriYield
  console.log("\n📦 Deploying AgriYield...");
  
  // Determine precompile address
  let precompileAddr: string;
  if (network.name === "hardhat") {
    console.log("Using local mock precompile for Hardhat");
    const MockPrecompile = await ethers.getContractFactory("MockHederaPrecompile");
    const mock = await MockPrecompile.deploy();
    await mock.waitForDeployment();
    precompileAddr = await mock.getAddress();
    console.log("Mock precompile deployed at:", precompileAddr);
  } else {
    precompileAddr = "0x167";
    console.log("Using Hedera HTS precompile at:", precompileAddr);
  }

  const AgriYield = await ethers.getContractFactory("AgriYield");
  const agriYield = await AgriYield.deploy(farmSharesAddress, husdtData.solidityAddress, admin);
  await agriYield.waitForDeployment();
  const agriYieldAddress = await agriYield.getAddress();
  console.log("✅ AgriYield deployed at:", agriYieldAddress);

  // Step 4: Transfer FarmShares ownership to AgriYield
  console.log("\n🔄 Transferring FarmShares ownership to AgriYield...");
  await farmShares.setAgriYield(agriYieldAddress);
  console.log("✅ FarmShares ownership transferred");

  // Step 5: Deploy Marketplace
  console.log("\n📦 Deploying Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(husdtData.solidityAddress, agriYieldAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ Marketplace deployed at:", marketplaceAddress);

  // Step 6: Save all addresses
  console.log("\n💾 Saving deployment addresses...");
  const addressesPath = path.join(__dirname, "../artifacts/addresses.json");
  const addresses = {
    [network.name]: {
      farmShares: farmSharesAddress,
      agriYield: agriYieldAddress,
      marketplace: marketplaceAddress,
      husdt: husdtData.solidityAddress,
      husdtTokenId: husdtData.tokenId,
      admin: admin,
      deployer: deployer.address
    }
  };

  fs.mkdirSync(path.dirname(addressesPath), { recursive: true });
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("✅ Saved addresses to artifacts/addresses.json");

  // Step 7: Summary
  console.log("\n🎉 Deployment Complete!");
  console.log("==========================================");
  console.log("Network:", network.name);
  console.log("HTS Token ID:", husdtData.tokenId);
  console.log("HTS Token Address:", husdtData.solidityAddress);
  console.log("FarmShares:", farmSharesAddress);
  console.log("AgriYield:", agriYieldAddress);
  console.log("Marketplace:", marketplaceAddress);
  console.log("Admin:", admin);
  console.log("==========================================");
}

main().catch((e) => {
  console.error("❌ Deployment failed:", e);
  process.exitCode = 1;
});

