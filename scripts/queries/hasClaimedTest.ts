import { ethers } from "hardhat";

const contractAddress = "0xf55eb9Eeb340d047AE1373c963fF2370a12a1e86"; 
const eventId = BigInt("20250401001"); // example
const userAddress = "0x637246DBFc706caD0E8A59838Dc1dc3A39f618Ef";

async function main() {
    const [signer] = await ethers.getSigners();

    const nft = await ethers.getContractAt("ClaimableNFT", contractAddress, signer);

    const claimed = await nft.hasClaimed(eventId, userAddress);

    console.log(`User ${userAddress} has claimed for event ${eventId}:`, claimed);
}

main().catch(console.error);