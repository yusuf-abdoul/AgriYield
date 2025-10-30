import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Deploying to network:", network.name);

  // Use the first signer
  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", deployer.address);

  const args = process.argv.slice(2);
  if (args.length < 1) throw new Error("Usage: deploy <farmSharesAddr> [admin]");

  const [farmSharesAddr, admin = deployer.address] = args;
  
  // Read HTS token address from artifacts
  const husdtPath = path.join(__dirname, "../artifacts/husdt.json");
  if (!fs.existsSync(husdtPath)) {
    throw new Error("hUSDT token not found. Please run 'npx hardhat run script/create_husdt.ts' first");
  }
  
  const husdtData = JSON.parse(fs.readFileSync(husdtPath, 'utf8'));
  const tokenAddr = husdtData.solidityAddress;
  console.log("Using HTS token address:", tokenAddr);

  // Determine precompile address
  let precompileAddr: string;
  if (network.name === "hardhat") {
    // Expect a mock precompile to be deployed locally
    // Either hardcode after deploying mock or deploy it here
    console.log("Using local mock precompile for Hardhat");
    const MockPrecompile = await ethers.getContractFactory("MockHederaPrecompile");
    const mock = await MockPrecompile.deploy();
    await mock.deployed();
    precompileAddr = mock.address;
    console.log("Mock precompile deployed at:", precompileAddr);
  } else {
    // Hedera testnet/mainnet
    precompileAddr = "0x167";
    console.log("Using Hedera HTS precompile at:", precompileAddr);
  }

  const AgriYield = await ethers.getContractFactory("AgriYield");
  const ag = await AgriYield.deploy(farmSharesAddr, tokenAddr, admin);
  await ag.deployed();

  console.log("AgriYield deployed at:", ag.address);

  // Transfer ownership of FarmShares to AgriYield
  const FarmShares = await ethers.getContractFactory("FarmShares");
  const farmShares = FarmShares.attach(farmSharesAddr);
  await farmShares.setAgriYield(ag.address);
  console.log("FarmShares ownership transferred to AgriYield");

  // Save addresses to artifacts
  const addressesPath = path.join(__dirname, "../artifacts/addresses.json");
  let addresses = {};
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  }
  
  addresses[network.name] = {
    ...addresses[network.name],
    farmShares: farmSharesAddr,
    agriYield: ag.address,
    husdt: tokenAddr,
    admin: admin
  };
  
  fs.mkdirSync(path.dirname(addressesPath), { recursive: true });
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("Saved addresses to artifacts/addresses.json");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
