require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Parameters
  const vestingWalletAddress = "0xfa34873c3c4839da50bd34441a6463d905fe9d3e"; // Replace with your deployed vesting contract address
  const beneficiaryPrivateKey = process.env.BENEFICIARY_PRIVATE_KEY; // Load private key for 0xcDF03a01eCb7fEa6f1235eee30b01d2333d99E69

  if (!beneficiaryPrivateKey) {
    throw new Error("BENEFICIARY_PRIVATE_KEY is not set in the .env file");
  }

  // Initialize the signer for the beneficiary address
  const beneficiarySigner = new ethers.Wallet(beneficiaryPrivateKey, ethers.provider);

  console.log("Beneficiary Address:", beneficiarySigner.address);

  // Ensure the beneficiary address matches the expected address
  const expectedBeneficiary = "0xcDF03a01eCb7fEa6f1235eee30b01d2333d99E69";
  if (beneficiarySigner.address.toLowerCase() !== expectedBeneficiary.toLowerCase()) {
    throw new Error("The private key does not match the beneficiary address.");
  }

  // Attach to the vesting contract
  const NEYXVestingWallet = await ethers.getContractFactory("NEYXVestingWallet");
  const vestingWallet = NEYXVestingWallet.attach(vestingWalletAddress);

  try {
    // Attempt to withdraw tokens from the vesting contract
    console.log("Attempting to withdraw tokens from the vesting contract...");
    const tokenAddress = "0xf55eb9Eeb340d047AE1373c963fF2370a12a1e86"; // Replace with the NEYXT token address
    const tx = await vestingWallet.connect(beneficiarySigner)["release(address)"](tokenAddress);
    await tx.wait();

    console.log("Withdrawal successful. This should not happen before the vesting start date.");
  } catch (error) {
    console.error("Withdrawal failed as expected:", error.message);
  }
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });