import { ethers } from "hardhat";

async function main() {
  const Mock = await ethers.getContractFactory("MockHederaPrecompile");
  const mock = await Mock.deploy();
  await mock.deployed();
  console.log("MockPrecompile deployed to:", mock.address);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
