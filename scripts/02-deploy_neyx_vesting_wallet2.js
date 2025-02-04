require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Last deployment : 0xAf4fa52Ec7B6d9288E7aF214a3b6a98e28B923A4
  
  // Parameters for the vesting wallet
  const beneficiaryAddress = "0x08dFDa43E716651b320869B7a95447C75F564175"; // EthDev3
  const startTimestamp = Math.floor(new Date("2025-02-06T00:00:00Z").getTime() / 1000); 
  const durationSeconds = 14 * 24 * 60 * 60; // 2 week in seconds

  // Get the NEYXVestingWallet contract factory
  const NEYXVestingWallet = await ethers.getContractFactory("NEYXVestingWallet");
  console.log("Deploying NEYXVestingWallet...");

  // Deploy the vesting wallet
  const vestingWallet = await NEYXVestingWallet.deploy(beneficiaryAddress, startTimestamp, durationSeconds);
  await vestingWallet.waitForDeployment();
  const vestingWalletAddress = await vestingWallet.getAddress();
  console.log("NEYXVestingWallet deployed to:", vestingWalletAddress);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });