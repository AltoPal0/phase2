// scripts/queries/fetch-nft-holders.ts
import { ethers } from "hardhat";
import { Log, EventLog } from "ethers";



const CONTRACT_ADDRESS = "0xE6C36094B8BFB325BA42A3448174e947a0f51E17";

const ERC721_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

async function main() {
  const provider = ethers.provider;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC721_ABI, provider);

  const transferEvents = await contract.queryFilter("Transfer", 0, "latest");

  const owners = new Map<string, number>();

  for (const event of transferEvents) {
    if (!("args" in event)) continue; // 👈 Type guard for EventLog
  
    const from = event.args.from;
    const to = event.args.to;
  
    if (from && from !== ethers.ZeroAddress) {
      owners.set(from, (owners.get(from) || 0) - 1);
    }
  
    if (to && to !== ethers.ZeroAddress) {
      owners.set(to, (owners.get(to) || 0) + 1);
    }
  }

  const holders = [...owners.entries()]
    .filter(([_, count]) => count > 0)
    .map(([address]) => address.toLowerCase());

  console.log("🎉 NFT Holders:");
  console.log(holders);
  console.log(`Total unique holders: ${holders.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});