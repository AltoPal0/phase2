import { ethers } from "hardhat";
import { Wallet } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

const networkName = hre.network.name;

// Map of known WNEYXT addresses by network
const WNEYXT_ADDRESSES: Record<string, string> = {
  polygon_mainnet: "0x6dcefF586744F3F1E637FE5eE45e0ff3880bb761",
  polygon_amoy: "0x5911FF908512f9CAC1FC8727dDBfca208F164814"
};

const recipients: { address: string; amount: string }[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "recipients.json"), "utf8")
);

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

async function main() {


  const provider = ethers.provider;
  const privateKey = process.env.POCKET_PRIVATE_KEY_9;
  if (!privateKey) throw new Error("Missing POCKET_PRIVATE_KEY_9 in .env");

  const signer = new Wallet(privateKey, provider);

  const tokenAddress = WNEYXT_ADDRESSES[networkName];
  if (!tokenAddress) {
    throw new Error(`Unsupported network: ${networkName}`);
  }

  console.log(`🔌 Connected to ${networkName}`);
  console.log(`🔑 Using signer: ${signer.address}`);
  console.log(`🏷  Token address: ${tokenAddress}`);

  const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

  const code = await ethers.provider.getCode(tokenAddress);
  if (code === "0x") {
    throw new Error(`🚨 No contract deployed at ${tokenAddress} on this network!`);
  }

  const decimals = await token.decimals();

  for (const { address, amount } of recipients) {
    const amountInWei = ethers.parseUnits(amount, decimals);
    console.log(`➡️ Transferring ${amount} WNEYXT to ${address}...`);

    try {
      const tx = await token.transfer(address, amountInWei);
      await tx.wait();
      console.log(`✅ Success: ${tx.hash}`);
    } catch (err) {
      console.error(`❌ Failed for ${address}:`, err);
    }
  }
}

main().catch(console.error);