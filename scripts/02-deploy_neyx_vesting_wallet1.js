require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Last deployment : 0xfa34873c3c4839da50bd34441a6463d905fe9d3e
  
  // Parameters for the vesting wallet
  const beneficiaryAddress = "0xcDF03a01eCb7fEa6f1235eee30b01d2333d99E69"; // EthDev2
  const startTimestamp = Math.floor(new Date("2025-01-27T00:00:00Z").getTime() / 1000); // 27 January 2025
  const durationSeconds = 7 * 24 * 60 * 60; // 1 week in seconds

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