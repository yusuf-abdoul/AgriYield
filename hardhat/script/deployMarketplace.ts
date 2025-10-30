import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Deploying Marketplace to network:", network.name);

  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", deployer.address);

  const args = process.argv.slice(2);
  if (args.length < 1) throw new Error("Usage: deploy <agriYieldAddr>");

  const [agriYieldAddr] = args;
  
  // Read HTS token address from artifacts
  const husdtPath = path.join(__dirname, "../artifacts/husdt.json");
  if (!fs.existsSync(husdtPath)) {
    throw new Error("hUSDT token not found. Please run 'npx hardhat run script/create_husdt.ts' first");
  }
  
  const husdtData = JSON.parse(fs.readFileSync(husdtPath, 'utf8'));
  const tokenAddr = husdtData.solidityAddress;
  console.log("Using HTS token address:", tokenAddr);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(tokenAddr, agriYieldAddr);
  await marketplace.deployed();

  console.log("Marketplace deployed at:", marketplace.address);

  // Save addresses to artifacts
  const addressesPath = path.join(__dirname, "../artifacts/addresses.json");
  let addresses = {};
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  }
  
  addresses[network.name] = {
    ...addresses[network.name],
    marketplace: marketplace.address
  };
  
  fs.mkdirSync(path.dirname(addressesPath), { recursive: true });
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("Updated addresses in artifacts/addresses.json");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
