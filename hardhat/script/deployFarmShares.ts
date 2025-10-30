import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Deploying FarmShares to network:", network.name);

  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", deployer.address);

  const FarmShares = await ethers.getContractFactory("FarmShares");
  const farmShares = await FarmShares.deploy("ipfs://");
  await farmShares.deployed();

  console.log("FarmShares deployed at:", farmShares.address);

  // Save addresses to artifacts
  const addressesPath = path.join(__dirname, "../artifacts/addresses.json");
  let addresses = {};
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  }
  
  addresses[network.name] = {
    ...addresses[network.name],
    farmShares: farmShares.address
  };
  
  fs.mkdirSync(path.dirname(addressesPath), { recursive: true });
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("Saved addresses to artifacts/addresses.json");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
