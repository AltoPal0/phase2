const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Last run on sepolia : 
  // NEYXT Token deployed to: 0xf55eb9Eeb340d047AE1373c963fF2370a12a1e86
  const initialOwner = "0x34FD675B1CFf93031F0B80ed837c063952aCCB1f"; // The address that will own the contract
  

  const ethdev = "0x34FD675B1CFf93031F0B80ed837c063952aCCB1f";


  const initialWallets = [

    ethdev

  ]; // Wallet addresses to receive tokens
  const initialBalances = [
    ethers.parseUnits("1000000000", 18), 
  ]; // Token balances corresponding to wallets

  // Check initial wallet and balance length
  if (initialWallets.length !== initialBalances.length) {
    throw new Error("Wallets and balances length mismatch");
  }

  // Get the contract factory
  const NEYX_Token = await ethers.getContractFactory("NEYX_Token");

  // Deploy the contract
  const neyxToken = await NEYX_Token.deploy(initialOwner, initialWallets, initialBalances);

  // Wait for deployment to complete
  await neyxToken.waitForDeployment();
  console.log("NEYXT Token deployed to:", await neyxToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });