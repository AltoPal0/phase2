require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Last deployment : 0xA0e06993446D0FA0c4f81FE455Fb0D19321506bA
  
  // Parameters for the vesting wallet
  const beneficiaryAddress = "0xc661BCE4388257014AD805aA1f7eDe87FeEaa6C9"; // EthDev4
  const startTimestamp = Math.floor(new Date("2025-02-06T00:00:00Z").getTime() / 1000); 
  const durationSeconds = 14 * 24 * 60 * 60; // 2 week in seconds

  // Get the NEYXVestingWallet contract factory
  const NEYXVestingWallet = await ethers.getContractFactory("NEYXVestingWallet");
  console.log("Deploying NEYXVestingWallet...");

  // Deploy the vesting wallet
  const vestingWallet = await NEYXVestingWallet.deploy(beneficiaryAddress, startTimestamp, durationSeconds);
  await vestingWallet.waitForDeployment();
  const vestingWalletAddress = await vestingWallet.getAddress();
  console.log(`NEYXVestingWallet deployed to: ${vestingWalletAddress} with Beneficiary ${beneficiaryAddress}`);
  console.log(`Vesting contract owner : ${vestingWallet.owner()}`)
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });