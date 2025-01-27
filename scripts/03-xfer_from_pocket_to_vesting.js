require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

function formatBalance(balance) {
    const fullTokens = BigInt(balance) / BigInt(1e18); // Convert from Wei to full tokens
    return new Intl.NumberFormat("en-US").format(fullTokens); // Format with thousands separators
  }

async function main() {
  // Vesting contract address
  const vestingWalletAddress = "0xfa34873c3c4839da50bd34441a6463d905fe9d3e";

  // Load the Pocket signer from the private key in .env
  const pocketSigner = new ethers.Wallet(process.env.POCKET_PRIVATE_KEY, ethers.provider);

  console.log("Pocket Address:", pocketSigner.address);
  console.log("Vesting Wallet Address:", vestingWalletAddress);

  // Attach to the deployed NEYX Token contract
  const NEYX_Token = await ethers.getContractFactory("NEYX_Token");
  const tokenAddress = "0xf55eb9Eeb340d047AE1373c963fF2370a12a1e86"; // Replace with the actual NEYX token contract address
  const neyxToken = NEYX_Token.attach(tokenAddress);

  // Check the balance of the Pocket address
  const pocketBalance = await neyxToken.balanceOf(pocketSigner.address);
  console.log(`Pocket Address Balance: ${formatBalance(pocketBalance)} NEYXT tokens`);

  if (pocketBalance > 0n) {
    // Transfer all funds to the vesting wallet
    console.log(`Transferring ${ethers.formatUnits(pocketBalance, 18)} NEYXT tokens to the vesting wallet...`);
    const transferTx = await neyxToken.connect(pocketSigner).transfer(vestingWalletAddress, pocketBalance);
    await transferTx.wait();
    console.log("Transfer complete.");
  } else {
    console.log("No tokens available in the Pocket address to transfer.");
  }
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });